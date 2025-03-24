"use client";

import React from "react";
import Link from "next/link";
import { useTable, useList, useGetIdentity, useOne } from "@refinedev/core";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import TestABC from "@/components/test";

// --------------------
// Interfaces
// --------------------

interface Blog {
  id: string;
  profile_id: string;
  title: string;
  content: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Booking {
  id?: string;
  profile_id: string;
  resource_id: string;
  start_time: string;
  end_time: string;
  title?: string;
  notes?: string;
  instructor_id?: string;
  flight_type?: string;
  created_at?: string;
  updated_at?: string;
}

interface Resource {
  id: string;
  name: string;
}

interface LogBookEntry {
  id: string;
  date: string;
  flightHours: number;
}

export interface Instructor {
  id: string;
  name: string;
}

// --------------------
// Blog Card Component
// --------------------

function BlogCard({ blog }: { blog: Blog }) {
  const { data: profileData, isLoading: profileLoading } = useOne<any>({
    resource: "profiles",
    id: blog.profile_id,
    meta: { select: "first_name,last_name" },
  });
  const authorName = profileData?.data
    ? `${profileData.data.first_name} ${profileData.data.last_name}`
    : "Unknown";

  return (
    <Card sx={{ maxWidth: 320, m: 0.5, boxShadow: 2, borderRadius: 1 }}>
      <CardActionArea component={Link} href={`/members/blogs/show/${blog.id}`}>
        <CardContent sx={{ p: 1 }}>
          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
            {blog.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: "0.8rem" }}>
            {blog.content.substring(0, 150)}...
          </Typography>
          <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              {blog.published_at
                ? new Date(blog.published_at).toLocaleDateString()
                : "Unpublished"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              By: {profileLoading ? "Loading..." : authorName}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// --------------------
// Helper component to display a resource's name based on id.
function ResourceName({ id }: { id: string }) {
  const { data, isLoading } = useOne({
    resource: "resources",
    id: id,
    meta: { select: "name" },
    queryOptions: { enabled: !!id },
  });
  const resourceData = data?.data as { name: string } | undefined;
  if (!resourceData) return <Typography variant="caption">Loading...</Typography>;
  return <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>{resourceData.name}</Typography>;
}

// --------------------
// Front Page Component
// --------------------

export default function FrontPage() {
  // BLOG SECTION
  const { tableQueryResult } = useTable<Blog>({
    resource: "blogs",
    initialSorter: [{ field: "published_at", order: "desc" }],
    initialPageSize: 12,
  });
  const blogs = tableQueryResult?.data?.data ?? [];

  // MY BOOKINGS SECTION - Only current or future bookings
  const { data: identityData } = useGetIdentity<{ id: string }>();
  const currentUserId = identityData?.id || "default-user";
  const currentISO = new Date().toISOString();
  const { data: bookingsData } = useList<Booking>({
    resource: "bookings",
    filters: [
      { field: "profile_id", operator: "eq", value: currentUserId },
      { field: "start_time", operator: "gte", value: currentISO },
    ],
    meta: { select: "*" },
  });
  const myBookings = bookingsData?.data ?? [];

  // LOGBOOK CHART SECTION
  const { data: logbookData } = useList<LogBookEntry>({
    resource: "logbook",
    meta: { select: "*" },
  });
  const logbookEntries = logbookData?.data ?? [];
  const currentYear = new Date().getFullYear();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData: { month: string; flightHours: number }[] = monthNames.map((m) => ({
    month: m,
    flightHours: 0,
  }));
  logbookEntries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    if (entryDate.getFullYear() === currentYear) {
      monthlyData[entryDate.getMonth()].flightHours += entry.flightHours;
    }
  });

  // --------------------
  // Define DataGrid columns for My Bookings
  // --------------------
  const bookingColumns: GridColDef[] = [
    {
      field: "resource",
      headerName: "Aircraft",
      width: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <ResourceName id={params.row.resource_id} />,
    },
    {
      field: "start_time",
      headerName: "Start Time",
      width: 150,
      renderCell: (params) => new Date(params.row.start_time).toLocaleString(),
      headerClassName: "super-app-theme--header",
    },
    {
      field: "total_hours",
      headerName: "Total Time",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const start = new Date(params.row.start_time);
        const end = new Date(params.row.end_time);
        const diffMs = end.getTime() - start.getTime();
        if (diffMs > 0) {
          const totalMinutes = Math.floor(diffMs / 60000);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}`;
        }
        return "0000";
      },
    },
  ];

  // --------------------
  // Define DataGrid columns for My Stats
  // --------------------
  const myStatsColumns: GridColDef[] = [
    {
      field: "resource",
      headerName: "Aircraft",
      width: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <ResourceName id={params.row.resource_id} />,
    },
    {
      field: "start_time",
      headerName: "Start Time",
      width: 150,
      renderCell: (params) => new Date(params.row.start_time).toLocaleString(),
      headerClassName: "super-app-theme--header",
    },
    {
      field: "total_hours",
      headerName: "Total Time",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const start = new Date(params.row.start_time);
        const end = new Date(params.row.end_time);
        const diffMs = end.getTime() - start.getTime();
        if (diffMs > 0) {
          const totalMinutes = Math.floor(diffMs / 60000);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}`;
        }
        return "0000";
      },
    },
  ];



  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* Blog Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Club Blog
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Stay updated with our latest club news and stories.
            </Typography>
            <Grid container spacing={1}>
              {blogs.map((blog) => (
                <Grid item xs={12} sm={6} md={4} key={blog.id}>
                  <BlogCard blog={blog} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
              <Button variant="contained" component={Link} href="/members/blogs/create" size="small">
                Create New Blog Post
              </Button>
            </Box>
          </Box>
          {/* Flight Log Chart Section */}
          <Box sx={{ mb: 3 }}>
            <TestABC/>
            <Typography variant="h5" gutterBottom>
              Year-to-Date Flight Log
            </Typography>
            <Paper sx={{ p: 1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                  <Bar dataKey="flightHours" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Grid>
        {/* Right Column: My Bookings as DataGrid */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Upcoming Bookings
          </Typography>
          <Paper sx={{ height: 400, p: 1 }}>
            <DataGrid
              autoHeight
              rows={myBookings}
              columns={bookingColumns}
              pageSizeOptions={[5, 10, 15]}
              pagination
              getRowId={(row) => row.id}
              sx={{
                "& .MuiDataGrid-cell": { fontSize: "0.75rem" },
                "& .MuiDataGrid-columnHeaderTitle": { fontSize: "0.75rem" },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
