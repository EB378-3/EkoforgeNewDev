"use client";

import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useGetIdentity } from "@refinedev/core";
import { useTranslations } from "next-intl";

interface NoticeData {
  title: string;
  message: string;
  time_off_incident?: string;
  extra_parameters?: {
    conditions: string[];
    severity: string;
  };
}

export default function NoticeCreatePage() {
  const t = useTranslations("Notices");

  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm<NoticeData>({
    defaultValues: {
      extra_parameters: { conditions: [], severity: "" },
    },
    refineCoreProps: { meta: { select: "*" } },
  });

  // Define options for incident conditions and severity.
  const conditionOptions = ["Weather", "Mechanical", "Operational", "Other"];
  const severityOptions = ["Low", "Medium", "High"];

  return (
    <Create title="Create Notice" isLoading={false} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, p: 4 }}
        autoComplete="off"
      >
        {/* Title */}
        <TextField
          fullWidth
          label="Title"
          {...register("title", { required: "Title is required" })}
          error={!!errors.title}
          helperText={errors.title ? String(errors.title.message) : ""}
        />

        {/* Message */}
        <TextField
          fullWidth
          label="Message"
          {...register("message", { required: "Message is required" })}
          error={!!errors.message}
          helperText={errors.message ? String(errors.message.message) : ""}
          multiline
          rows={4}
        />

        {/* Time Off Incident */}
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

        {/* Incident Conditions Checkbox Group */}
        <Controller
          name="extra_parameters.conditions"
          control={control}
          render={({ field }) => {
            const currentConditions: string[] = field.value || [];
            const handleCheckboxChange = (option: string, checked: boolean) => {
              let newConditions = currentConditions;
              if (checked) {
                newConditions = [...currentConditions, option];
              } else {
                newConditions = currentConditions.filter((cond) => cond !== option);
              }
              field.onChange(newConditions);
            };
            return (
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <Typography variant="h6">Incident Conditions</Typography>
                <FormGroup row>
                  {conditionOptions.map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={currentConditions.includes(option)}
                          onChange={(e) =>
                            handleCheckboxChange(option, e.target.checked)
                          }
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            );
          }}
        />

        {/* Severity Radio Group */}
        <Controller
          name="extra_parameters.severity"
          control={control}
          render={({ field }) => (
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <Typography variant="h6">Severity</Typography>
              <RadioGroup
                row
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {severityOptions.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
        />
      </Box>
    </Create>
  );
}
