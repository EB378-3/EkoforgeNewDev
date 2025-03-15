"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatISO, parseISO } from "date-fns";
import { EventClickArg } from "@fullcalendar/core";
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
} from "@mui/material";
import { useGetIdentity, useList, HttpError } from "@refinedev/core";

// Interfaces for bookings and resources.
interface Booking {
  id: string;
  profile_id: string;
  resource_id: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

interface Resource {
  id: string;
  name: string;
}

export default function ResourceBookingCal() {
  const t = useTranslations("HomePage");

  // Get the current user's identity.
  const { data: identity } = useGetIdentity<{ id: string }>();
  const currentUserId = identity?.id || "default-user";

  // Fetch current user’s bookings.
  const { data, isLoading, isError } = useList<Booking, HttpError>({
    resource: "bookings",
    filters: [{ field: "profile_id", operator: "eq", value: currentUserId }],
    meta: { select: "*" },
  });

  // Fetch resources.
  const { data: resourcesData } = useList<Resource, HttpError>({
    resource: "resources",
    meta: { select: "*" },
  });
  const resources = resourcesData?.data || [];

  // Multi-select state for resources (array of resource IDs).
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  // Local state to hold current user's bookings.
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    if (data?.data) {
      setBookings(data.data);
    }
  }, [data]);

  // Local state to hold bookings for the selected resources.
  const [resourceBookings, setResourceBookings] = useState<Booking[]>([]);
  const { data: resourceBookingsData } = useList<Booking, HttpError>({
    resource: "bookings",
    filters:
      selectedResources && selectedResources.length > 0
        ? [{ field: "resource_id", operator: "in", value: selectedResources }]
        : [],
    meta: { select: "*" },
  });
  useEffect(() => {
    if (resourceBookingsData?.data) {
      setResourceBookings(resourceBookingsData.data);
    }
  }, [resourceBookingsData]);

  // State to track which calendar (user or resource) is active.
  const [activeCalendar, setActiveCalendar] = useState<"user" | "resource">(
    "user"
  );

  // State for the selected booking and modal visibility.
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  // When a date range is selected in the user's calendar.
  const handleDateSelect = (selection: { start: Date; end: Date }) => {
    setActiveCalendar("user");
    setSelectedBooking({
      id: "", // New booking
      profile_id: currentUserId,
      resource_id: "default-resource", // default for user calendar bookings
      start_time: formatISO(selection.start),
      end_time: formatISO(selection.end),
      created_at: "",
      updated_at: "",
    });
    setModalOpen(true);
    setIsEditable(true);
  };

  // Helper: When a date range is selected in a resource calendar.
  const handleResourceDateSelectForResource =
    (resourceId: string) => (selection: { start: Date; end: Date }) => {
      setActiveCalendar("resource");
      setSelectedBooking({
        id: "",
        profile_id: currentUserId,
        resource_id: resourceId,
        start_time: formatISO(selection.start),
        end_time: formatISO(selection.end),
        created_at: "",
        updated_at: "",
      });
      setModalOpen(true);
      setIsEditable(true);
    };

  // Close the modal and reset state.
  const closeModal = () => {
    setModalOpen(false);
    setLocalError("");
    setSelectedBooking(null);
    setIsEditable(false);
  };

  // Save: if id is empty, create a new booking; otherwise, update the booking.
  const handleSave = () => {
    if (!selectedBooking) return;
    if (selectedBooking.id === "") {
      // Create a new booking.
      const newId = crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString();
      const newBooking: Booking = {
        ...selectedBooking,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (activeCalendar === "user") {
        setBookings([...bookings, newBooking]);
      } else {
        setResourceBookings([...resourceBookings, newBooking]);
      }
    } else {
      // Update existing booking.
      if (activeCalendar === "user") {
        setBookings(
          bookings.map((b) =>
            b.id === selectedBooking.id
              ? { ...selectedBooking, updated_at: new Date().toISOString() }
              : b
          )
        );
      } else {
        setResourceBookings(
          resourceBookings.map((b) =>
            b.id === selectedBooking.id
              ? { ...selectedBooking, updated_at: new Date().toISOString() }
              : b
          )
        );
      }
    }
    closeModal();
  };

  // Delete the selected booking.
  const handleDelete = () => {
    if (selectedBooking && selectedBooking.id !== "") {
      if (activeCalendar === "user") {
        setBookings(bookings.filter((b) => b.id !== selectedBooking.id));
      } else {
        setResourceBookings(
          resourceBookings.filter((b) => b.id !== selectedBooking.id)
        );
      }
      closeModal();
    }
  };

  // Map current user's bookings to FullCalendar events.
  const userEvents = bookings.map((booking) => ({
    id: booking.id,
    title: "Booking",
    start: booking.start_time
      ? parseISO(booking.start_time).toISOString()
      : undefined,
    end: booking.end_time
      ? parseISO(booking.end_time).toISOString()
      : undefined,
    extendedProps: {
      profile_id: booking.profile_id,
      resource_id: booking.resource_id,
    },
  }));

  // When an event is clicked in the user's calendar.
  const handleEventClick = (info: EventClickArg) => {
    setActiveCalendar("user");
    const bookingId = info.event.id;
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsEditable(booking.profile_id === currentUserId);
      setModalOpen(true);
    }
  };

  // When an event is clicked in a resource calendar.
  const handleResourceEventClick = (info: EventClickArg) => {
    setActiveCalendar("resource");
    const bookingId = info.event.id;
    const booking = resourceBookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsEditable(booking.profile_id === currentUserId);
      setModalOpen(true);
    }
  };

  return (
    <>
      {/* Multi-select Resource Dropdown */}
      <Box sx={{ mx: 2, my: 2 }}>
        <FormControl fullWidth variant="outlined">
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
                  const resource = resources.find(
                    (r: Resource) => r.id === value
                  );
                  return (
                    <Chip key={value} label={resource ? resource.name : value} />
                  );
                })}
              </Box>
            )}
          >
            {resources.map((resource: Resource) => (
              <MenuItem key={resource.id} value={resource.id}>
                {resource.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>


      {/* Responsive Individual Calendars for Each Selected Resource */}
      {selectedResources && selectedResources.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mx: 2,
            my: 4,
            justifyContent: "center",
          }}
        >
          {selectedResources.map((resourceId) => {
            const resource = resources.find((r: Resource) => r.id === resourceId);
            // Filter bookings for the current resource.
            const events = resourceBookings
              .filter((booking) => booking.resource_id === resourceId)
              .map((booking) => ({
                id: booking.id,
                title: "Booking",
                start: booking.start_time
                  ? parseISO(booking.start_time).toISOString()
                  : undefined,
                end: booking.end_time
                  ? parseISO(booking.end_time).toISOString()
                  : undefined,
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
                  maxWidth: { xs: "100%", sm: "calc(50% - 16px)", md: "calc(33% - 16px)" },
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                  p: 2,
                  color: "text.primary",
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
                  // Use our helper to create a booking for this resource.
                  select={handleResourceDateSelectForResource(resourceId)}
                  eventClick={handleResourceEventClick}
                  events={events}
                  height="auto"
                />
              </Box>
            );
          })}
        </Box>
      )}

      {/* Modal for creating/editing/viewing a booking */}
      {modalOpen && selectedBooking && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            color: "text.primary",
          }}
        >
          {selectedBooking.id === "" && (
            // New Booking Modal
            <Box
              sx={{
                backgroundColor: "background.paper",
                p: 4,
                borderRadius: 2,
                maxWidth: { xs: "90%", sm: 400 },
                width: "100%",
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                New Booking
              </Typography>
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                value={
                  formatISO(new Date(selectedBooking.start_time), {
                    representation: "date",
                  }) +
                  "T" +
                  new Date(selectedBooking.start_time).toLocaleTimeString("it-IT")
                }
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    start_time: new Date(e.target.value).toISOString(),
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                value={
                  formatISO(new Date(selectedBooking.end_time), {
                    representation: "date",
                  }) +
                  "T" +
                  new Date(selectedBooking.end_time).toLocaleTimeString("it-IT")
                }
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    end_time: new Date(e.target.value).toISOString(),
                  })
                }
                sx={{ mb: 2 }}
              />
              {localError && (
                <Typography
                  variant="body2"
                  color="error"
                  align="center"
                  sx={{ mb: 2 }}
                >
                  Error: {localError}
                </Typography>
              )}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outlined" onClick={closeModal}>
                  Cancel
                </Button>
              </Box>
            </Box>
          )}

          {selectedBooking.id !== "" && isEditable && (
            // Editable Booking Modal
            <Box
              sx={{
                backgroundColor: "background.paper",
                p: 4,
                borderRadius: 2,
                maxWidth: { xs: "90%", sm: 400 },
                width: "100%",
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Edit Booking
              </Typography>
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                value={
                  formatISO(new Date(selectedBooking.start_time), {
                    representation: "date",
                  }) +
                  "T" +
                  new Date(selectedBooking.start_time).toLocaleTimeString("it-IT")
                }
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    start_time: new Date(e.target.value).toISOString(),
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                value={
                  formatISO(new Date(selectedBooking.end_time), {
                    representation: "date",
                  }) +
                  "T" +
                  new Date(selectedBooking.end_time).toLocaleTimeString("it-IT")
                }
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    end_time: new Date(e.target.value).toISOString(),
                  })
                }
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button variant="outlined" onClick={closeModal}>
                  Cancel
                </Button>
              </Box>
            </Box>
          )}

          {selectedBooking.id !== "" && !isEditable && (
            // Read-only Modal
            <Box
              sx={{
                backgroundColor: "background.paper",
                p: 4,
                borderRadius: 2,
                maxWidth: { xs: "90%", sm: 400 },
                width: "100%",
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                View Booking
              </Typography>
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                value={
                  formatISO(new Date(selectedBooking.start_time), {
                    representation: "date",
                  }) +
                  "T" +
                  new Date(selectedBooking.start_time).toLocaleTimeString("it-IT")
                }
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                value={
                  formatISO(new Date(selectedBooking.end_time), {
                    representation: "date",
                  }) +
                  "T" +
                  new Date(selectedBooking.end_time).toLocaleTimeString("it-IT")
                }
                disabled
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    You do not have permission to edit this booking.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={closeModal}
                    sx={{ mt: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
