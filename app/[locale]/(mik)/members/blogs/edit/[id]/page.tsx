"use client";

import React from "react";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Box, TextField, Typography, Paper } from "@mui/material";
import { useOne } from "@refinedev/core";

// Define the Blog interface matching your table structure.
interface Blog {
  id: string;
  profile_id: string;
  title: string;
  content: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function BlogEditPage() {
  // useForm automatically fetches the record and populates defaultValues.
  const {
    register,
    formState: { errors },
    saveButtonProps,
    watch,
  } = useForm<Blog>();

  
  return (
    <Edit title="Edit Blog Post" saveButtonProps={saveButtonProps}>
      <Paper sx={{ p: 3, m: 2 }}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Title"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={typeof errors.title?.message === "string" ? errors.title.message : ""}
          />
          <TextField
            label="Content"
            multiline
            rows={6}
            {...register("content", { required: "Content is required" })}
            error={!!errors.content}
            helperText={typeof errors.content?.message === "string" ? errors.content.message : ""}
          />
        </Box>
      </Paper>
    </Edit>
  );
}
