"use client";

import React from "react";
import { Box, Typography, Card } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useList } from "@refinedev/core";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", minWidth: 70 },
  { field: "name", headerName: "Name", minWidth: 150, flex: 1 },
  { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
  { field: "phone", headerName: "Phone", minWidth: 150, flex: 1 },
];

export default function ReportsPage() {
  const { data, isLoading, isError } = useList({ resource: "reports" });

  if (isLoading) return <Typography>Loading reports...</Typography>;
  if (isError) return <Typography>Error loading reports.</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Card sx={{ height: 500, p: 2 }}>
        <DataGrid rows={data?.data || []} columns={columns} />
      </Card>
    </Box>
  );
}
