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

interface EventData {
  cal_id: number;
  title: string;
  details: string;
  starttime: string;
  endtime: string;
  id: string; // Owner's id
}

export default function ResourceBookingCal() {
  const t = useTranslations("HomePage");

  // Get the current user's identity using refined's useGetIdentity hook.
  const { data: identity } = useGetIdentity<{ id: string }>();
  const currentUserId = identity?.id || "default-user";

  // Fetch bookings using useList.
  // (Filter here to only return bookings for the current user, if desired.)
  const { data, isLoading, isError } = useList<EventData, HttpError>({
    resource: "cal",
    filters: [{ field: "id", operator: "eq", value: currentUserId }],
    meta: { select: "*" },
  });

  // Initialize local state to hold the bookings for internal updates.
  const [bookings, setBookings] = useState<EventData[]>([]);

  // When fetched data changes, update the local state.
  useEffect(() => {
    if (data?.data) {
      setBookings(data.data);
    }
  }, [data]);

  // Local state for the selected event (for editing/creating) and modal visibility.
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  // Helper to format decimal hours into hours and minutes.
  const formatHours = (decimalHours: number) => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  // When a date range is selected, prepare a new booking.
  const handleDateSelect = (selection: { start: Date; end: Date }) => {
    setSelectedEvent({
      cal_id: 0, // 0 indicates a new booking.
      title: "",
      details: "",
      starttime: formatISO(selection.start),
      endtime: formatISO(selection.end),
      id: currentUserId,
    });
    setModalOpen(true);
  };

  // Close the modal and reset state.
  const closeModal = () => {
    setModalOpen(false);
    setLocalError("");
    setSelectedEvent(null);
    setIsEditable(false);
  };

  // Save operation: if cal_id is 0, create a new booking; otherwise, update the booking.
  const handleSave = () => {
    if (!selectedEvent) return;
    if (selectedEvent.cal_id === 0) {
      // Create a new booking by assigning a new cal_id.
      const newId = Math.max(0, ...bookings.map((b) => b.cal_id)) + 1;
      const newBooking: EventData = { ...selectedEvent, cal_id: newId };
      setBookings([...bookings, newBooking]);
    } else {
      // Update an existing booking.
      setBookings(
        bookings.map((b) =>
          b.cal_id === selectedEvent.cal_id ? selectedEvent : b
        )
      );
    }
    closeModal();
  };

  // Delete the selected booking.
  const handleDelete = () => {
    if (selectedEvent && selectedEvent.cal_id !== 0) {
      setBookings(bookings.filter((b) => b.cal_id !== selectedEvent.cal_id));
      closeModal();
    }
  };

  // Map local bookings to FullCalendar events.
  const events = bookings.map((booking) => ({
    cal_id: String(booking.cal_id),
    title: booking.title,
    start: booking.starttime ? parseISO(booking.starttime).toISOString() : undefined,
    end: booking.endtime ? parseISO(booking.endtime).toISOString() : undefined,
    extendedProps: {
      details: booking.details,
      id: booking.id,
    },
  }));

  // When an event is clicked, open the modal and allow editing if the user is the owner.
  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvent({
      cal_id: Number(info.event.extendedProps.cal_id),
      title: info.event.title,
      details: info.event.extendedProps.details,
      starttime: info.event.startStr,
      endtime: info.event.endStr,
      id: info.event.extendedProps.id,
    });
    setIsEditable(String(info.event.extendedProps.id) === String(currentUserId));
    setModalOpen(true);
  };

  return (
    <>
      {/* Mobile View */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          p: 2,
          backgroundColor: "white",
          borderRadius: 1,
        }}
      >
        <FullCalendar
          timeZone="local"
          nowIndicator={true}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          headerToolbar={{
            left: "",
            center: "title prev,next today",
            right: "",
          }}
          editable={true}
          selectable={true}
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
          backgroundColor: "white",
          borderRadius: 1,
          color: "#000000",
        }}
      >
        <FullCalendar
          timeZone="local"
          nowIndicator={true}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "title",
            center: "dayGridMonth,timeGridWeek,timeGridDay",
            right: "prev,next today",
          }}
          editable={true}
          selectable={true}
          eventClick={handleEventClick}
          select={handleDateSelect}
          events={events}
          height="auto"
        />
      </Box>

      {/* Modal for creating/editing/viewing a booking */}
      {modalOpen && selectedEvent && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            color: "#000000",
          }}
        >
          {selectedEvent.cal_id === 0 && (
            // New Booking Modal
            <Box
              sx={{
                backgroundColor: "white",
                p: 4,
                borderRadius: 2,
                maxWidth: { xs: "90%", sm: 400 },
                width: "100%",
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "#000000" }}>
                New Booking
              </Typography>
              <TextField
                fullWidth
                placeholder="Title"
                value={selectedEvent.title}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, title: e.target.value })
                }
                sx={{ mb: 2, input: { color: "black" } }}
              />
              <TextField
                fullWidth
                placeholder="Details"
                value={selectedEvent.details}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, details: e.target.value })
                }
                multiline
                rows={3}
                sx={{ mb: 2, input: { color: "black" } }}
              />
              <TextField
                fullWidth
                type="datetime-local"
                value={
                  formatISO(new Date(selectedEvent.starttime), {
                    representation: "date",
                  }) +
                  "T" +
                  new Date(selectedEvent.starttime).toLocaleTimeString("it-IT")
                }
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    starttime: new Date(e.target.value).toISOString(),
                  })
                }
                sx={{ mb: 2, input: { color: "black" } }}
              />
              <TextField
                fullWidth
                type="datetime-local"
                value={
                  formatISO(new Date(selectedEvent.endtime), {
                    representation: "date",
                  }) +
                  "T" +
                  new Date(selectedEvent.endtime).toLocaleTimeString("it-IT")
                }
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    endtime: new Date(e.target.value).toISOString(),
                  })
                }
                sx={{ mb: 2, input: { color: "black" } }}
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
                {selectedEvent.cal_id !== 0 && (
                  <Button variant="contained" color="error" onClick={handleDelete}>
                    Delete
                  </Button>
                )}
                <Button variant="outlined" onClick={closeModal}>
                  Cancel
                </Button>
              </Box>
            </Box>
          )}

          {selectedEvent.cal_id !== 0 && isEditable && (
            // Editable Booking Modal
            <Box
              sx={{
                backgroundColor: "white",
                p: 4,
                borderRadius: 2,
                maxWidth: { xs: "90%", sm: 400 },
                width: "100%",
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "#000000" }}>
                Edit Booking
              </Typography>
              <TextField
                fullWidth
                placeholder="Title"
                value={selectedEvent.title}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, title: e.target.value })
                }
                sx={{ mb: 2, input: { color: "black" } }}
              />
              <TextField
                fullWidth
                placeholder="Details"
                value={selectedEvent.details}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, details: e.target.value })
                }
                multiline
                rows={3}
                sx={{ mb: 2, input: { color: "black" } }}
              />
              <TextField
                fullWidth
                type="datetime-local"
                value={
                  formatISO(new Date(selectedEvent.starttime), { representation: "date" }) +
                  "T" +
                  new Date(selectedEvent.starttime).toLocaleTimeString("it-IT")
                }
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    starttime: new Date(e.target.value).toISOString(),
                  })
                }
                sx={{ mb: 2, input: { color: "black" } }}
              />
              <TextField
                fullWidth
                type="datetime-local"
                value={
                  formatISO(new Date(selectedEvent.endtime), { representation: "date" }) +
                  "T" +
                  new Date(selectedEvent.endtime).toLocaleTimeString("it-IT")
                }
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    endtime: new Date(e.target.value).toISOString(),
                  })
                }
                sx={{ mb: 2, input: { color: "black" } }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
                {selectedEvent.cal_id !== 0 && (
                  <Button variant="contained" color="error" onClick={handleDelete}>
                    Delete
                  </Button>
                )}
                <Button variant="outlined" onClick={closeModal}>
                  Cancel
                </Button>
              </Box>
            </Box>
          )}

          {selectedEvent.cal_id !== 0 && !isEditable && (
            // Read-only Modal
            <Box
              sx={{
                backgroundColor: "white",
                p: 4,
                borderRadius: 2,
                maxWidth: { xs: "90%", sm: 400 },
                width: "100%",
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "#000000" }}>
                View Booking
              </Typography>
              <TextField
                fullWidth
                placeholder="Title"
                value={selectedEvent.title}
                disabled
                sx={{ mb: 2, input: { color: "black" } }}
              />
              <TextField
                fullWidth
                placeholder="Details"
                value={selectedEvent.details}
                disabled
                multiline
                rows={3}
                sx={{ mb: 2, input: { color: "black" } }}
              />
              <TextField
                fullWidth
                type="datetime-local"
                value={
                  formatISO(new Date(selectedEvent.starttime), { representation: "date" }) +
                  "T" +
                  new Date(selectedEvent.starttime).toLocaleTimeString("it-IT")
                }
                disabled
                sx={{ mb: 2, input: { color: "black" } }}
              />
              <TextField
                fullWidth
                type="datetime-local"
                value={
                  formatISO(new Date(selectedEvent.endtime), { representation: "date" }) +
                  "T" +
                  new Date(selectedEvent.endtime).toLocaleTimeString("it-IT")
                }
                disabled
                sx={{ mb: 2, input: { color: "black" } }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    You do not have permission to edit this event.
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