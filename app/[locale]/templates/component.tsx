"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "@contexts/color-mode";
import { Box, Typography, Button } from "@mui/material";

const MyTemplateComponent: React.FC = () => {
  const t = useTranslations("Common");
  const locale = useLocale();
  const theme = useTheme();
  const { mode, setMode } = useColorMode();

  return (
    <Box sx={{ p: 2, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h5">
        {t("hello")} - Locale: {locale} - Mode: {mode}
      </Typography>
      <Button onClick={setMode} variant="contained" sx={{ mt: 2 }}>
        {t("toggleTheme")}
      </Button>
    </Box>
  );
};

export default MyTemplateComponent;
