"use client";

import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
} from "@mui/material";
import {
  useGetIdentity,
  useOne,
  HttpError,
} from "@refinedev/core";
import { useTranslations } from "next-intl";
import { useColorMode } from "@contexts/color-mode";
import { getTheme } from "@theme/theme";
import { EditButton } from "@refinedev/mui";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar_url?: string;
  ratings: string[]; 
  flight_hours?: Record<string, number>;
}

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const { mode } = useColorMode();
  const theme = getTheme(mode);

  // Get the current user's identity.
  const { data: identity } = useGetIdentity<{ id: string }>();
  const userId = identity?.id ?? "";

  // Fetch the profile data.
  const { data, isLoading, isError } = useOne<ProfileData, HttpError>({
    id: userId,
    meta: { select: "*" },
  });

  // Always call hooks. Later, we conditionally render based on the state.
  const profile = data?.data;

  return (
    <Box sx={{ p: 4 }}>
      {(!userId || isLoading) && <Typography>Loading profile...</Typography>}
      {isError && <Typography>Error loading profile</Typography>}
      {userId && profile && !isLoading && !isError && (
        <Grid container spacing={4}>
          {/* Left Column: Profile Card and Personal Notes */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={4}>
              {/* Profile Card */}
              <Grid item xs={12}>
                <Card sx={{ margin: "auto", boxShadow: 3, borderRadius: 2 }}>
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
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Typography variant="h4" color="primary">
                          {profile.first_name
                            ? profile.first_name.charAt(0).toUpperCase()
                            : "?"}
                        </Typography>
                      )}
                    </Box>
                  </CardMedia>
                  <CardContent>
                    <Typography gutterBottom variant="h5">
                      {profile.first_name + " " + profile.last_name || "No Name"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("email")}: {profile.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("phone")}: {profile.phone_number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ratings: {profile.ratings && profile.ratings.length > 0 ? profile.ratings.join(", ") : "No ratings"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <EditButton hideText recordItemId={profile.id} />
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
