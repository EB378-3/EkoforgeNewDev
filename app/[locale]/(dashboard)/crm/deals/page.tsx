"use client";

import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useList } from "@refinedev/core";

export default function DealsPage() {
  const { data, isLoading, isError } = useList({ resource: "deals" });

  if (isLoading) return <Typography>Loading deals...</Typography>;
  if (isError) return <Typography>Error loading deals.</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Deals
      </Typography>
      <List>
        {data?.data.map((deal: any) => (
          <ListItem key={deal.id} divider>
            <ListItemText
              primary={deal.title}
              secondary={`Amount: ${deal.amount} | Status: ${deal.status}`}
            />
            <Divider />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
