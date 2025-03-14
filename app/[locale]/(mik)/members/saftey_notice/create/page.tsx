"use client";

import React from "react";
import { Create } from "@refinedev/mui";
import { Box, TextField, Button } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useGetIdentity } from "@refinedev/core";
import { useTranslations } from "next-intl";

interface NoticeData {
  title: string;
  message: string;
  time_off_incident?: string;
  extra_parameters?: string; // We'll store the JSON as a string and parse it server-side if needed.
}

export default function NoticeCreatePage() {
  const t = useTranslations("Notices");
  const { data: identity } = useGetIdentity<{ id: string }>();

  const {
    saveButtonProps,
    register,
    formState: { errors },
  } = useForm<NoticeData>({
    defaultValues: {},
    refineCoreProps: { meta: { select: "*" } },
  });

  return (
    <Create
      title="Create Notice"
      isLoading={false}
      saveButtonProps={saveButtonProps}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, p: 4 }}
        autoComplete="off"
      >
        <TextField
          fullWidth
          label="Title"
          {...register("title", { required: "Title is required" })}
          error={!!errors.title}
          helperText={errors.title ? String(errors.title.message) : ""}
        />

        <TextField
          fullWidth
          label="Message"
          {...register("message", { required: "Message is required" })}
          error={!!errors.message}
          helperText={errors.message ? String(errors.message.message) : ""}
          multiline
          rows={4}
        />

        <TextField
          fullWidth
          label="Time Off Incident"
          {...register("time_off_incident")}
          error={!!errors.time_off_incident}
          helperText={
            errors.time_off_incident ? String(errors.time_off_incident.message) : ""
          }
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Extra Parameters (JSON)"
          {...register("extra_parameters")}
          error={!!errors.extra_parameters}
          helperText={
            errors.extra_parameters ? String(errors.extra_parameters.message) : ""
          }
          multiline
          rows={3}
        />
      </Box>
    </Create>
  );
}
