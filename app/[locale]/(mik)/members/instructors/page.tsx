"use client";

import React from "react";
import { List, EditButton, ShowButton, DeleteButton } from "@refinedev/mui";
import { useTable, useShow } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Stack, Typography, Button } from "@mui/material";
import Link from "next/link";

// Define the Instructor interface based on your instructors table
interface Instructor {
    id: number;
    profile_id: string;
    rating_level?: string;
    availability?: string;
    created_at: string;
    updated_at: string;
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

export default function InstructorsList() {
    const {
        tableQueryResult,
        pageCount,
        current,
        setCurrent,
        pageSize,
        setPageSize,
    } = useTable<Instructor>({
        resource: "instructors", // Must match your instructors resource
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
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "profile_name",
            headerName: "Instructor",
            width: 150,
            renderCell: (params) => <ProfileName profileId={params.row.profile_id} />,
        },
        { field: "rating_level", headerName: "Rating Level", width: 150 },
        { field: "availability", headerName: "Availability", width: 200 },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: ({ row }) => (
                <Stack direction="row" spacing={1}>
                    <ShowButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="instructors"
                        recordItemId={row.id}
                    />
                </Stack>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    return (
        <List title="Instructors">
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
