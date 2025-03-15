"use client";

import React from "react";
import { Create } from "@refinedev/mui";
import { Box, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

interface FlightPlan {
  route: string;
  notes?: string;
  international?: boolean;
}

export default function FlightPlanCreatePage() {
  const t = useTranslations("FlightPlans");

  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm<FlightPlan>({
    defaultValues: {
      route: "",
      notes: "",
      international: false,
    },
  });

  return (
    <Create title="Create Flight Plan" saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ p: 4, display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        {/* Route Field */}
        <TextField
          fullWidth
          label="Route"
          {...register("route", { required: "Route is required" })}
          error={!!errors.route}
          helperText={errors.route ? String(errors.route.message) : ""}
        />

        {/* Notes Field */}
        <TextField
          fullWidth
          label="Notes"
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
    </Create>
  );
}
