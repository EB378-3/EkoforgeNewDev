"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { getTheme } from "@theme/theme";
import { useColorMode } from "@contexts/color-mode";

const MyTemplateComponent: React.FC = () => {
  const t = useTranslations("Common");
  const locale = useLocale();
  const { mode, setMode } = useColorMode();
  const theme = getTheme(mode);

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
