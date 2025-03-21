"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useTable,
  useList,
  useGetIdentity,
  useOne
} from "@refinedev/core";
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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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
  // Fetch author details.
  const { data: profileData, isLoading: profileLoading } = useOne<any>({
    resource: "profiles",
    id: blog.profile_id,
    meta: { select: "first_name,last_name" },
  });
  const authorName = profileData?.data
    ? `${profileData.data.first_name} ${profileData.data.last_name}`
    : "Unknown";

  return (
    <Card sx={{ maxWidth: 345, m: 1, boxShadow: 3, borderRadius: 2 }}>
      <CardActionArea component={Link} href={`/members/blogs/show/${blog.id}`}>
        <CardContent>
          <Typography variant="h6">{blog.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {blog.content.substring(0, 150)}...
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
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

  // MY BOOKINGS SECTION
  const { data: identityData } = useGetIdentity<{ id: string }>();
  const currentUserId = identityData?.id;

  const { data: bookingsData } = useList<Booking>({
    resource: "bookings",
    filters: currentUserId ? [{ field: "profile_id", operator: "eq", value: currentUserId }] : [],
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
  const monthlyData: { month: string; flightHours: number }[] = monthNames.map((m) => ({ month: m, flightHours: 0 }));
  logbookEntries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    if (entryDate.getFullYear() === currentYear) {
      monthlyData[entryDate.getMonth()].flightHours += entry.flightHours;
    }
  });

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Blog Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Club Blog
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Stay updated with our latest club news and stories.
            </Typography>
            <Grid container spacing={2}>
              {blogs.map((blog) => (
                <Grid item xs={12} sm={6} md={4} key={blog.id}>
                  <BlogCard blog={blog} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button variant="contained" component={Link} href="/members/blogs/create">
                Create New Blog Post
              </Button>
            </Box>
          </Box>
          {/* Flight Log Chart Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Year-to-Date Flight Log
            </Typography>
            <Paper sx={{ p: 2 }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="flightHours" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Grid>
        {/* Right Column: Calendar */}
        <Grid item xs={12} md={4}>
          {/* My Bookings Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              My Bookings
            </Typography>
            {myBookings.length > 0 ? (
              myBookings.map((booking) => (
                <Box key={booking.id} sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 2 }}>
                  <Typography variant="subtitle1">
                    {booking.title || "Untitled Booking"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No bookings found.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
