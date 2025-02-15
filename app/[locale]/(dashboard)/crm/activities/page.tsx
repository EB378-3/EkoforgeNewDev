"use client";

import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useList } from "@refinedev/core";

export default function ActivitiesPage() {
  const { data, isLoading, isError } = useList({ resource: "activities" });

  if (isLoading) return <Typography>Loading activities...</Typography>;
  if (isError) return <Typography>Error loading activities.</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Activities
      </Typography>
      <List>
        {data?.data.map((activity: any) => (
          <ListItem key={activity.id} divider>
            <ListItemText
              primary={activity.title}
              secondary={activity.description}
            />
            <Divider />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
