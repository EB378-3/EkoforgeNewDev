"use client";

import React from "react";
import { Show } from "@refinedev/mui";
import { useShow } from "@refinedev/core";
import { Box, Grid, Typography } from "@mui/material";

interface Logbook {
  profile_id: string;
  resource_id: number;
  flight_date: string; // ISO date string
  flight_time: string; // "HHmm" format
  notes?: string;
  block_off_time?: string;
  takeoff_time?: string;
  landing_time?: string;
  block_on_time?: string;
  block_time: string; // "HHmm" format
  landings?: number;
  flight_details: Record<string, string>;
  fuel_left?: number;
  billing_info?: string;
  pax?: number;
  departure_place?: string;
  arrival_place?: string;
  flight_type?: string;
  pic_id?: string;
  student_id?: string;
  created_at: string;
  updated_at: string;
}

// Helper to format time strings as four-digit HHmm.
function formatHHmm(value: string | number | null | undefined): string {
  if (!value) return "0000";
  if (typeof value === "number") return value.toString().padStart(4, "0");
  if (typeof value === "string") return value.padStart(4, "0");
  return "0000";
}

// Helper component to display a profile's full name based on profileId.
function ProfileName({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "first_name,last_name" },
    queryOptions: { enabled: !!profileId },
  });
  const profileData = queryResult?.data?.data as { first_name: string; last_name: string } | undefined;
  if (!profileData) return <Typography>Loading...</Typography>;
  return (
    <Typography>
      {profileData.first_name} {profileData.last_name}
    </Typography>
  );
}

// Helper component to display a resource's name based on id.
function ResourceName({ id }: { id: string }) {
  const { queryResult } = useShow({
    resource: "resources",
    id: id,
    meta: { select: "name" },
    queryOptions: { enabled: !!id },
  });
  const resourceData = queryResult?.data?.data as { name: string } | undefined;
  if (!resourceData) return <Typography>Loading...</Typography>;
  return <Typography>{resourceData.name}</Typography>;
}

export default function LogbookShowPage() {
  const { queryResult } = useShow<Logbook>({ resource: "logbook", meta: { select: "*" } });
  const record = queryResult?.data?.data;
  if (!record) return <div>Loading...</div>;

  return (
    <Show title="Logbook Entry Details">
      <Box sx={{ p: 4 }}>
        <Grid container spacing={2}>
          {/* Row 1: Flight Date & Resource */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Flight Date</Typography>
            <Typography>{record.flight_date}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Resource</Typography>
            <ResourceName id={String(record.resource_id)} />
          </Grid>
          {/* Row 2: Block Off Time & Block Time */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Block Off Time</Typography>
            <Typography>{record.block_off_time || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Block Time (HHmm)</Typography>
            <Typography>{formatHHmm(record.block_time)}</Typography>
          </Grid>
          {/* Row 3: Takeoff Time & Flight Time */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Takeoff Time</Typography>
            <Typography>{record.takeoff_time || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Flight Time (HHmm)</Typography>
            <Typography>{formatHHmm(record.flight_time)}</Typography>
          </Grid>
          {/* Row 4: Landing Time & Departure Place (DEP) */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Landing Time</Typography>
            <Typography>{record.landing_time || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Departure Place (DEP)</Typography>
            <Typography>{record.departure_place || "N/A"}</Typography>
          </Grid>
          {/* Row 5: Block On Time & Arrival Place (ARR) */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Block On Time</Typography>
            <Typography>{record.block_on_time || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Arrival Place (ARR)</Typography>
            <Typography>{record.arrival_place || "N/A"}</Typography>
          </Grid>
          {/* Row 6: PIC & Student */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">PIC</Typography>
            {record.pic_id ? <ProfileName profileId={record.pic_id} /> : <Typography>N/A</Typography>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Student</Typography>
            {record.student_id ? <ProfileName profileId={record.student_id} /> : <Typography>N/A</Typography>}
          </Grid>
          {/* Row 7: PAX & Landings */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">PAX</Typography>
            <Typography>{record.pax ?? "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Landings</Typography>
            <Typography>{record.landings ?? "N/A"}</Typography>
          </Grid>
          {/* Row 8: Fuel & Flight Type */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Fuel Left</Typography>
            <Typography>{record.fuel_left ?? "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Flight Type</Typography>
            <Typography>{record.flight_type || "N/A"}</Typography>
          </Grid>
          {/* Row 9: Flight Details */}
          <Grid item xs={12}>
            <Typography variant="subtitle2">Flight Details</Typography>
            <Typography>{JSON.stringify(record.flight_details)}</Typography>
          </Grid>
          {/* Row 10: Notes */}
          <Grid item xs={12}>
            <Typography variant="subtitle2">Notes</Typography>
            <Typography>{record.notes || "N/A"}</Typography>
          </Grid>
          {/* Row 11: Billing Info */}
          <Grid item xs={12}>
            <Typography variant="subtitle2">Billing Info</Typography>
            <Typography>{record.billing_info || "N/A"}</Typography>
          </Grid>
          {/* Created & Updated timestamps */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Created At</Typography>
            <Typography>{new Date(record.created_at).toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Updated At</Typography>
            <Typography>{new Date(record.updated_at).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Show>
  );
}
