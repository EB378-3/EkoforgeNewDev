"use client";

import React from "react";
import { Typography, Button, AppBar, Toolbar } from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getTheme } from "@theme/theme";
import { useColorMode } from "@contexts/color-mode";

const CrmNav = () => {
  const t = useTranslations("crm");
  const locale = useLocale();
  const { mode, setMode } = useColorMode();
  const theme = getTheme(mode);

  return (
    <>
    {/* AppBar Navigation */}
    <AppBar position="static">
        <Toolbar sx={{ backgroundColor: theme.palette.strong.default }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                My CRM
            </Typography>
            <Link href={`/${locale}/crm/`} passHref>
            <Button color="secondary">Dashboard</Button>
            </Link>
            <Link href={`/${locale}/crm/contacts`}  passHref>
            <Button color="secondary">Contacts</Button>
            </Link>
            <Link href={`/${locale}/crm/deals`} passHref>
            <Button color="secondary">Deals</Button>
            </Link>
            <Link href={`/${locale}/crm/activities`} passHref>
            <Button color="secondary">Activities</Button>
            </Link>
            <Link href={`/${locale}/crm/reports`} passHref>
            <Button color="secondary">Reports</Button>
            </Link>
        </Toolbar>
  </AppBar>  
    </>
  );
};

export default CrmNav;
