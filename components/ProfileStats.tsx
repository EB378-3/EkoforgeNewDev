"use client";

import React, { useMemo } from "react";
import { useList, useGetIdentity } from "@refinedev/core";
import { Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";

interface LogBookEntry {
  id: string;
  profile_id: string;
  resource_id: string;
  date: string; // ISO date string
  flightHours: number;
  landings: number;
}

interface StatsRow {
  resource_id: string;
  last_flight: string;
  landings_last_month: number;
  landings_last_90: number;
  landings_last_6m: number;
  landings_last_year: number;
  total_landings: number;
}

function aggregateLogbookStats(entries: LogBookEntry[], currentUserId?: string): StatsRow[] {
  const now = new Date();
  const oneMonth = 30;
  const ninetyDays = 90;
  const sixMonths = 180;
  const oneYear = 365;
  const stats: Record<string, StatsRow> = {};

  entries.forEach((entry) => {
    if (currentUserId && entry.profile_id !== currentUserId) return;
    const resId = entry.resource_id;
    if (!stats[resId]) {
      stats[resId] = {
        resource_id: resId,
        last_flight: entry.date,
        landings_last_month: 0,
        landings_last_90: 0,
        landings_last_6m: 0,
        landings_last_year: 0,
        total_landings: 0,
      };
    }
    const stat = stats[resId];
    const entryDate = new Date(entry.date);
    if (new Date(stat.last_flight) < entryDate) {
      stat.last_flight = entry.date;
    }
    stat.total_landings += entry.landings;
    const diffDays = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= oneMonth) stat.landings_last_month += entry.landings;
    if (diffDays <= ninetyDays) stat.landings_last_90 += entry.landings;
    if (diffDays <= sixMonths) stat.landings_last_6m += entry.landings;
    if (diffDays <= oneYear) stat.landings_last_year += entry.landings;
  });

  return Object.values(stats);
}

const myStatsColumns: GridColDef[] = [
  {
    field: "resource",
    headerName: "Aircraft",
    width: 100,
    renderCell: (params) => <span>{params.row.resource_id}</span>,
  },
  {
    field: "last_flight",
    headerName: "Last Flight",
    width: 150,
    renderCell: (params) => {
      const date = params.row.last_flight
        ? format(parseISO(params.row.last_flight), "yyyy-MM-dd")
        : "N/A";
      return <span>{date}</span>;
    },
  },
  {
    field: "landings_last_month",
    headerName: "Landings (Last Month)",
    width: 150,
    renderCell: (params) => <span>{params.row.landings_last_month ?? 0}</span>,
  },
  {
    field: "landings_last_90",
    headerName: "Landings (Last 90 Days)",
    width: 150,
    renderCell: (params) => <span>{params.row.landings_last_90 ?? 0}</span>,
  },
  {
    field: "landings_last_6m",
    headerName: "Landings (Last 6 Months)",
    width: 150,
    renderCell: (params) => <span>{params.row.landings_last_6m ?? 0}</span>,
  },
  {
    field: "landings_last_year",
    headerName: "Landings (Last Year)",
    width: 150,
    renderCell: (params) => <span>{params.row.landings_last_year ?? 0}</span>,
  },
  {
    field: "total_landings",
    headerName: "Total Landings",
    width: 150,
    renderCell: (params) => <span>{params.row.total_landings ?? 0}</span>,
  },
];

export function StatsBanner() {
  const { data: identityData } = useGetIdentity<{ id: string }>();
  const currentUserId = identityData?.id;

  const { data: logbookData, isLoading } = useList<LogBookEntry>({
    resource: "logbook",
    meta: { select: "*" },
  });
  const logbookEntries = logbookData?.data ?? [];

  const aggregatedStats = useMemo(
    () => aggregateLogbookStats(logbookEntries, currentUserId),
    [logbookEntries, currentUserId]
  );

  if (isLoading && aggregatedStats.length === 0) {
    return <Typography variant="caption">Loading stats...</Typography>;
  }

  return (
    <Paper sx={{ width: "100%", height: 150, p: 1 }}>
      <DataGrid
        rows={aggregatedStats}
        columns={myStatsColumns}
        hideFooter
        disableColumnMenu
        disableRowSelectionOnClick
        getRowId={(row) => row.resource_id}
        sx={{
          "& .MuiDataGrid-cell": { fontSize: "0.7rem" },
          "& .MuiDataGrid-columnHeaderTitle": { fontSize: "0.7rem" },
        }}
      />
    </Paper>
  );
}

export default StatsBanner;
