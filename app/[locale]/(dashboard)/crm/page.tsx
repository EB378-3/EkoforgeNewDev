"use client";

import React from "react";
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
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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

const recentContacts = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "555-1234" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "555-5678" },
  { id: 3, name: "Carol White", email: "carol@example.com", phone: "555-9012" },
];

const openDeals = [
  { id: 1, title: "Deal 1", amount: "$10,000", status: "Negotiation" },
  { id: 2, title: "Deal 2", amount: "$15,000", status: "Proposal" },
  { id: 3, title: "Deal 3", amount: "$8,000", status: "Prospect" },
];

const recentActivities = [
  { id: 1, title: "Email Sent", description: "Follow-up email sent to Alice Johnson." },
  { id: 2, title: "Call Received", description: "Inbound call from Bob Smith regarding deal status." },
  { id: 3, title: "Meeting Scheduled", description: "Meeting scheduled with Carol White for project discussion." },
];

const crmColumns: GridColDef[] = [
  { field: "id", headerName: "ID", minWidth: 70 },
  { field: "name", headerName: "Name", minWidth: 150, flex: 1 },
  { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
  { field: "phone", headerName: "Phone", minWidth: 150, flex: 1 },
];

export default function CRMPage() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box>
      <CssBaseline />
      <GlobalStyles styles={{ body: { backgroundColor: "#f5f5f5" } }} />

      {/* AppBar Navigation */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My CRM
          </Typography>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Contacts</Button>
          <Button color="inherit">Deals</Button>
          <Button color="inherit">Activities</Button>
          <Button color="inherit">Reports</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 2 }}>
        {/* Charts Section (visible only on large screens) */}
        {isLargeScreen && (
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Sales Overview
                </Typography>
                <Box sx={{ height: 250 }}>
                  <LineChart
                    dataset={salesData} // Add this line
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
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Growth
                </Typography>
                <Box sx={{ height: 250 }}>
                  <LineChart
                    dataset={growthData} // Add this line
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

        {/* CRM Sections */}
        <Grid container spacing={4}>
          {/* Recent Contacts */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Contacts
              </Typography>
              {recentContacts.map((contact) => (
                <Box key={contact.id} sx={{ mb: 1 }}>
                  <Typography variant="subtitle1">{contact.name}</Typography>
                  <Typography variant="body2">{contact.email}</Typography>
                  <Typography variant="body2">{contact.phone}</Typography>
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </Card>
          </Grid>
          {/* Open Deals */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Open Deals
              </Typography>
              {openDeals.map((deal) => (
                <Box key={deal.id} sx={{ mb: 1 }}>
                  <Typography variant="subtitle1">{deal.title}</Typography>
                  <Typography variant="body2">{deal.amount}</Typography>
                  <Typography variant="body2">{deal.status}</Typography>
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </Card>
          </Grid>
          {/* Recent Activities */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              {recentActivities.map((activity) => (
                <Box key={activity.id} sx={{ mb: 1 }}>
                  <Typography variant="subtitle1">{activity.title}</Typography>
                  <Typography variant="body2">{activity.description}</Typography>
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </Card>
          </Grid>
        </Grid>

        {/* DataGrid Section for additional CRM records */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            CRM Records
          </Typography>
          <Card sx={{ height: 500, p: 2 }}>
            {/* Replace rows and columns with your actual CRM data */}
            <DataGrid rows={[]} columns={crmColumns} />
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
