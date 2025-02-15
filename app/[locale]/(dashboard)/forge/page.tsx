"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { getTheme } from "@theme/theme";
import { useColorMode } from "@contexts/color-mode";
import { LineChart } from "@mui/x-charts/LineChart";

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4000 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 7000 },
  { month: "Jul", sales: 8000 },
  { month: "Aug", sales: 5000 },
  { month: "Sep", sales: 6000 },
  { month: "Oct", sales: 7000 },
  { month: "Nov", sales: 8000 },
  { month: "Dec", sales: 9000 },
];

export default function ForgeDashboard() {
  const t = useTranslations("hompage");
  const locale = useLocale();
  const { mode, setMode } = useColorMode();
  const theme = getTheme(mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}

      {/* Action Buttons */}
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        spacing={2}
        sx={{ mb: 4 }}
        alignItems="center"
      >
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: theme.palette.primary.dark }}>
          Onboard New Client
        </Button>
        <Button variant="contained" sx={{ backgroundColor: theme.palette.secondary.dark }}>
          Add New Transaction
        </Button>
        <Button variant="outlined" color="primary">
          View Reports
        </Button>
      </Stack>

      {/* Main Dashboard Grid */}
      <Grid container spacing={3}>
        {/* Sales Overview Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, backgroundColor: theme.palette.strong.default }}>
            <Typography variant="h6" gutterBottom>
              Sales Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <LineChart
                dataset={salesData} // Add this line
                series={[
                  {
                    id: "sales",
                    label: "Sales",
                    data: salesData.map((item) => item.sales), // array of sales numbers
                    dataKey: "sales", // property to extract y-values
                    color: theme.palette.primary.main,
                  },
                ]}
                xAxis={[
                  {
                    id: "x-axis-0",
                    scaleType: "band",
                    dataKey: "month", // property to extract x-values
                  },
                ]}
                tooltip={{}}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Noticeboard */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: "100%", backgroundColor: theme.palette.strong.default }}>
            <Typography variant="h6" gutterBottom>
              Noticeboard
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                - System maintenance at 10 PM.
              </Typography>
              <Typography variant="body2">
                - New client onboarded: Company X.
              </Typography>
              <Typography variant="body2">
                - Quarterly meeting scheduled.
              </Typography>
              <Typography variant="body2">
                - Server update completed.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: theme.palette.strong.default }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No recent transactions available.
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: theme.palette.strong.default }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Typography variant="body1">
              Total Clients: <strong>125</strong>
            </Typography>
            <Typography variant="body1">
              Monthly Revenue: <strong>$45,000</strong>
            </Typography>
            <Typography variant="body1">
              New Transactions: <strong>25</strong>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}