"use client";

import React, { useEffect } from "react";
import { Box, Grid, TextField, FormControlLabel, Checkbox, Button, Typography } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

interface FlightPlan {
  id: string;
  profile_id: string;
  route: string;
  notes?: string;
  international?: boolean;
  created_at: string;
  updated_at: string;
}

export default function FlightPlanEditPage() {
  const t = useTranslations("FlightPlans");

  const {
    saveButtonProps,
    register,
    control,
    reset,
    formState: { errors },
    refineCore: { queryResult, formLoading },
  } = useForm<FlightPlan>({
    refineCoreProps: { meta: { select: "*" } },
  });

  const flightPlan = queryResult?.data?.data;

  useEffect(() => {
    if (flightPlan) {
      reset(flightPlan);
    }
  }, [flightPlan, reset]);

  if (formLoading) {
    return <Typography>Loading flight plan...</Typography>;
  }

  if (!flightPlan) {
    return <Typography>Error loading flight plan</Typography>;
  }

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ p: 4, display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        {/* Route Field */}
        <TextField
          fullWidth
          label="Route"
          defaultValue={flightPlan.route}
          {...register("route", { required: "Route is required" })}
          error={!!errors.route}
          helperText={errors.route ? String(errors.route.message) : ""}
        />

        {/* Notes Field */}
        <TextField
          fullWidth
          label="Notes"
          defaultValue={flightPlan.notes}
          {...register("notes")}
          error={!!errors.notes}
          helperText={errors.notes ? String(errors.notes.message) : ""}
          multiline
          rows={4}
        />

        {/* International Checkbox */}
        <Controller
          name="international"
          control={control}
          defaultValue={flightPlan.international ?? false}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="International Flight"
            />
          )}
        />
      </Box>
    </Edit>
  );
}
