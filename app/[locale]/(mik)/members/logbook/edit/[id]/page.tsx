"use client";

import React, { useEffect } from "react";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider, useFormContext } from "react-hook-form";
import { Box, Grid, TextField, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import { format } from "date-fns";
import { useList } from "@refinedev/core";

interface Logbook {
  profile_id: string;
  resource_id: number;
  flight_date: string; // ISO date string
  flight_time: string; // "HHmm" format, e.g., "0103"
  notes?: string;
  block_off_time?: string; // expected "HH:mm" from input
  takeoff_time?: string;   // expected "HH:mm"
  landing_time?: string;   // expected "HH:mm"
  block_on_time?: string;  // expected "HH:mm"
  block_time: string;      // "HHmm" format
  landings?: number;
  flight_details: Record<string, string>; // e.g., { nf: "detail", tgl: "airport info" }
  fuel_left?: number;
  billing_info?: string;
  pax?: number;
  departure_place?: string;
  arrival_place?: string;
  flight_type?: string;
  pic_id?: string;
  student_id?: string;
}

function FlightDetailsSection() {
  const { setValue } = useFormContext<Logbook>();
  const [nfChecked, setNfChecked] = React.useState(false);
  const [tglChecked, setTglChecked] = React.useState(false);
  const [nfDetail, setNfDetail] = React.useState("");
  const [tglDetail, setTglDetail] = React.useState("");

  useEffect(() => {
    const details: Record<string, string> = {};
    if (nfChecked) {
      details.nf = nfDetail;
    }
    if (tglChecked) {
      details.tgl = tglDetail;
    }
    setValue("flight_details", details);
  }, [nfChecked, nfDetail, tglChecked, tglDetail, setValue]);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={nfChecked}
                onChange={(e) => setNfChecked(e.target.checked)}
              />
            }
            label="NF"
          />
        </Grid>
        {nfChecked && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="NF Details (Time)"
              value={nfDetail}
              onChange={(e) => setNfDetail(e.target.value)}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={tglChecked}
                onChange={(e) => setTglChecked(e.target.checked)}
              />
            }
            label="TGL"
          />
        </Grid>
        {tglChecked && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="TGL Details (Airports)"
              value={tglDetail}
              onChange={(e) => setTglDetail(e.target.value)}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default function LogbookEditPage() {
  const methods = useForm<Logbook>({
    defaultValues: {
      flight_date: format(new Date(), "yyyy-MM-dd"),
      flight_time: "0000",
      flight_details: {},
      block_time: "0000",
    },
  });

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    saveButtonProps,
  } = methods;

  // Fetch profiles for PIC and Student select
  const { data: profilesData } = useList<{
    id: string;
    first_name: string;
    last_name: string;
  }>({
    resource: "profiles",
    meta: { select: "id,first_name,last_name" },
  });

  // Fetch resources for Resource select
  const { data: resourceData } = useList<{
    id: string;
    name: string;
  }>({
    resource: "resources",
    meta: { select: "id,name" },
  });

  // Auto-calculate Flight Time (HHmm) from Takeoff and Landing Times.
  const takeoff = watch("takeoff_time");
  const landing = watch("landing_time");

  useEffect(() => {
    if (takeoff && landing) {
      const formattedTakeoff = takeoff.length === 5 ? `${takeoff}:00` : takeoff;
      const formattedLanding = landing.length === 5 ? `${landing}:00` : landing;
      const takeoffTime = new Date(`1970-01-01T${formattedTakeoff}`);
      const landingTime = new Date(`1970-01-01T${formattedLanding}`);
      const diffMs = landingTime.getTime() - takeoffTime.getTime();
      if (diffMs > 0) {
        const totalMinutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const formatted = `${hours.toString().padStart(2, "0")}${minutes
          .toString()
          .padStart(2, "0")}`;
        setValue("flight_time", formatted);
      } else {
        setValue("flight_time", "0000");
      }
    }
  }, [takeoff, landing, setValue]);

  // Auto-calculate Block Time (HHmm) from Block Off and Block On Times.
  const blockOff = watch("block_off_time");
  const blockOn = watch("block_on_time");

  useEffect(() => {
    if (blockOff && blockOn) {
      const formattedBlockOff = blockOff.length === 5 ? `${blockOff}:00` : blockOff;
      const formattedBlockOn = blockOn.length === 5 ? `${blockOn}:00` : blockOn;
      const offTime = new Date(`1970-01-01T${formattedBlockOff}`);
      const onTime = new Date(`1970-01-01T${formattedBlockOn}`);
      const diffMs = onTime.getTime() - offTime.getTime();
      if (diffMs > 0) {
        const totalMinutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const formatted = `${hours.toString().padStart(2, "0")}${minutes
          .toString()
          .padStart(2, "0")}`;
        setValue("block_time", formatted);
      } else {
        setValue("block_time", "0000");
      }
    }
  }, [blockOff, blockOn, setValue]);

  return (
    <Edit title="Edit Logbook Entry" saveButtonProps={saveButtonProps}>
      <FormProvider {...methods}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, p: 4 }}
        >
          <Grid container spacing={2}>
            {/* Row 1: Flight Date & Resource */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Flight Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register("flight_date", { required: "Flight date is required" })}
                error={!!errors.flight_date}
                helperText={errors.flight_date?.message?.toString()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Resource"
                {...register("resource_id")}
              >
                {resourceData?.data?.map((resource) => (
                  <MenuItem key={resource.id} value={resource.id}>
                    {resource.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Row 2: Block Off Time & Block Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Block Off Time"
                type="time"
                inputProps={{ step: 1 }}
                InputLabelProps={{ shrink: true }}
                {...register("block_off_time")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Block Time (HHmm)"
                type="text"
                {...register("block_time")}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            {/* Row 3: Takeoff Time & Flight Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Takeoff Time"
                type="time"
                inputProps={{ step: 1 }}
                InputLabelProps={{ shrink: true }}
                {...register("takeoff_time")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Flight Time (HHmm)"
                type="text"
                {...register("flight_time")}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            {/* Row 4: Landing Time & DEP */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Landing Time"
                type="time"
                inputProps={{ step: 1 }}
                InputLabelProps={{ shrink: true }}
                {...register("landing_time")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Departure Place (DEP)"
                {...register("departure_place")}
              />
            </Grid>
            {/* Row 5: Block On Time & ARR */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Block On Time"
                type="time"
                inputProps={{ step: 1 }}
                InputLabelProps={{ shrink: true }}
                {...register("block_on_time")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Arrival Place (ARR)"
                {...register("arrival_place")}
              />
            </Grid>
            {/* Row 6: PIC & Student */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="PIC" {...register("pic_id")}>
                {profilesData?.data?.map((profile) => (
                  <MenuItem key={profile.id} value={profile.id}>
                    {profile.first_name} {profile.last_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Student" {...register("student_id")}>
                {profilesData?.data?.map((profile) => (
                  <MenuItem key={profile.id} value={profile.id}>
                    {profile.first_name} {profile.last_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Row 7: PAX & Landings */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PAX"
                type="number"
                {...register("pax", { valueAsNumber: true })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Landings"
                type="number"
                {...register("landings", { valueAsNumber: true })}
              />
            </Grid>
            {/* Row 8: Fuel & Flight Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fuel Left"
                type="number"
                {...register("fuel_left", { valueAsNumber: true })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Flight Type" {...register("flight_type")} />
            </Grid>
            {/* Row 9: Flight Details */}
            <Grid item xs={12}>
              <FlightDetailsSection />
            </Grid>
            {/* Row 10: Notes */}
            <Grid item xs={12}>
              <TextField fullWidth label="Notes" multiline rows={3} {...register("notes")} />
            </Grid>
            {/* Row 11: Billing */}
            <Grid item xs={12}>
              <TextField fullWidth label="Billing Info" {...register("billing_info")} />
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
    </Edit>
  );
}
