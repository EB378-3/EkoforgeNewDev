"use client";

import React from "react";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useGetIdentity, useOne } from "@refinedev/core";
import { Box, TextField, Typography, Paper } from "@mui/material";

interface Blog {
  id: string;
  profile_id: string;
  title: string;
  content: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function BlogCreatePage() {

  const {
    register,
    formState: { errors },
    saveButtonProps,
  } = useForm<Blog>({
    defaultValues: {
      title: "",
      content: "",      
    },
  });


  return (
    <Create title="Create Blog Post" saveButtonProps={saveButtonProps}>
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
            helperText={typeof errors.content?.message === "string" ? errors.content.message : ""}
          />
        </Box>
      </Paper>
    </Create>
  );
}
