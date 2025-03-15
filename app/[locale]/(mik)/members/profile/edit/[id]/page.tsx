"use client";

import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useGetIdentity } from "@refinedev/core";
import { useTranslations } from "next-intl";
import { useColorMode } from "@contexts/color-mode";
import { getTheme } from "@theme/theme";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar_url?: string;
  ratings: string[]; 
}

export default function ProfileEditPage() {
  const t = useTranslations("Profile");
  const { mode } = useColorMode();
  const theme = getTheme(mode);

  // Get the current user's identity.
  const { data: identity } = useGetIdentity<{ id: string }>();
  const userId = identity?.id ?? "";

  const {
    saveButtonProps,
    refineCore: { queryResult, onFinish, formLoading },
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileData>({
    // resource: "profiles",
    defaultValues: {},
    refineCoreProps: { meta: { select: "*" } },
  });

  // Extract profile data from query result.
  const profile = queryResult?.data?.data;

  // Define rating options.
  const ratingOptions = ["Student", "LAPL", "PPL", "CPL", "ATPL", "NF", "IR", "Multi-Engine", "CFI", "CFII", "DPE"];

  // Reset form values when profile data is available.
  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  if (formLoading || !userId) {
    return <Typography>Loading profile...</Typography>;
  }

  if (!profile) {
    return <Typography>Error loading profile</Typography>;
  }

  const onSubmit = (data: ProfileData) => {
    onFinish(data);
  };

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ p: 4 }}
        autoComplete="off"
      >
        <Grid container spacing={4}>
          {/* Left Column: Avatar */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  backgroundColor: theme.palette.third.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    minHeight: 100,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {profile.avatar_url ? (
                    <Avatar
                      src={profile.avatar_url}
                      alt="Profile"
                      sx={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <Typography variant="h4" color="primary">
                      {profile.first_name ? profile.first_name.charAt(0).toUpperCase() : "?"}
                    </Typography>
                  )}
                </Box>
              </CardMedia>
              <CardContent>
                <TextField
                  fullWidth
                  label="Change Avatar"
                  defaultValue={profile.avatar_url}
                  {...register("avatar_url")}
                  error={!!errors.avatar_url}
                  helperText={errors.avatar_url?.message?.toString()}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Editable Fields */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  defaultValue={profile.first_name}
                  {...register("first_name", { required: "First name is required" })}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message?.toString()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  defaultValue={profile.last_name}
                  {...register("last_name", { required: "Last name is required" })}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message?.toString()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue={profile.email}
                  {...register("email", { required: "Email is required" })}
                  error={!!errors.email}
                  helperText={errors.email?.message?.toString()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  defaultValue={profile.phone_number}
                  {...register("phone_number")}
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message?.toString()}
                />
              </Grid>
              <Controller
                name="ratings"
                control={control}
                render={({ field }) => {
                  const currentRatings: string[] = field.value || [];
                  const handleCheckboxChange = (option: string, checked: boolean) => {
                    let newRatings = currentRatings;
                    if (checked) {
                      newRatings = [...currentRatings, option];
                    } else {
                      newRatings = currentRatings.filter((rating) => rating !== option);
                    }
                    field.onChange(newRatings);
                  };
                  return (
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                      <Typography variant="h6">Aviation Ratings</Typography>
                      <FormGroup row>
                        {ratingOptions.map((option) => (
                          <FormControlLabel
                            key={option}
                            control={
                              <Checkbox
                                checked={currentRatings.includes(option)}
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
              {/* Additional fields can be added below as needed */}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Edit>
  );
}
