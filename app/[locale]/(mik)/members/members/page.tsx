"use client";

import React from "react";
import { List, EditButton, ShowButton, DeleteButton } from "@refinedev/mui";
import { useTable } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Avatar} from "@mui/material";

interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

export default function MembersList() {
    const {
        tableQueryResult,
        pageCount,
        current,
        setCurrent,
        pageSize,
        setPageSize,
    } = useTable<Profile>({
        resource: "profiles",
        initialSorter: [
            {
                field: "first_name",
                order: "asc",
            },
        ],
        initialPageSize: 10,
    });

    const rows = tableQueryResult?.data?.data ?? [];
    const total = pageCount * pageSize;

    const columns: GridColDef[] = [
        {
            field: "avatar_url",
            headerName: "Avatar",
            width: 75,
            renderCell: ({row}) => (
                <Avatar sx={{ margin: "auto" }} src={row.avatar_url} alt={row.first_name} />
            ),
        },
        {
            field: "first_name last_name",
            headerName: "Name",
            width: 150,
            renderCell: ({ row }) => (
              <span>{row.first_name} {row.last_name}</span>
      ),
        },
        {
            field: "email",
            headerName: "Email",
            width: 200,
        },
        {
            field: "phone_number",
            headerName: "Phone Number",
            width: 150,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 75,
            renderCell: ({ row }) => (
                    <ShowButton
                        hideText
                        size="small"
                        variant="outlined"
                        resourceNameOrRouteName="profiles"
                        recordItemId={row.id}
                    />
            ),
            sortable: false,
            filterable: false,
        },
    ];

    return (
        <List title="Members">
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
