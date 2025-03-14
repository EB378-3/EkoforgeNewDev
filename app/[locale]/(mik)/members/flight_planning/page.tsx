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
    international?: boolean;
    created_at: string;
    updated_at: string;
}

export default function FlightPlanList() {
    const {
        tableQueryResult,
        pageCount,
        current,
        setCurrent,
        pageSize,
        setPageSize,
    } = useTable<FlightPlan>({
        resource: "flightplans", // Ensure this matches your resource configuration
        initialSorter: [
            {
                field: "updated_at",
                order: "asc",
            },
        ],
        // Exclude rows where international is true.
        initialFilter: [
            {
                field: "international",
                operator: "ne",
                value: true,
            },
        ],
        initialPageSize: 10,
    });

    // If your data provider returns total count, use it; otherwise, fallback
    const total =
        tableQueryResult?.data?.total ??
        (pageCount ? pageCount * pageSize : 0);
    const rows = tableQueryResult?.data?.data ?? [];

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 150 },
        { field: "route", headerName: "Route", width: 250 },
        { field: "notes", headerName: "Notes", width: 200 },
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
                        recordItemId={row.id}
                    />
                    <ShowButton
                        hideText
                        size="small"
                        variant="outlined"
                        recordItemId={row.id}
                    />
                    <DeleteButton
                        hideText
                        size="small"
                        variant="outlined"
                        recordItemId={row.id}
                    />
                </Stack>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    return (
        <List title="Flightplans">
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
