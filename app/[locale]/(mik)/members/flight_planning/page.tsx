"use client";

import React from "react";
import {
    List,
    EditButton,
    ShowButton,
    DeleteButton,
} from "@refinedev/mui";
import { useTable } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack } from "@mui/material";

interface FlightPlan {
    id: string;
    profile_id: string;
    route: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}


export default function LogbookList() {
    const {
        tableQueryResult,
        pageCount,
        current,
        setCurrent,
        pageSize,
        setPageSize,
    } = useTable<FlightPlan>({
        resource: "flightplans", // This must match your resource configuration
        initialSorter: [
            {
                field: "id",
                order: "asc",
            },
        ],
        initialPageSize: 10,
    });

    const rows = tableQueryResult?.data?.data ?? [];
    const total = pageCount * pageSize;

    const columns: GridColDef[] = [
        { field: "flight_date", headerName: "Flight Date", width: 150 },
        { field: "route", headerName: "Route", width: 150 },
        { field: "notes", headerName: "Notes", width: 150 },
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
                    <EditButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="logbook"
                        recordItemId={row.id}
                    />
                    <ShowButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="logbook"
                        recordItemId={row.id}
                    />
                    <DeleteButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="logbook"
                        recordItemId={row.id}
                    />
                </Stack>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    return (
        <List title="FlightPlans">
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
