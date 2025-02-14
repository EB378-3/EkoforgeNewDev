"use client";

import React, { useContext } from "react";
import { useTranslations, useLocale } from "next-intl";
import NextLink from "next/link";
import NextImage from "next/image";

// MUI imports
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import { IconButton } from "@node_modules/@mui/material";
import { ColorModeContext } from "@contexts/color-mode";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";

const Footer = () => {
  const t = useTranslations("Footer");
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const locale = useLocale();
  const { mode, setMode } = useContext(ColorModeContext);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.common.white,
        width: "100%",
      }}
    >
      {/* Divider */}
      <Box sx={{ borderBottom: `1px solid ${theme.palette.grey[700]}`}} />

      <Container sx={{ py: 5, px: { xs: 2, lg: 3 } }}>
        <Grid container spacing={4} textAlign={{ xs: "center", md: "left" }}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Link component={NextLink} href={`/${locale}/`} underline="none">
                <NextImage
                  src="/Logo.png" // Replace with your aircraft rental logo
                  alt="Logo"
                  width={250}
                  height={50}
                  style={{ display: "block", }}
                />
              </Link>
            </Box>
            <Typography variant="body2" sx={{ color: theme.palette.info.contrastText }}>
              {t("aboutText")}
            </Typography>
          </Grid>

          {/* Navigation Section */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: theme.palette.success.contrastText }}>
              {t("navigation")}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href={`https://calendly.com/ekoforge`}
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("navLink1")}
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href={`/${locale}/#testimonials`}
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("navLink2")}
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href={`/${locale}/#contact`}
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("navLink3")}
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href={`/${locale}/web`}
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("navLink4")}
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: theme.palette.success.contrastText }}>
              {t("socialmedia")}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href="https://www.instagram.com/eko._forge/"
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("instagram")}
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href="https://www.facebook.com/eko._forge"
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("facebook")}
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href="https://www.linkedin.com/company/ekoforge"
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("linkedin")}
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Company Section */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: theme.palette.success.contrastText }}>
              {t("company")}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href={`/${locale}/about`}
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("about")}
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href={`/${locale}/profile`}
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("login")}
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Legal Section */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: theme.palette.success.contrastText }}>
              {t("legal")}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href={`/${locale}/terms`}
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("terms")}
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href={`/${locale}/privacy`}
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("privacy")}
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={NextLink}
                  href={`/${locale}/license`}
                  underline="hover"
                  sx={{ color: theme.palette.info.contrastText }}
                >
                  {t("license")}
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box
          sx={{
            mt: 4,
            borderTop: `1px solid ${theme.palette.grey[700]}`,
            pt: 3,
            textAlign: "center",
            fontSize: "0.875rem",
            color: theme.palette.info.contrastText,
          }}
        >
          © {currentYear} Wing Aviators {t("rights")}
          <Box component="span" sx={{ ml: 2 }}>
            <IconButton
              color="inherit"
              onClick={() => {
                setMode();
              }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
