"use client";

import React from "react";
import {
    List,
    EditButton,
    ShowButton,
    DeleteButton,
} from "@refinedev/mui";
import { useShow, useTable } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Stack, Typography } from "@mui/material";

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

// Helper component to display extra parameters in a readable format.
function ExtraParametersDisplay({ value }: { value: any }) {
    if (!value || (typeof value === "object" && Object.keys(value).length === 0)) {
        return <Typography variant="body2" color="text.secondary">None</Typography>;
    }

    if (typeof value === "object") {
        return (
            <Box>
                {Object.entries(value).map(([key, val]) => (
                    <Typography variant="body2" color="text.secondary" key={key}>
                        <strong>{key}:</strong> {typeof val === "object" ? JSON.stringify(val) : String(val)}
                    </Typography>
                ))}
            </Box>
        );
    }
    return <Typography variant="body2" color="text.secondary">{String(value)}</Typography>;
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
    if (!profileData) return <Typography variant="caption">Loading...</Typography>;
    return (
        <Typography variant="caption">
            {profileData.first_name} {profileData.last_name}
        </Typography>
    );
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
        resource: "notices", // This must match your resource configuration
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
        { field: "id", headerName: "ID", width: 25 },
        { field: "title", headerName: "Title", width: 120 },
        { field: "message", headerName: "Message", width: 200 },
        {
            field: "extra_parameters",
            headerName: "Extra Parameters",
            width: 200,
            renderCell: ({ value }) => <ExtraParametersDisplay value={value} />,
        },
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
                    <EditButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="notices"
                        recordItemId={row.id}
                    />
                    <ShowButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="notices"
                        recordItemId={row.id}
                    />
                    <DeleteButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="notices"
                        recordItemId={row.id}
                    />
                </Stack>
            ),
            sortable: false,
            filterable: false,
        },
    ];

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
