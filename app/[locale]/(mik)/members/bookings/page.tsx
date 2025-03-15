"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, parseISO } from "date-fns";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Modal,
} from "@mui/material";
import {
  useGetIdentity,
  useList,
  useCreate,
  useUpdate,
  useDelete,
  HttpError,
} from "@refinedev/core";

// Interfaces for bookings and resources.
interface Booking {
  id?: string; // Marked optional for new records.
  profile_id: string;
  resource_id: string;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
}

interface Resource {
  id: string;
  name: string;
}

// Helper: format date strings for a datetime-local input.
const formatDateForInput = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), "yyyy-MM-dd'T'HH:mm");
  } catch {
    return "";
  }
};

interface BookingModalProps {
  open: boolean;
  booking: Booking | null;
  isEditable: boolean;
  onClose: () => void;
  onSave: (booking: Booking) => void;
  onDelete: (bookingId: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  open,
  booking,
  isEditable,
  onClose,
  onSave,
  onDelete,
}) => {
  const [localBooking, setLocalBooking] = useState<Booking | null>(booking);
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalBooking(booking);
    setError("");
  }, [booking]);

  if (!localBooking) return null;

  const handleChange = (field: keyof Booking, value: string) => {
    setLocalBooking((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSaveClick = () => {
    if (!localBooking.start_time || !localBooking.end_time) {
      setError("Start and End times are required.");
      return;
    }
    onSave(localBooking);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: { xs: "90%", sm: 400 },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {localBooking.id
            ? isEditable
              ? "Edit Booking"
              : "View Booking"
            : "New Booking"}
        </Typography>
        <TextField
          fullWidth
          label="Start Time"
          type="datetime-local"
          value={formatDateForInput(localBooking.start_time)}
          onChange={(e) =>
            handleChange("start_time", new Date(e.target.value).toISOString())
          }
          sx={{ mb: 2 }}
          disabled={!isEditable}
        />
        <TextField
          fullWidth
          label="End Time"
          type="datetime-local"
          value={formatDateForInput(localBooking.end_time)}
          onChange={(e) =>
            handleChange("end_time", new Date(e.target.value).toISOString())
          }
          sx={{ mb: 2 }}
          disabled={!isEditable}
        />
        {error && (
          <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
            Error: {error}
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {isEditable && (
            <>
              <Button variant="contained" onClick={handleSaveClick}>
                Save
              </Button>
              {localBooking.id && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onDelete(localBooking.id!)}
                >
                  Delete
                </Button>
              )}
            </>
          )}
          <Button variant="outlined" onClick={onClose}>
            {isEditable ? "Cancel" : "Close"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default function ResourceBookingCal() {
  const t = useTranslations("HomePage");

  // Get current user identity.
  const { data: identity } = useGetIdentity<{ id: string }>();
  const currentUserId = identity?.id || "default-user";

  // Fetch all bookings.
  const {
    data: bookingsData,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
    refetch: refetchBookings,
  } = useList<Booking, HttpError>({
    resource: "bookings",
    meta: { select: "*" },
  });
  const allBookings = bookingsData?.data || [];

  // Fetch all resources.
  const { data: resourcesData } = useList<Resource, HttpError>({
    resource: "resources",
    meta: { select: "*" },
  });
  const resources = resourcesData?.data || [];

  // Refine mutations for CRUD operations.
  const { mutate: createBookingMutate } = useCreate<Booking, HttpError>();
  const { mutate: updateBookingMutate } = useUpdate<Booking, HttpError>();
  const { mutate: deleteBookingMutate } = useDelete<Booking, HttpError>();

  // State for resource filtering.
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  // Modal state.
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditable, setIsEditable] = useState(false);

  // When a user clicks on an event.
  const handleEventClick = (info: any) => {
    const bookingId = info.event.id;
    const booking = allBookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsEditable(booking.profile_id === currentUserId);
      setModalOpen(true);
    }
  };

  // When a date range is selected in a resource calendar.
  const handleResourceDateSelect =
    (resourceId: string) => (selection: { start: Date; end: Date }) => {
      const newBooking: Booking = {
        profile_id: currentUserId,
        resource_id: resourceId,
        start_time: selection.start.toISOString(),
        end_time: selection.end.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setSelectedBooking(newBooking);
      setIsEditable(true);
      setModalOpen(true);
    };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  // Save booking: if no id, omit the id field so the backend can auto-generate it.
  const handleSaveBooking = (booking: Booking) => {
    if (!booking.id) {
      const { id, ...bookingData } = booking; // Remove id before creation.
      createBookingMutate(
        {
          resource: "bookings",
          values: bookingData,
        },
        {
          onSuccess: () => {
            refetchBookings();
            closeModal();
          },
          onError: (error) => {
            console.error("Error creating booking", error);
          },
        }
      );
    } else {
      updateBookingMutate(
        {
          resource: "bookings",
          id: booking.id,
          values: { ...booking, updated_at: new Date().toISOString() },
        },
        {
          onSuccess: () => {
            refetchBookings();
            closeModal();
          },
          onError: (error) => {
            console.error("Error updating booking", error);
          },
        }
      );
    }
  };

  // Delete a booking.
  const handleDeleteBooking = (bookingId: string) => {
    deleteBookingMutate(
      {
        resource: "bookings",
        id: bookingId,
      },
      {
        onSuccess: () => {
          refetchBookings();
          closeModal();
        },
        onError: (error) => {
          console.error("Error deleting booking", error);
        },
      }
    );
  };

  // Compute events for the current user's bookings.
  const userEvents = allBookings
    .filter((booking) => booking.profile_id === currentUserId)
    .map((booking) => ({
      id: booking.id,
      title: "Booking",
      start: booking.start_time,
      end: booking.end_time,
      extendedProps: {
        profile_id: booking.profile_id,
        resource_id: booking.resource_id,
      },
    }));

  return (
    <Box sx={{ p: 2 }}>
      {/* Multi-select for resources */}
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel id="resource-multiselect-label">
          Select Resources
        </InputLabel>
        <Select
          labelId="resource-multiselect-label"
          multiple
          value={selectedResources}
          onChange={(e) =>
            setSelectedResources(
              typeof e.target.value === "string"
                ? e.target.value.split(",")
                : e.target.value
            )
          }
          input={<OutlinedInput label="Select Resources" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(selected as string[]).map((value) => {
                const resource = resources.find((r) => r.id === value);
                return (
                  <Chip
                    key={value}
                    label={resource ? resource.name : value}
                  />
                );
              })}
            </Box>
          )}
        >
          {resources.map((resource) => (
            <MenuItem key={resource.id} value={resource.id}>
              {resource.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* User's personal booking calendar */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        My Bookings
      </Typography>
      <FullCalendar
        timeZone="local"
        nowIndicator
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        selectable
        eventClick={handleEventClick}
        events={userEvents}
        height="auto"
      />

      {/* Calendars for each selected resource */}
      {selectedResources.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 4 }}>
          {selectedResources.map((resourceId) => {
            const resource = resources.find((r) => r.id === resourceId);
            const events = allBookings
              .filter((booking) => booking.resource_id === resourceId)
              .map((booking) => ({
                id: booking.id,
                title: "Booking",
                start: booking.start_time,
                end: booking.end_time,
                extendedProps: {
                  profile_id: booking.profile_id,
                  resource_id: booking.resource_id,
                },
              }));
            return (
              <Box
                key={resourceId}
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Calendar for Resource: {resource?.name || resourceId}
                </Typography>
                <FullCalendar
                  timeZone="local"
                  nowIndicator
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridDay"
                  selectable
                  select={handleResourceDateSelect(resourceId)}
                  eventClick={handleEventClick}
                  events={events}
                  height="auto"
                />
              </Box>
            );
          })}
        </Box>
      )}

      {/* Booking modal for create/edit/view */}
      <BookingModal
        open={modalOpen}
        booking={selectedBooking}
        isEditable={isEditable}
        onClose={closeModal}
        onSave={handleSaveBooking}
        onDelete={handleDeleteBooking}
      />
    </Box>
  );
}
