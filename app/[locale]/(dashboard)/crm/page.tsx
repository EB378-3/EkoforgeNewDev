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

const renderDateCell = (params: GridRenderCellParams<any>) => {
  const { value } = params;
  console.log("Raw date value:", value);
  if (!value) return <Typography variant="body2">-</Typography>;
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) {
    return <Typography variant="body2">Invalid Date</Typography>;
  }
  return <DateField value={dateObj} />;
};

export default function LogbookList() {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
    meta: { select: "*" },
  });

  console.log("Fetched data:", dataGridProps);

  const columns: GridColDef[] = React.useMemo(
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
        minWidth: 100,
        headerAlign: "left",
        align: "left",
        // Remove valueGetter to let renderCell handle conversion
        renderCell: renderDateCell,
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
        field: "resource",
        headerName: "Aircraft",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "departure",
        headerName: "Departure",
        minWidth: 100,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "arrival",
        headerName: "Arrival",
        minWidth: 100,
        headerAlign: "left",
        align: "left",
      },
      {
        field: "offblock",
        headerName: "Offblock",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
        renderCell: renderDateCell,
      },
      {
        field: "takeoff",
        headerName: "Takeoff",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
        renderCell: renderDateCell,
      },
      {
        field: "landing",
        headerName: "Landing",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
        renderCell: renderDateCell,
      },
      {
        field: "onblock",
        headerName: "Onblock",
        minWidth: 150,
        headerAlign: "left",
        align: "left",
        renderCell: renderDateCell,
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
        minWidth: 150,
        headerAlign: "left",
        align: "left",
        renderCell: renderDateCell,
      },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 150,
        headerAlign: "right",
        align: "right",
        sortable: false,
        display: "flex",
        renderCell: ({ row }: GridRenderCellParams<any>) => (
          <>
            <EditButton hideText recordItemId={row.id} />
            <ShowButton hideText recordItemId={row.id} />
            <DeleteButton hideText recordItemId={row.id} />
          </>
        ),
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
}
