"use client";

import React from "react";
import { useTable, useOne } from "@refinedev/core";
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import Link from "next/link";

interface Blog {
  id: string;
  profile_id: string;
  title: string;
  content: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function BlogCard({ blog }: { blog: Blog }) {
  // Fetch author details based on profile_id
  const { data: profileData, isLoading: profileLoading } = useOne<any>({
    resource: "profiles",
    id: blog.profile_id,
    meta: { select: "first_name,last_name" },
  });
  const authorName = profileData?.data
    ? `${profileData.data.first_name} ${profileData.data.last_name}`
    : "Unknown";

  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardActionArea component={Link} href={`/members/blogs/show/${blog.id}`}>
        <CardContent>
          <Typography variant="h6" component="div">
            {blog.title}
          </Typography>
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

export default function BlogsListPage() {
  const { tableQueryResult } = useTable<Blog>({
    resource: "blogs",
    initialSorter: [
      {
        field: "published_at",
        order: "desc",
      },
    ],
    initialPageSize: 12,
  });

  const blogs = tableQueryResult?.data?.data ?? [];

  return (
    <Box sx={{ p: 4 }}>
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
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Button variant="contained" component={Link} href="/members/blogs/create">
          Create New Blog Post
        </Button>
      </Box>
    </Box>
  );
}
