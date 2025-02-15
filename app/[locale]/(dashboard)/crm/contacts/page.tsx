"use client";

import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useList } from "@refinedev/core";

export default function ContactsPage() {
  const { data, isLoading, isError } = useList({ resource: "contacts" });

  if (isLoading) return <Typography>Loading contacts...</Typography>;
  if (isError) return <Typography>Error loading contacts.</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Contacts
      </Typography>
      <List>
        {data?.data.map((contact: any) => (
          <ListItem key={contact.id} divider>
            <ListItemText
              primary={contact.name}
              secondary={`${contact.email} - ${contact.phone}`}
            />
            <Divider />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
