"use client";

import React from "react";
import {
    List,
    EditButton,
    ShowButton,
} from "@refinedev/mui";
import { useTable } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack, Typography } from "@mui/material";

interface Resource {
  id: number;
  resource_type: "aircraft" | "simulator" | "classroom";
  name: string;
  status: "available" | "maintenance" | "booked";
  created_at: string;
  updated_at: string;
  // Optionally, aggregated fields might be stored in the record.
}

// This component simulates fetching aggregated data (total flight hours, total landings, and hours until next service)
// for a given resource. In production, replace this with a real API call or useCustom hook.
function ResourceAggregates({ resourceId }: { resourceId: number }) {
    const [aggregates, setAggregates] = React.useState({
      totalFlightHours: 0,
      totalLandings: 0,
      hoursUntilNextService: 0,
    });
  
    React.useEffect(() => {
        // Simulate fetching aggregated data
        // In a real scenario, use a custom hook or API call here.
        const totalFlightHours = 120; // Dummy value
        const totalLandings = 50;     // Dummy value
        const serviceInterval = 150;  // Assume a service is scheduled every 150 hours
        const hoursUntilNextService = serviceInterval - totalFlightHours;
        setAggregates({ totalFlightHours, totalLandings, hoursUntilNextService });
    }, [resourceId]);
  
    return (
        <Stack spacing={0.5}>
            <Typography variant="body2">Hours: {aggregates.totalFlightHours}</Typography>
            <Typography variant="body2">Landings: {aggregates.totalLandings}</Typography>
            <Typography variant="body2">
                Next Service In: {aggregates.hoursUntilNextService} hrs
            </Typography>
        </Stack>
    );
}

export default function EquipmentInfoList() {
    const {
        tableQueryResult,
        pageCount,
        current,
        setCurrent,
        pageSize,
        setPageSize,
    } = useTable<Resource>({
        resource: "resources",
        initialSorter: [{ field: "id", order: "asc" }],
        initialPageSize: 10,
    });
  
    const rows = tableQueryResult?.data?.data ?? [];
    const total = pageCount * pageSize;
  
    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", width: 200 },
        { field: "resource_type", headerName: "Type", width: 150 },
        { field: "status", headerName: "Status", width: 150 },
        {
            field: "aggregates",
            headerName: "Aggregates",
            width: 250,
            renderCell: (params) => <ResourceAggregates resourceId={params.row.id} />,
            sortable: false,
            filterable: false,
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
                    <EditButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="resources"
                        recordItemId={row.id}
                    />
                    <ShowButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="resources"
                        recordItemId={row.id}
                    />
                </Stack>
            ),
            sortable: false,
            filterable: false,
        },
    ];
  
    return (
        <List title="Equipment Information">
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
