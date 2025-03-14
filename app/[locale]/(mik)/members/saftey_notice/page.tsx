"use client";

import React from "react";
import {
    List,
    EditButton,
    ShowButton,
    DeleteButton,
    } from "@refinedev/mui";
import { useOne, useTable } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack, Typography } from "@mui/material";

// Define the FlightPlan interface based on your table.
interface FlightPlan {
    id: string;
    profile_id: string;
    route: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

// Component to display a profile's full name based on profileId.
function ProfileName({ profileId }: { profileId: string }) {
    const { data } = useOne({
        resource: "profiles",
        id: profileId,
        meta: { select: "first_name,last_name" },
        queryOptions: { enabled: !!profileId },
    });
    const profileData = data?.data as
      | { first_name: string; last_name: string }
      | undefined;
    if (!profileData) return <Typography variant="caption">Loading...</Typography>;
    return (
        <Typography variant="caption">
            {profileData.first_name} {profileData.last_name}
        </Typography>
    );
}

export default function FlightPlansList() {
    const {
        tableQueryResult,
        pageCount,
        current,
        setCurrent,
        pageSize,
        setPageSize,
    } = useTable<FlightPlan>({
        resource: "flightplans",
        initialSorter: [{ field: "created_at", order: "desc" }],
        initialPageSize: 10,
    });

    const rows = tableQueryResult?.data?.data ?? [];
    const total = pageCount * pageSize;

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 250 },
        {
            field: "profile_id",
            headerName: "Created By",
            width: 150,
            renderCell: (params) => <ProfileName profileId={params.row.profile_id} />,
        },
        { field: "route", headerName: "Route", width: 200 },
        { field: "notes", headerName: "Notes", width: 300 },
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
                        resourceNameOrRouteName="flightplans"
                        recordItemId={row.id}
                    />
                    <ShowButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="flightplans"
                        recordItemId={row.id}
                    />
                    <DeleteButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="flightplans"
                        recordItemId={row.id}
                    />
                </Stack>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    return (
        <List title="Flight Plans">
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
