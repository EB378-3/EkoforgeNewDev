"use client";

import React from "react";
import { Show } from "@refinedev/mui";
import { useShow } from "@refinedev/core";
import { Box, Typography, Paper } from "@mui/material";

// Blog interface matching your table structure.
interface Blog {
  id: string;
  profile_id: string;
  title: string;
  content: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Helper component to fetch and display the author's full name.
function AuthorName({ profileId }: { profileId: string }) {
  const { queryResult } = useShow<{ first_name: string; last_name: string }>({
    resource: "profiles",
    id: profileId,
    meta: { select: "first_name,last_name" },
    queryOptions: { enabled: !!profileId },
  });
  const data = queryResult?.data?.data;
  if (!data) return <Typography variant="body2">Loading...</Typography>;
  return (
    <Typography variant="body2">
      {data.first_name} {data.last_name}
    </Typography>
  );
}

export default function BlogShowPage() {
  const { queryResult } = useShow<Blog>({ resource: "blogs", meta: { select: "*" } });
  const blog = queryResult?.data?.data;

  if (!blog) return <Typography>Loading...</Typography>;

  return (
    <Show title="Blog Details">
      <Paper sx={{ p: 3, m: 2 }}>
        <Typography variant="h4" gutterBottom>
          {blog.title}
        </Typography>
        {blog.published_at && (
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Published: {new Date(blog.published_at).toLocaleString()}
          </Typography>
        )}
        <Box sx={{ my: 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {blog.content}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" display="block">
            Created At: {new Date(blog.created_at).toLocaleString()}
          </Typography>
          <Typography variant="caption" display="block">
            Updated At: {new Date(blog.updated_at).toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Author:</Typography>
          <AuthorName profileId={blog.profile_id} />
        </Box>
      </Paper>
    </Show>
  );
}
