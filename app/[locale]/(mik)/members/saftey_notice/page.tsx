"use client";

import React from "react";
import { List, EditButton, ShowButton, DeleteButton } from "@refinedev/mui";
import { useShow, useTable, useList } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Stack, Typography } from "@mui/material";

// Notice interface
interface Notice {
  id: string;
  title: string;
  message: string;
  time_off_incident?: string;
  submitted_by: string;
  extra_parameters?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Helper component to display a profile's full name based on profileId.
function ProfileName({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "first_name,last_name" },
    queryOptions: { enabled: !!profileId },
  });
  const profileData = queryResult?.data?.data as { first_name: string; last_name: string } | undefined;
  if (!profileData) return <Typography variant="caption">Loading...</Typography>;
  return (
    <Typography variant="caption">
      {profileData.first_name} {profileData.last_name}
    </Typography>
  );
}

// Compute union of extra parameter keys across all rows.
function getExtraParameterKeys(rows: Notice[]): string[] {
  const keys = new Set<string>();
  rows.forEach((row) => {
    if (row.extra_parameters && typeof row.extra_parameters === "object") {
      Object.keys(row.extra_parameters).forEach((key) => keys.add(key));
    }
  });
  return Array.from(keys);
}

export default function NoticesList() {
  const {
    tableQueryResult,
    pageCount,
    current,
    setCurrent,
    pageSize,
    setPageSize,
  } = useTable<Notice>({
    resource: "notices",
    initialSorter: [{ field: "id", order: "asc" }],
    initialPageSize: 10,
  });

  const rows = tableQueryResult?.data?.data ?? [];
  const total = pageCount * pageSize;

  // Create dynamic columns for extra_parameters (one per key)
  const extraKeys = getExtraParameterKeys(rows);
  const dynamicExtraColumns: GridColDef[] = extraKeys.map((key) => ({
    field: `extra_${key}`,
    headerName: key.toUpperCase(),
    width: 150,
    renderCell: (params) => {
      const extras = params.row.extra_parameters;
      return extras ? (typeof extras[key] === "object" ? JSON.stringify(extras[key]) : String(extras[key])) : "";
    },
  }));

  // Static columns before dynamic ones.
  const staticColumnsPre: GridColDef[] = [
    { field: "id", headerName: "ID", width: 25 },
    { field: "title", headerName: "Title", width: 120 },
    { field: "message", headerName: "Message", width: 200 },
  ];

  // Static columns after dynamic ones.
  const staticColumnsPost: GridColDef[] = [
    {
      field: "submitted_by",
      headerName: "Submitted By",
      width: 150,
      renderCell: (params) => <ProfileName profileId={params.row.submitted_by} />,
    },
    {
      field: "time_off_incident",
      headerName: "Time Off Incident",
      width: 180,
      renderCell: ({ value }) => new Date(value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <EditButton hideText size="small" variant="outlined" resourceNameOrRouteName="notices" recordItemId={row.id} />
          <ShowButton hideText size="small" variant="outlined" resourceNameOrRouteName="notices" recordItemId={row.id} />
          <DeleteButton hideText size="small" variant="outlined" resourceNameOrRouteName="notices" recordItemId={row.id} />
        </Stack>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  // Combine all columns: static columns before, dynamic extra parameter columns, then static columns after.
  const columns: GridColDef[] = [...staticColumnsPre, ...dynamicExtraColumns, ...staticColumnsPost];

  return (
    <List title="Notices">
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        rowCount={total}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        pagination
        paginationModel={{ page: current - 1, pageSize }}
        onPaginationModelChange={(model) => {
          setCurrent(model.page + 1);
          setPageSize(model.pageSize);
        }}
      />
    </List>
  );
}
