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
  Button,
} from "@mui/material";
import { useGetIdentity, useOne, HttpError } from "@refinedev/core";
import { useTranslations } from "next-intl";
import { EditButton } from "@refinedev/mui";

interface ProfileData {
  id: string;
  avatar?: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  streetaddress: string;
  city: string;
  country: string;
  zip: string;
  role: string;
  NF: boolean;
  IR: boolean;
  flight_hours_per_resource?: Record<string, number>;
}

// Helper function to format decimal hours into hours and minutes.
const formatHours = (decimalHours: number) => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
};

export default function ProfilePage() {
  const t = useTranslations("Profile");

  // Get the current user's identity.
  const { data: identity } = useGetIdentity<{ id: string }>();
  const userId = identity?.id ?? "";

  // Fetch the profile data using refined's useOne hook.
  const { data, isLoading, isError } = useOne<ProfileData, HttpError>({
    id: userId,
    meta: { select: "*" },
  });

  // Show a loading state if no identity or profile data is available.
  if (!userId) {
    return <Typography>Loading...</Typography>;
  }
  if (isLoading || !data?.data) {
    return <Typography>Loading profile...</Typography>;
  }
  if (isError) {
    return <Typography>Error loading profile</Typography>;
  }

  const profile = data.data;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Profile
      </Typography>
      <Grid container spacing={4}>
        {/* Profile Card on the left */}
        <Grid item xs={12} md={8}>
          <Card sx={{ margin: "auto", boxShadow: 3, borderRadius: "2%" }}>
            {/* Card header with colored background and circular profile image */}
            <CardMedia
              component="div"
              sx={{
                height: 200,
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Typography variant="h4" color="primary">
                    {profile.fullname ? profile.fullname.charAt(0).toUpperCase() : "?"}
                  </Typography>
                )}
              </Box>
            </CardMedia>
            {/* Card content with profile details */}
            <CardContent>
              <Typography gutterBottom variant="h5">
                {profile.fullname || "No Name"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("email")}: {profile.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("username")}: {profile.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("phone")}: {profile.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("address")}: {profile.streetaddress}, {profile.city}, {profile.country}{" "}
                {profile.zip}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("role")}: {profile.role}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {t("qualifications")}: {profile.NF ? "NF" : ""}, {profile.IR ? "IR" : ""}
              </Typography>
              {/* Totals Section */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {t("Total Hours on Plane") || "Total Hours on Plane"}
                </Typography>
                {profile.flight_hours_per_resource &&
                Object.keys(profile.flight_hours_per_resource).length > 0 ? (
                  <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                    <Box component="thead">
                      <Box component="tr">
                        <Box
                          component="th"
                          sx={{ border: "1px solid", borderColor: "grey.400", p: 1 }}
                        >
                          {t("resource")}
                        </Box>
                        <Box
                          component="th"
                          sx={{ border: "1px solid", borderColor: "grey.400", p: 1 }}
                        >
                          {t("total_hours")}
                        </Box>
                      </Box>
                    </Box>
                    <Box component="tbody">
                      {Object.entries(profile.flight_hours_per_resource).map(
                        ([aircraft, hours]) => (
                          <Box component="tr" key={aircraft}>
                            <Box
                              component="td"
                              sx={{ border: "1px solid", borderColor: "grey.400", p: 1 }}
                            >
                              {aircraft}
                            </Box>
                            <Box
                              component="td"
                              sx={{ border: "1px solid", borderColor: "grey.400", p: 1 }}
                            >
                              {formatHours(hours as number)}
                            </Box>
                          </Box>
                        )
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="grey.600">
                    No data available...
                  </Typography>
                )}
              </Box>
            </CardContent>
            <CardActions>
              <EditButton hideText recordItemId={profile.id} />
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}