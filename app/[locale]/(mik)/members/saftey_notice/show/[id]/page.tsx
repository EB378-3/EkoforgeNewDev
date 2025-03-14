"use client";

import React from "react";
import { Show } from "@refinedev/mui";
import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { useTranslations } from "next-intl";

interface NoticeData {
  title: string;
  message: string;
  time_off_incident?: string;
  extra_parameters?: {
    conditions: string[];
    severity: string;
  };
  created_at: string;
  updated_at: string;
}

export default function NoticeShowPage() {
  const t = useTranslations("Notices");
  const { queryResult } = useShow<NoticeData>({
    resource: "notices",
    meta: { select: "*" },
  });

  const notice = queryResult?.data?.data;

  if (!notice) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Show title="Notice Details">
      <Card variant="outlined" sx={{ m: 2, p: 2 }}>
        <CardHeader
          title={notice.title}
          subheader={`Created: ${new Date(notice.created_at).toLocaleString()}`}
        />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="body1">{notice.message}</Typography>
            {notice.time_off_incident && (
              <Typography variant="body2" color="text.secondary">
                Time Off Incident: {new Date(notice.time_off_incident).toLocaleString()}
              </Typography>
            )}
            {notice.extra_parameters && (
              <Box>
                <Typography variant="subtitle1">Incident Details:</Typography>
                <Typography variant="body2">
                  Conditions:{" "}
                  {notice.extra_parameters.conditions && notice.extra_parameters.conditions.length > 0
                    ? notice.extra_parameters.conditions.join(", ")
                    : "None"}
                </Typography>
                <Typography variant="body2">
                  Severity: {notice.extra_parameters.severity || "Not specified"}
                </Typography>
              </Box>
            )}
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date(notice.updated_at).toLocaleString()}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Show>
  );
}
