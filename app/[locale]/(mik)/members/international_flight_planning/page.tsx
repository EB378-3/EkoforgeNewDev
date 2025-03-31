"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Link as MuiLink,
  Grid,
} from "@mui/material";
import { List, EditButton, ShowButton, DeleteButton } from "@refinedev/mui";
import { useTable } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { useColorMode } from "@contexts/color-mode";
import { getTheme } from "@theme/theme";
import Image from "next/image";

interface SectionProps {
  title: string;
  content: string;
  linkText?: string;
  linkUrl?: string;
}

const Section: React.FC<SectionProps> = ({ title, content, linkText, linkUrl }) => {
  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        mb: 3,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
        {content}
      </Typography>
      {linkText && linkUrl && (
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <MuiLink
            href={linkUrl}
            target="_blank"
            underline="hover"
            sx={{ fontWeight: 500 }}
          >
            {linkText}
          </MuiLink>
        </Box>
      )}
    </Paper>
  );
};

export default function InternationalFlightPlanningPage() {
  const t = useTranslations("InternationalFlightPlanning");
  const { mode } = useColorMode();
  const theme = getTheme(mode);

  // Table hook for international flight plans (filtering where international equals true)
  const {
    tableQueryResult: tableQueryResultIntl,
    pageCount: pageCountIntl,
    current: currentIntl,
    setCurrent: setCurrentIntl,
    pageSize: pageSizeIntl,
    setPageSize: setPageSizeIntl,
  } = useTable({
    resource: "flightplans",
    initialSorter: [
      {
        field: "updated_at",
        order: "asc",
      },
    ],
    initialFilter: [
      {
        field: "international",
        operator: "eq",
        value: true,
      },
    ],
    initialPageSize: 10,
  });

  const totalIntl =
    tableQueryResultIntl?.data?.total ??
    (pageCountIntl ? pageCountIntl * pageSizeIntl : 0);
  const rowsIntl = tableQueryResultIntl?.data?.data ?? [];

  const columns: GridColDef[] = [
    { field: "route", headerName: t("dataGrid.route"), width: 250 },
    { field: "notes", headerName: t("dataGrid.notes"), width: 200 },
    {
      field: "actions",
      headerName: t("dataGrid.actions"),
      width: 200,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
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
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: { xs: "100%", md: "100%" }, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>

      {/* Section 1: No link */}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
            {t("section1.title")}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {t("section1.content")}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Image
              src="/europe-ranget.jpg"
              alt={t("section1.title")}
              width={200}
              height={300}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* International Flight Plans Table */}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          my: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h5" gutterBottom>
          {t("internationalFlightPlans")}
        </Typography>
        {tableQueryResultIntl.isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : tableQueryResultIntl.isError ? (
          <Alert severity="error">
            {t("error.fetchInternationalFlightPlans")}
          </Alert>
        ) : (
          <List title={t("internationalFlightPlans")}>
            <DataGrid
              autoHeight
              rows={rowsIntl}
              columns={columns}
              rowCount={totalIntl}
              pageSizeOptions={[5, 10, 20, 30, 50, 100]}
              pagination
              paginationModel={{ page: currentIntl - 1, pageSize: pageSizeIntl }}
              onPaginationModelChange={(model) => {
                setCurrentIntl(model.page + 1);
                setPageSizeIntl(model.pageSize);
              }}
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
              }}
            />
          </List>
        )}
      </Paper>

      {/* Section 2 */}
      <Section
        title={t("section2.title")}
        content={t("section2.content")}
        linkText={t("section2.linkText")}
        linkUrl={t("section2.linkUrl")}
      />

      {/* Section 3 */}
      <Section
        title={t("section3.title")}
        content={t("section3.content")}
        linkText={t("section3.linkText")}
        linkUrl={t("section3.linkUrl")}
      />

      {/* Section 4 */}
      <Section
        title={t("section4.title")}
        content={t("section4.content")}
        linkText={t("section4.linkText")}
        linkUrl={t("section4.linkUrl")}
      />

      {/* Section 5 */}
      <Section
        title={t("section5.title")}
        content={t("section5.content")}
        linkText={t("section5.linkText")}
        linkUrl={t("section5.linkUrl")}
      />

      {/* Section 6 */}
      <Section
        title={t("section6.title")}
        content={t("section6.content")}
        linkText={t("section6.linkText")}
        linkUrl={t("section6.linkUrl")}
      />

      {/* Section 7 */}
      <Section
        title={t("section7.title")}
        content={t("section7.content")}
        linkText={t("section7.linkText")}
        linkUrl={t("section7.linkUrl")}
      />

      {/* Section 8 */}
      <Section
        title={t("section8.title")}
        content={t("section8.content")}
        linkText={t("section8.linkText")}
        linkUrl={t("section8.linkUrl")}
      />
    </Box>
  );
}
