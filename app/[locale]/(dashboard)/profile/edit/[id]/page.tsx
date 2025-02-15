"use client";

import React, { useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

interface ProfileData {
  email: string;
  username: string;
  fullname: string;
  phone: string;
  streetaddress: string;
  city: string;
  country: string;
  zip: string;
  role: string;
}

export default function ProfileEdit() {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    reset,
    formState: { errors },
  } = useForm<ProfileData>({
    defaultValues: {},
    refineCoreProps: { meta: { select: "*" } },
  });

  // Get current profile data if available for defaults.
  const profileData = queryResult?.data?.data as ProfileData | undefined;

  // Reset form values when profile data is fetched.
  useEffect(() => {
    if (profileData) {
      reset(profileData);
    }
  }, [profileData, reset]);

  // If loading or no profile data yet, display a loading state.
  if (formLoading || !profileData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        {/* Email */}
        <TextField
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email ? String(errors.email.message) : ""}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Email"
        />

        {/* Username */}
        <TextField
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors.username ? String(errors.username.message) : ""}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Username"
        />

        {/* Full Name */}
        <TextField
          {...register("fullname", { required: "Full Name is required" })}
          error={!!errors.fullname}
          helperText={errors.fullname ? String(errors.fullname.message) : ""}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Full Name"
        />

        {/* Phone */}
        <TextField
          {...register("phone", { required: "Phone is required" })}
          error={!!errors.phone}
          helperText={errors.phone ? String(errors.phone.message) : ""}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Phone"
        />

        {/* Street Address */}
        <TextField
          {...register("streetaddress", { required: "Street Address is required" })}
          error={!!errors.streetaddress}
          helperText={errors.streetaddress ? String(errors.streetaddress.message) : ""}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Street Address"
        />

        {/* City */}
        <TextField
          {...register("city", { required: "City is required" })}
          error={!!errors.city}
          helperText={errors.city ? String(errors.city.message) : ""}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="City"
        />

        {/* Country */}
        <TextField
          {...register("country", { required: "Country is required" })}
          error={!!errors.country}
          helperText={errors.country ? String(errors.country.message) : ""}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Country"
        />

        {/* Zip Code */}
        <TextField
          {...register("zip", { required: "Zip is required" })}
          error={!!errors.zip}
          helperText={errors.zip ? String(errors.zip.message) : ""}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Zip Code"
        />

        {/* Role */}
        <TextField
          {...register("role", { required: "Role is required" })}
          error={!!errors.role}
          helperText={errors.role ? String(errors.role.message) : ""}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Role"
        />
      </Box>
    </Edit>
  );
}
