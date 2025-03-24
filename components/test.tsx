"use client";

import React from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts"; // Adjust the import if needed
import { useList } from "@refinedev/core";

interface LogBookEntry {
  id: string;
  date: string; // expected format "yyyy-mm-dd"
  block_time: number; // numeric value in HHmm format, e.g. 103 for 01:03
}

// Converts a numeric HHmm value into a decimal hour value.
const convertHHmmToHours = (num: number): number => {
  const str = num.toString().padStart(4, "0"); // e.g., "0103"
  const hours = parseInt(str.slice(0, 2), 10);
  const minutes = parseInt(str.slice(2, 4), 10);
  return hours + minutes / 60;
};

export default function SalesOverviewPage() {
  const theme = useTheme();

  const { data: logbookData, isLoading } = useList<LogBookEntry>({
    resource: "logbook",
    meta: { select: "*" },
  });

  if (isLoading) {
    return <Typography variant="caption">Loading chart...</Typography>;
  }

  const logbookEntries = logbookData?.data ?? [];
  const currentDate = new Date();

  // Generate an array for the last 12 months relative to today.
  const last12Months: { month: string; flightHours: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    // Format as "YYYY-MM" (e.g., "2025-03")
    const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
    last12Months.push({ month: monthKey, flightHours: 0 });
  }

  // Aggregate block_time (converted to hours) for entries in the last 365 days.
  logbookEntries.forEach((entry) => {
    // Append a time portion to ensure correct parsing.
    const entryDate = new Date(entry.date + "T00:00:00");
    const diffDays = (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays >= 0 && diffDays <= 365) {
      const monthKey = `${entryDate.getFullYear()}-${(entryDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const monthData = last12Months.find((m) => m.month === monthKey);
      if (monthData) {
        monthData.flightHours += convertHHmmToHours(entry.block_time);
      }
    }
  });
  console.log(last12Months);
  logbookEntries.forEach((entry) => console.log(entry.block_time));

  return (
    <Paper sx={{ p: 2, backgroundColor: theme.palette.strong.default }}>
      <Typography variant="h6" gutterBottom>
        Sales Overview
      </Typography>
      <Box sx={{ height: 300 }}>
        <BarChart
          dataset={last12Months}
          series={[
            {
              id: "flightHours",
              label: "Block Time (Hours)",
              dataKey: "flightHours",
              color: theme.palette.fifth.main,
            },
          ]}
          xAxis={[
            {
              id: "x-axis-0",
              scaleType: "band",
              dataKey: "month",
            },
          ]}
          tooltip={{}}
        />
      </Box>
    </Paper>
  );
}
