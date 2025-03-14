"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatISO, parseISO } from "date-fns";
import { EventClickArg } from "@fullcalendar/core";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useGetIdentity, useList, HttpError } from "@refinedev/core";

interface Booking {
  id: string;
  profile_id: string;
  resource_id: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export default function ResourceBookingCal() {
  const t = useTranslations("HomePage");

  // Get the current user's identity.
  const { data: identity } = useGetIdentity<{ id: string }>();
  const currentUserId = identity?.id || "default-user";

  // Fetch bookings for the current user.
  const { data, isLoading, isError } = useList<Booking, HttpError>({
    resource: "bookings",
    filters: [{ field: "profile_id", operator: "eq", value: currentUserId }],
    meta: { select: "*" },
  });

  // Local state to hold bookings.
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    if (data?.data) {
      setBookings(data.data);
    }
  }, [data]);

  // State for the selected booking and modal visibility.
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  // When a date range is selected, prepare a new booking.
  const handleDateSelect = (selection: { start: Date; end: Date }) => {
    setSelectedBooking({
      id: "", // An empty id indicates a new booking.
      profile_id: currentUserId,
      resource_id: "default-resource", // Replace with an appropriate default if needed.
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
      const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      const newBooking: Booking = {
        ...selectedBooking,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setBookings([...bookings, newBooking]);
    } else {
      // Update existing booking.
      setBookings(
        bookings.map((b) =>
          b.id === selectedBooking.id
            ? { ...selectedBooking, updated_at: new Date().toISOString() }
            : b
        )
      );
    }
    closeModal();
  };

  // Delete the selected booking.
  const handleDelete = () => {
    if (selectedBooking && selectedBooking.id !== "") {
      setBookings(bookings.filter((b) => b.id !== selectedBooking.id));
      closeModal();
    }
  };

  // Map bookings to FullCalendar events.
  const events = bookings.map((booking) => ({
    id: booking.id,
    title: "Booking",
    start: booking.start_time ? parseISO(booking.start_time).toISOString() : undefined,
    end: booking.end_time ? parseISO(booking.end_time).toISOString() : undefined,
    extendedProps: {
      profile_id: booking.profile_id,
      resource_id: booking.resource_id,
    },
  }));

  // When an event is clicked, open the modal.
  const handleEventClick = (info: EventClickArg) => {
    const bookingId = info.event.id;
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsEditable(booking.profile_id === currentUserId);
      setModalOpen(true);
    }
  };

  return (
    <>
      {/* Mobile View */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          p: 2,
          backgroundColor: "background.paper",
          borderRadius: 1,
        }}
      >
        <FullCalendar
          timeZone="local"
          nowIndicator
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          headerToolbar={{
            left: "",
            center: "title prev,next today",
            right: "",
          }}
          editable
          selectable
          scrollTime={new Date().toLocaleTimeString("it-IT")}
          eventClick={handleEventClick}
          select={handleDateSelect}
          events={events}
          height="auto"
        />
      </Box>

      {/* Desktop View */}
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          mx: 2,
          p: 2,
          backgroundColor: "background.paper",
          borderRadius: 1,
          color: "text.primary",
        }}
      >
        <FullCalendar
          timeZone="local"
          nowIndicator
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "title",
            center: "dayGridMonth,timeGridWeek,timeGridDay",
            right: "prev,next today",
          }}
          editable
          selectable
          eventClick={handleEventClick}
          select={handleDateSelect}
          events={events}
          height="auto"
        />
      </Box>

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
                <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
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
                <Button variant="contained" color="error" onClick={handleDelete}>
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
                  <Button variant="outlined" onClick={closeModal} sx={{ mt: 1 }}>
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
