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
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Link as MuiLink,
    Stack,
    CircularProgress,
    Alert,
} from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useColorMode } from "@contexts/color-mode";
import { getTheme } from "@theme/theme";

interface FlightPlan {
    id: string;
    profile_id: string;
    route: string;
    notes?: string;
    international?: boolean;
    created_at: string;
    updated_at: string;
}

interface DashboardCardProps {
    title: string;
    description: string;
    link: string;
    buttonText: string;
    external?: boolean;
    theme: ReturnType<typeof getTheme>;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    description,
    link,
    buttonText,
    external = false,
    theme,
}) => {
    return (
        <Paper
            sx={{
                p: 1.5,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: 1,
                margin: "0 auto",
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {title}
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: theme.palette.text.secondary }}>
                {description}
            </Typography>
                <Button
                    variant="contained"
                    component={Link}
                    href={link}
                    size="small"
                    sx={{
                        mt: 1,
                        textTransform: "none",
                        fontSize: "0.875rem",
                    }}
                >
                    {buttonText}
                </Button>
        </Paper>

    );
};

export default function FlightPlanList() {
    const t = useTranslations("FlightPlanList");
    const { mode } = useColorMode();
    const theme = getTheme(mode);

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

    // Handle loading and error states
    if (tableQueryResult.isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (tableQueryResult.isError) {
        return (
            <Box sx={{ mt: 4 }}>
                <Alert severity="error">
                    {t("error.fetchFlightPlans")}
                </Alert>
            </Box>
        );
    }

    const total =
        tableQueryResult?.data?.total ??
        (pageCount ? pageCount * pageSize : 0);
    const rows = tableQueryResult?.data?.data ?? [];

    const columns: GridColDef[] = [
        { field: "route", headerName: t("dataGrid.route"), width: 250 },
        { field: "notes", headerName: t("dataGrid.notes"), width: 200 },
        {
            field: "actions",
            headerName: t("dataGrid.actions"),
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
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                {t("flightPlanning")}
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                    <DashboardCard
                        title={t("aircraftReservation.title")}
                        description={t("aircraftReservation.description")}
                        link="/members/bookings"
                        buttonText={t("aircraftReservation.buttonText")}
                        theme={theme}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <DashboardCard
                        title={t("aviationWeather.title")}
                        description={t("aviationWeather.description")}
                        link="https://ilmailusaa.fi"
                        buttonText={t("aviationWeather.buttonText")}
                        external
                        theme={theme}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <DashboardCard
                        title={t("flightLogbook.title")}
                        description={t("flightLogbook.description")}
                        link="/members/logbook"
                        buttonText={t("flightLogbook.buttonText")}
                        theme={theme}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <DashboardCard
                        title={t("maintenance.title")}
                        description={t("maintenance.description")}
                        link="/members/equipment_info"
                        buttonText={t("maintenance.buttonText")}
                        theme={theme}
                    />
                </Grid>
                <Grid item xs={12}>
                    <DashboardCard
                        title={t("flightPlan.title")}
                        description={t("flightPlan.description")}
                        link="https://www.ais.fi"
                        buttonText={t("flightPlan.buttonText")}
                        external
                        theme={theme}
                    />
                </Grid>
            </Grid>
            <List title={t("flightPlans")}>
                <DataGrid
                    autoHeight
                    rows={rows}
                    columns={columns}
                    rowCount={total}
                    pageSizeOptions={[5, 10, 20, 30, 50, 100]}
                    pagination
                    paginationModel={{ page: current - 1, pageSize }}
                    onPaginationModelChange={(model) => {
                        setCurrent(model.page + 1);
                        setPageSize(model.pageSize);
                    }}
                    sx={{
                        border: "none",
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                    }}
                />
            </List>
            <Box sx={{ mt: 3 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h5">
                        {t("GeneralResources")}
                    </Typography>
                    <hr/>
                    <Typography variant="subtitle1">
                        {t("GeneralResourcesDescription")}
                    </Typography>
                    <ul>
                        <li>
                            <MuiLink href="https://www.ais.fi" target="_blank">
                                {t("ais")}
                            </MuiLink>
                        </li>
                        <li>
                            <MuiLink href="https://ilmailusaa.fi" target="_blank">
                                {t("ilmailusaa")}
                            </MuiLink>
                        </li>
                        <li>
                            <MuiLink href="https://flyk.com" target="_blank">
                                {t("FLYK")}
                            </MuiLink>
                        </li>
                        <li>
                            <MuiLink href="https://lentopaikat.fi" target="_blank">
                                {t("lentopaikat")}
                            </MuiLink>
                        </li>
                    </ul>

                    <Typography variant="subtitle1">
                        {t("GeneralResourcesDescriptionTwo")}
                    </Typography>
                    <ul>
                        <li>
                            <Typography variant="body2">
                                {t("GeneralResourcesDescriptionTwoText")}
                            </Typography>
                            <MuiLink href="/members/instructions">
                                {t("instructions")}
                            </MuiLink>
                        </li>
                    </ul>
                    <Typography variant="subtitle1">
                        {t("GeneralResourcesDescriptionThree")}
                    </Typography>
                    <Typography variant="body2">
                        {t("GeneralResourcesDescriptionThreeText")}
                    </Typography>
                    <ul>
                        <li>
                            <MuiLink href="https://groups.google.com/a/mik.fi/forum/#!forum/ihq-info" target="_blank">
                                {t("ihqInfo")}
                            </MuiLink>
                        </li>
                        <li>
                            <MuiLink href="https://groups.google.com/a/mik.fi/forum/#!forum/stl-info" target="_blank">
                                {t("stlInfo")}
                            </MuiLink>
                        </li>
                    </ul>
                    <Typography variant="subtitle1">
                        {t("GeneralResourcesDescriptionFour")}
                    </Typography>
                    <Typography variant="body2">
                        {t("GeneralResourcesDescriptionFourText")}
                    </Typography>
                    <ul>
                        <li>
                            <MuiLink href="/members/international_flight_planning">
                                {t("internationalFlightPlanning")}
                            </MuiLink>
                        </li>
                    </ul>
                </Paper>
            </Box>
        </Box>
    );
}
