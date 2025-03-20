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
  useShow,
} from "@refinedev/core";

// --------------------
// Interfaces
// --------------------

interface Booking {
  id?: string; // Optional for new records.
  profile_id: string;
  resource_id: string;
  start_time: string;
  end_time: string;
  title?: string;
  notes?: string;
  instructor_id?: string;
  flight_type?: string;
  created_at?: string;
  updated_at?: string;
}

interface Resource {
  id: string;
  name: string;
}

export interface Instructor {
  id: string;
  name: string;
}

// Dummy flight type options.
const flightTypeOptions = Array.from(
  new Set(["Private", "Commercial", "Cargo", "Training"])
);

// --------------------
// Helper Components
// --------------------

function ProfileName({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "first_name,last_name" },
    queryOptions: { enabled: !!profileId },
  });
  const profileData = queryResult?.data?.data as
    | { first_name: string; last_name: string }
    | undefined;
  if (!profileData) return <span>Loading...</span>;
  return (
    <span>
      {profileData.first_name} {profileData.last_name}
    </span>
  );
}

function InstructorName({ instructorId }: { instructorId: string }) {
  const { queryResult } = useShow({
    resource: "instructors",
    id: instructorId,
    meta: { select: "profile_id" },
    queryOptions: { enabled: !!instructorId },
  });
  const data = queryResult?.data?.data as { profile_id: string } | undefined;
  if (!data) return <span>Loading...</span>;
  return <ProfileName profileId={data.profile_id} />;
}

const formatDateForInput = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), "yyyy-MM-dd'T'HH:mm");
  } catch {
    return "";
  }
};

// --------------------
// Booking Modal Component
// --------------------

interface BookingModalProps {
  open: boolean;
  booking: Booking | null;
  isEditable: boolean;
  instructors: Instructor[];
  onClose: () => void;
  onSave: (booking: Booking) => void;
  onDelete: (bookingId: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  open,
  booking,
  isEditable,
  instructors,
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

        {/* Additional Details Section */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Additional Details
        </Typography>
        <TextField
          fullWidth
          label="Title"
          value={localBooking.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          sx={{ mb: 2 }}
          disabled={!isEditable}
        />
        <TextField
          fullWidth
          label="Notes"
          value={localBooking.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          sx={{ mb: 2 }}
          multiline
          rows={3}
          disabled={!isEditable}
        />
        <FormControl fullWidth sx={{ mb: 2 }} disabled={!isEditable}>
          <InputLabel id="instructor-label">Instructor</InputLabel>
          <Select
            labelId="instructor-label"
            value={localBooking.instructor_id || ""}
            label="Instructor"
            onChange={(e) =>
              handleChange("instructor_id", e.target.value as string)
            }
          >
            {instructors.length > 0 ? (
              instructors.map((instr) => (
                <MenuItem key={instr.id} value={instr.id}>
                  <InstructorName instructorId={instr.id} />
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">Loading instructors...</MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }} disabled={!isEditable}>
          <InputLabel id="flight-type-label">Flight Type</InputLabel>
          <Select
            labelId="flight-type-label"
            value={localBooking.flight_type || ""}
            label="Flight Type"
            onChange={(e) =>
              handleChange("flight_type", e.target.value as string)
            }
          >
            {flightTypeOptions.map((ft) => (
              <MenuItem key={ft} value={ft}>
                {ft}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

// --------------------
// Main Calendar Component
// --------------------

export default function ResourceBookingCal() {
  const t = useTranslations("HomePage");

  const { data: identity } = useGetIdentity<{ id: string }>();
  const currentUserId = identity?.id || "default-user";

  const { data: instructorData } = useList<Instructor>({
    resource: "instructors",
    meta: { select: "*" },
  });
  const instructors = instructorData?.data || [];

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

  const { data: resourcesData } = useList<Resource, HttpError>({
    resource: "resources",
    meta: { select: "*" },
  });
  const resources = resourcesData?.data || [];

  const { mutate: createBookingMutate } = useCreate<Booking, HttpError>();
  const { mutate: updateBookingMutate } = useUpdate<Booking, HttpError>();
  const { mutate: deleteBookingMutate } = useDelete<Booking, HttpError>();

  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditable, setIsEditable] = useState(false);

  const isBookingOverlapping = (newBooking: Booking): boolean => {
    const newStart = new Date(newBooking.start_time);
    const newEnd = new Date(newBooking.end_time);
    return allBookings.some((existingBooking) => {
      if (existingBooking.resource_id !== newBooking.resource_id) return false;
      if (existingBooking.id && existingBooking.id === newBooking.id)
        return false;
      const existingStart = new Date(existingBooking.start_time);
      const existingEnd = new Date(existingBooking.end_time);
      return newStart < existingEnd && newEnd > existingStart;
    });
  };

  const handleEventClick = (info: any) => {
    const bookingId = info.event.id;
    const booking = allBookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsEditable(booking.profile_id === currentUserId);
      setModalOpen(true);
    }
  };

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

  const handleSaveBooking = (booking: Booking) => {
    if (isBookingOverlapping(booking)) {
      alert(
        "Booking times overlap with an existing booking. Please choose a different time."
      );
      return;
    }
    if (!booking.id) {
      const { id, ...bookingData } = booking;
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
                  footerToolbar={{
                    right: "timeGridDay timeGridWeek dayGridMonth",
                  }}
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

      <BookingModal
        open={modalOpen}
        booking={selectedBooking}
        isEditable={isEditable}
        instructors={instructors}
        onClose={closeModal}
        onSave={handleSaveBooking}
        onDelete={handleDeleteBooking}
      />
    </Box>
  );
}
