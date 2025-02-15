"use client";

import React from "react";
import { Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  List,
  DateField,
  DeleteButton,
  EditButton,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";

export default function LogbookList() {
  // Configure the data grid for the "logbook"
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
    meta: { select: "*" },
  });
  console.log("Fetched data:", dataGridProps);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "Log ID",
        type: "number",
        minWidth: 70,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "date",
        headerName: "Date",
        type: "date",
        minWidth: 100,
        headerAlign: "left",
        align: "left",
        valueGetter: ({ value }: GridRenderCellParams<any>) =>
          value ? new Date(value) : null,
        renderCell: ({ value }: GridRenderCellParams<any>) => (
          <DateField value={value} />
        ),
      },
      {
        field: "pic",
        headerName: "Pilot in Command",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
        renderCell: ({ value }: GridRenderCellParams<any>) => (
          <Typography variant="body2">{value || "-"}</Typography>
        ),
      },      
      {
        field: "pax",
        headerName: "Passengers",
        type: "number",
        minWidth: 100,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "departure",
        headerName: "Departure",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "arrival",
        headerName: "Arrival",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "offblock",
        headerName: "Offblock",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
        valueGetter: ({ value }: GridRenderCellParams<any>) =>
          value ? new Date(value) : null,
        renderCell: ({ value }: GridRenderCellParams<any>) => (
          <DateField value={value} />
        ),
      },
      {
        field: "takeoff",
        headerName: "Takeoff",
        type: "dateTime",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
        valueGetter: ({ value }: GridRenderCellParams<any>) =>
          value ? new Date(value) : null,
        renderCell: ({ value }: GridRenderCellParams<any>) => (
          <DateField value={value} />
        ),
      },
      {
        field: "landing",
        headerName: "Landing",
        type: "dateTime",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
        valueGetter: ({ value }: GridRenderCellParams<any>) =>
          value ? new Date(value) : null,
        renderCell: ({ value }: GridRenderCellParams<any>) => (
          <DateField value={value} />
        ),
      },
      {
        field: "onblock",
        headerName: "Onblock",
        type: "dateTime",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
        valueGetter: ({ value }: GridRenderCellParams<any>) =>
          value ? new Date(value) : null,
        renderCell: ({ value }: GridRenderCellParams<any>) => (
          <DateField value={value} />
        ),
      },
      {
        field: "landings",
        headerName: "Landings",
        type: "number",
        minWidth: 100,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "flightrules",
        headerName: "Flight Rules",
        minWidth: 120,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "night",
        headerName: "Night",
        minWidth: 100,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "ir",
        headerName: "IR",
        minWidth: 100,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "fuel",
        headerName: "Fuel",
        type: "number",
        minWidth: 100,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "flight_type",
        headerName: "Flight Type",
        minWidth: 120,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "details",
        headerName: "Details",
        minWidth: 200,
        headerAlign: "left",
        align: "left",
        renderCell: ({ value }: GridRenderCellParams<any>) => {
          if (!value) return "-";
          return (
            <Typography variant="body2" noWrap>
              {value}
            </Typography>
          );
        },
      },
      {
        field: "billing_details",
        headerName: "Billing Details",
        minWidth: 200,
        headerAlign: "left",
        align: "left",
        renderCell: ({ value }: GridRenderCellParams<any>) => {
          if (!value) return "-";
          return (
            <Typography variant="body2" noWrap>
              {value}
            </Typography>
          );
        },
      },
      {
        field: "created_at",
        headerName: "Created At",
        type: "dateTime",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
        valueGetter: ({ value }: GridRenderCellParams<any>) =>
          value ? new Date(value) : null,
        renderCell: ({ value }: GridRenderCellParams<any>) => (
          <DateField value={value} />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 150,
        headerAlign: "right",
        align: "right",
        sortable: false,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
      />
    </List>
  );
}
