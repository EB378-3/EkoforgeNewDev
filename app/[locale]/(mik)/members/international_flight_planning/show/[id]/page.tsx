"use client";

import React from "react";
import { Show } from "@refinedev/mui";
import { useShow } from "@refinedev/core";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { useTranslations } from "next-intl";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

interface FlightPlan {
  id: string;
  profile_id: string;
  route: string;
  notes?: string;
  international?: boolean;
  created_at: string;
  updated_at: string;
}

export default function FlightPlanShowPage() {
  const t = useTranslations("FlightPlans");
  
  const { queryResult } = useShow<FlightPlan>({
    resource: "flightplans",
    meta: { select: "*" },
  });

  const isLoading = queryResult.isLoading;

  const flightPlan = queryResult?.data?.data;

  return (
    <Show title="Flight Plan Details" isLoading={isLoading}>
      <Card sx={{ m: 2, p: 2 }}>
        <CardHeader
          title={flightPlan?.route}
          subheader={`Created: ${new Date(flightPlan?.created_at ?? "").toLocaleString()}`}
          action={
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              component={Link}
              href={`/members/flight_planning/edit/${flightPlan?.id}`}
            >
              {t("edit") || "Edit"}
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" color="text.secondary">
                  Route:
                </Typography>
                <Typography variant="body1">{flightPlan?.route}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" color="text.secondary">
                  International Flight:
                </Typography>
                <Typography variant="body1">
                  {flightPlan?.international ? "Yes" : "No"}
                </Typography>
              </Stack>
            </Grid>
            {flightPlan?.notes && (
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Notes:
                  </Typography>
                  <Typography variant="body1">{flightPlan.notes}</Typography>
                </Stack>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" color="text.secondary">
                  Last Updated:
                </Typography>
                <Typography variant="body1">
                  {new Date(flightPlan?.updated_at ?? "").toLocaleString()}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Show>
  );
}
