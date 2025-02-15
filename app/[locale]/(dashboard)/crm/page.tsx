"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography,
  CssBaseline,
  GlobalStyles,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LineChart } from "@mui/x-charts/LineChart";
import { List as MuiList } from "@refinedev/mui";
import { useList } from "@refinedev/core";

// --- Dummy Data for Charts ---
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

const growthData = [
  { month: "Jan", customers: 50 },
  { month: "Feb", customers: 80 },
  { month: "Mar", customers: 65 },
  { month: "Apr", customers: 90 },
  { month: "May", customers: 120 },
  { month: "Jun", customers: 150 },
  { month: "Jul", customers: 130 },
  { month: "Aug", customers: 160 },
  { month: "Sep", customers: 170 },
  { month: "Oct", customers: 180 },
  { month: "Nov", customers: 190 },
  { month: "Dec", customers: 220 },
];

// --- Type Definitions ---
interface Client {
  id: string;
  client: string;
  status: string;
  signed_date: string;
  email: string;
  phone: string;
  website: string;
  primary_contact: string;
}

interface Deal {
  id: string;
  title: string;
  amount: string;
  status: string;
  deal_date: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
}

// --- Dummy Arrays for Deals and Activities ---
const openDeals: Deal[] = [
  { id: "1", title: "Deal 1", amount: "$10,000", status: "Negotiation", deal_date: "2023-01-01" },
  { id: "2", title: "Deal 2", amount: "$15,000", status: "Proposal", deal_date: "2023-02-01" },
  { id: "3", title: "Deal 3", amount: "$8,000", status: "Prospect", deal_date: "2023-03-01" },
];

const recentActivities: Activity[] = [
  { id: "1", title: "Email Sent", description: "Follow-up email sent to Alice Johnson." },
  { id: "2", title: "Call Received", description: "Inbound call from Bob Smith regarding deal status." },
  { id: "3", title: "Meeting Scheduled", description: "Meeting scheduled with Carol White for project discussion." },
];

// --- DataGrid Columns for CRM Records (Reports Section) ---
const crmColumns: GridColDef[] = [
  { field: "id", headerName: "ID", minWidth: 70 },
  { field: "name", headerName: "Name", minWidth: 150, flex: 1 },
  { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
  { field: "phone", headerName: "Phone", minWidth: 150, flex: 1 },
];

export default function CRMPage() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  // Fetch recent clients. refine's useList returns an object with a "data" property containing our records.
  const { data: recentClientsResponse, isLoading: clientsLoading, isError: clientsError } = useList<Client>({
    resource: "clients",
    pagination: { pageSize: 5 },
  });
  // We expect recentClientsResponse to be in the shape: { data: Client[] }
  const recentClients: Client[] = recentClientsResponse?.data ?? [];

  // Fetch CRM records for the DataGrid (e.g. a generic resource "crmRecords")
  const { data: recordsResponse, isLoading: recordsLoading, isError: recordsError } = useList({
    resource: "crmRecords",
    pagination: { pageSize: 10 },
  });
  // Assume recordsResponse.data is our array of records.
  const crmRecords = recordsResponse?.data ?? [];

  return (
    <Box>
      {/* Main Content */}
      <Box sx={{ p: 2 }}>
        {/* Dashboard Section */}
        <Box id="dashboard" sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          {isLargeScreen && (
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: theme.palette.strong.default }}>
                  <Typography variant="h6" gutterBottom>
                    Sales Overview
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <LineChart
                      dataset={salesData}
                      xAxis={[{ dataKey: "month", scaleType: "band" }]}
                      series={[
                        {
                          id: "sales",
                          type: "line",
                          data: salesData.map((item) => item.sales),
                          dataKey: "sales",
                          color: theme.palette.primary.main,
                        },
                      ]}
                      tooltip={{}}
                      legend={{}}
                    />
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: theme.palette.strong.default }}>
                  <Typography variant="h6" gutterBottom>
                    Customer Growth
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <LineChart
                      dataset={growthData}
                      xAxis={[{ dataKey: "month", scaleType: "band" }]}
                      series={[
                        {
                          id: "growth",
                          type: "line",
                          data: growthData.map((item) => item.customers),
                          dataKey: "customers",
                          color: theme.palette.secondary.main,
                        },
                      ]}
                      tooltip={{}}
                      legend={{}}
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* CRM Sections */}
        <Grid container spacing={4}>
          {/* Recent Clients Section */}
          <Grid item xs={12} md={4}>
            <Box id="clients">
              <Card sx={{ p: 2, backgroundColor: theme.palette.strong.default }}>
                <Typography variant="h6" gutterBottom>
                  Recent Clients
                </Typography>
                {clientsLoading ? (
                  <Typography>Loading clients...</Typography>
                ) : clientsError ? (
                  <Typography>Error loading clients.</Typography>
                ) : (
                  recentClients.map((client: Client) => (
                    <Box key={client.id} sx={{ mb: 1 }}>
                      <Typography variant="subtitle1">{client.client}</Typography>
                      <Typography variant="body2">{client.status}</Typography>
                      <Typography variant="body2">{client.signed_date}</Typography>
                      <Typography variant="body2">{client.email}</Typography>
                      <Typography variant="body2">{client.phone}</Typography>
                      <Typography variant="body2">{client.website}</Typography>
                      <Typography variant="body2">{client.primary_contact}</Typography>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))
                )}
              </Card>
            </Box>
          </Grid>
          {/* Open Deals Section */}
          <Grid item xs={12} md={4}>
            <Box id="deals">
              <Card sx={{ p: 2, backgroundColor: theme.palette.strong.default }}>
                <Typography variant="h6" gutterBottom>
                  Open Deals
                </Typography>
                {openDeals.map((deal: Deal) => (
                  <Box key={deal.id} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">{deal.title}</Typography>
                    <Typography variant="body2">{deal.amount}</Typography>
                    <Typography variant="body2">{deal.status}</Typography>
                    <Typography variant="body2">
                      Date: {new Date(deal.deal_date).toLocaleDateString()}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                  </Box>
                ))}
              </Card>
            </Box>
          </Grid>
          {/* Recent Activities Section */}
          <Grid item xs={12} md={4}>
            <Box id="activities">
              <Card sx={{ p: 2, backgroundColor: theme.palette.strong.default }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                {recentActivities.map((activity: Activity) => (
                  <Box key={activity.id} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">{activity.title}</Typography>
                    <Typography variant="body2">{activity.description}</Typography>
                    <Divider sx={{ my: 1 }} />
                  </Box>
                ))}
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Reports Section */}
        <Box id="reports" sx={{ mt: 4 }}>
          <Card sx={{ height: 500, p: 2, backgroundColor: theme.palette.strong.default }}>
            <Typography variant="h5" gutterBottom>
              CRM Records
            </Typography>
            <MuiList title={<Typography variant="h5">CRM Records</Typography>}>
              <DataGrid rows={crmRecords} columns={crmColumns} />
            </MuiList>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

// Define Deal and Activity interfaces for type safety.
interface Deal {
  id: string;
  title: string;
  amount: string;
  status: string;
  deal_date: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
}
