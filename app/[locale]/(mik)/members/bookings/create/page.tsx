"use client";

import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

interface Booking {
  profile_id: string;
  resource_id: string;
  start_time: string;
  end_time: string;
}

interface Resource {
  id: string;
  name: string;
}

// Dummy resource options. Replace with your API data as needed.
const resourceOptions: Resource[] = [
  { id: "1", name: "Conference Room A" },
  { id: "2", name: "Conference Room B" },
  { id: "3", name: "Office Desk" },
];

export default function BookingCreatePage() {
  const t = useTranslations("Bookings");

  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm<Booking>({
    defaultValues: {
      profile_id: "",
      resource_id: "",
      start_time: "",
      end_time: "",
    },
    refineCoreProps: { meta: { select: "*" } },
  });

  return (
    <Create
      title={t("createBookingTitle") || "Create Booking"}
      isLoading={false}
      saveButtonProps={saveButtonProps}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, p: 4 }}
        autoComplete="off"
      >
        {/* Profile ID */}
        <TextField
          fullWidth
          label={t("profileIdLabel") || "Profile ID"}
          {...register("profile_id", {
            required: t("profileIdRequired") || "Profile ID is required",
          })}
          error={!!errors.profile_id}
          helperText={errors.profile_id ? String(errors.profile_id.message) : ""}
        />

        {/* Resource Selector */}
        <Controller
          name="resource_id"
          control={control}
          rules={{ required: t("resourceIdRequired") || "Resource is required" }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.resource_id}>
              <InputLabel>{t("resourceIdLabel") || "Resource"}</InputLabel>
              <Select label={t("resourceIdLabel") || "Resource"} {...field}>
                {resourceOptions.map((resource) => (
                  <MenuItem key={resource.id} value={resource.id}>
                    {resource.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.resource_id && (
                <Typography variant="caption" color="error">
                  {typeof errors.resource_id.message === "string" && errors.resource_id.message}
                </Typography>
              )}
            </FormControl>
          )}
        />

        {/* Start Time */}
        <TextField
          fullWidth
          label={t("startTimeLabel") || "Start Time"}
          {...register("start_time", {
            required: t("startTimeRequired") || "Start Time is required",
          })}
          error={!!errors.start_time}
          helperText={errors.start_time ? String(errors.start_time.message) : ""}
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
        />

        {/* End Time */}
        <TextField
          fullWidth
          label={t("endTimeLabel") || "End Time"}
          {...register("end_time", {
            required: t("endTimeRequired") || "End Time is required",
          })}
          error={!!errors.end_time}
          helperText={errors.end_time ? String(errors.end_time.message) : ""}
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
        />
      </Box>
    </Create>
  );
}
