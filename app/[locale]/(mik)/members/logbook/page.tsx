"use client";

import React from "react";
import { List, EditButton, ShowButton, DeleteButton } from "@refinedev/mui";
import { useShow, useTable } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack } from "@mui/material";

interface Logbook {
  id: number;
  profile_id: string;
  resource_id: number;
  flight_date: string; // ISO date string
  flight_time: number;
  notes?: string;
  block_off_time?: string;
  takeoff_time?: string;
  landing_time?: string;
  block_on_time?: string;
  block_time?: number;
  landings?: number;
  flight_details: Record<string, any>;
  fuel_left?: number;
  billing_info?: string;
  pax?: number;
  departure_place?: string;
  arrival_place?: string;
  flight_type?: string;
  pic_id?: string;
  student_id?: string;
  created_at: string;
  updated_at: string;
}
// Helper to format time strings as four-digit HHmm.
function formatHHmm(value: string | number | null | undefined): string {
  if (!value) return "0000";
  if (typeof value === "number") return value.toString().padStart(4, "0");
  if (typeof value === "string") return value.padStart(4, "0");
  return "0000";
}

// Component to display a profile's full name based on profileId.
function ProfileName({ profileId }: { profileId: string }) {
  const { queryResult } = useShow({
    resource: "profiles",
    id: profileId,
    meta: { select: "first_name,last_name" },
    queryOptions: { enabled: !!profileId },
  });
  const profileData = queryResult?.data?.data as { first_name: string; last_name: string } | undefined;
  if (!profileData) return <span>Loading...</span>;
  return <span>{profileData.first_name} {profileData.last_name}</span>;
}

// Component to display a resource's name based on id.
function ResourceName({ id }: { id: string }) {
  const { queryResult } = useShow({
    resource: "resources",
    id: id,
    meta: { select: "name" },
    queryOptions: { enabled: !!id },
  });
  const resourceData = queryResult?.data?.data as { name: string } | undefined;
  if (!resourceData) return <span>Loading...</span>;
  return <span>{resourceData.name}</span>;
}

export default function LogbookList() {
  const {
    tableQueryResult,
    pageCount,
    current,
    setCurrent,
    pageSize,
    setPageSize,
  } = useTable<Logbook>({
    resource: "logbook",
    initialSorter: [{ field: "id", order: "asc" }],
    initialPageSize: 10,
  });

  const rows = tableQueryResult?.data?.data ?? [];
  const total = pageCount * pageSize;

  // Build a set of all keys in flight_details objects from rows.
  const flightDetailKeys = new Set<string>();
  rows.forEach((row) => {
    if (row.flight_details && typeof row.flight_details === "object") {
      Object.keys(row.flight_details).forEach((key) => flightDetailKeys.add(key));
    }
  });
  const flightDetailColumns: GridColDef[] = Array.from(flightDetailKeys).map((key) => ({
    field: `flight_details_${key}`,
    headerName: key.toUpperCase(),
    width: 150,
    renderCell: (params) => {
      return params.row.flight_details ? params.row.flight_details[key] : "";
    },
  }));

  // Static columns
  const staticColumns: GridColDef[] = [
    {
      field: "profile_name",
      headerName: "Billed Person",
      width: 150,
      renderCell: (params) => <ProfileName profileId={params.row.profile_id} />,
    },
    {
      field: "resource_id",
      headerName: "Resource",
      width: 150,
      renderCell: (params) => <ResourceName id={String(params.row.resource_id)} />,
    },
    { field: "flight_date", headerName: "Flight Date", width: 150 },
    { field: "flight_time", headerName: "Flight Time", width: 120, renderCell: (params) => {return formatHHmm(params.row.flight_time);} },
    { field: "block_time", headerName: "Block Time", width: 150, renderCell: (params) => {return formatHHmm(params.row.block_time);} },
    { field: "block_off_time", headerName: "Block Off Time", width: 150,
    },
    { field: "takeoff_time", headerName: "Takeoff Time", width: 150, },
    { field: "landing_time", headerName: "Landing Time", width: 150 },
    { field: "block_on_time", headerName: "Block On Time", width: 150 },
    { field: "landings", headerName: "Landings", width: 100 },
    { field: "fuel_left", headerName: "Fuel Left", width: 120 },
    { field: "billing_info", headerName: "Billing Info", flex: 1 },
    { field: "pax", headerName: "PAX", width: 100 },
    { field: "departure_place", headerName: "Departure Place", width: 150 },
    { field: "arrival_place", headerName: "Arrival Place", width: 150 },
    { field: "flight_type", headerName: "Flight Type", width: 150 },
    {
      field: "pic_id",
      headerName: "PIC ID",
      width: 150,
      renderCell: (params) => <ProfileName profileId={params.row.pic_id} />,
    },
    {
      field: "student_id",
      headerName: "Student ID",
      width: 150,
      renderCell: (params) =>
        params.row.student_id ? <ProfileName profileId={params.row.student_id} /> : <span>N/A</span>,
    },
    { field: "notes", headerName: "Notes", flex: 1 },
    {
      field: "created_at",
      headerName: "Created At",
      width: 180,
      renderCell: ({ value }) => new Date(value).toLocaleString(),
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 180,
      renderCell: ({ value }) => new Date(value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <EditButton hideText size="small" variant="outlined" resourceNameOrRouteName="logbook" recordItemId={row.id} />
          <ShowButton hideText size="small" variant="outlined" resourceNameOrRouteName="logbook" recordItemId={row.id} />
          <DeleteButton hideText size="small" variant="outlined" resourceNameOrRouteName="logbook" recordItemId={row.id} />
        </Stack>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  // Combine static columns and flight details dynamic columns.
  const columns: GridColDef[] = [...staticColumns, ...flightDetailColumns];

  return (
    <List title="Logbook Entries">
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
