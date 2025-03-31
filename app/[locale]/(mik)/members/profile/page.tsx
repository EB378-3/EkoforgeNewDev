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
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Link,
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
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h5" gutterBottom>
                {t("section.title")}
              </Typography>

              <Divider sx={{ marginY: 2 }} />

              <Typography variant="h6">{t("section1.title")}</Typography>
              <List>
                <ListItem>
                  <ListItemText>
                    <Link href={t("section1.linkInfoUrl")} target="_blank">
                      {t("section1.linkInfo")}
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Link href={t("section1.linkChatUrl")} target="_blank">
                      {t("section1.linkChat")}
                    </Link>
                  </ListItemText>
                </ListItem>
              </List>

              <Divider sx={{ marginY: 2 }} />

              <Typography variant="h6">{t("section2.title")}</Typography>
              <List>
                <ListItem>
                  <ListItemText>
                    <Link href={t("section2.ihqUrl")} target="_blank">
                      {t("section2.ihq")}
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Link href={t("section2.stlUrl")} target="_blank">
                      {t("section2.stl")}
                    </Link>
                  </ListItemText>
                </ListItem>
              </List>

              <Divider sx={{ marginY: 2 }} />

              <Typography variant="h6">{t("section3.title")}</Typography>
              <Typography variant="body1" paragraph>
                {t("section3.body1")} <Link href={t("section3.logbookUrl")} target="_blank">{t("section3.logbook")}</Link>. {t("section3.body2")}
              </Typography>

              <Typography variant="body2" paragraph>
                {t("section3.body3")}
              </Typography>

              <Divider sx={{ marginY: 2 }} />

              <Typography variant="h6">{t("section4.title")}</Typography>
              <Typography variant="body1" paragraph>
                {t("section4.body")}
              </Typography>

              <Divider sx={{ marginY: 2 }} />

              <Typography variant="h6">{t("section5.title")}</Typography>
              <Typography variant="body1" paragraph>
                {t("section5.body")}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}


    
      