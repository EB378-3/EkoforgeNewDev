"use client";

import React, { useState, useContext } from "react";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import { ColorModeContext } from "@contexts/color-mode";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";

// MUI components
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// MUI icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

// refine navigation hook
import { useNavigation } from "@refinedev/core";
import { usePathname, useRouter } from "next/navigation";

interface NavbarProps extends RefineThemedLayoutV2HeaderProps {
  children?: React.ReactNode;
  locale?: string;
}

const Navbar: React.FC<NavbarProps> = ({ locale }) => {
  const t = useTranslations("NavbarLinks");
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const { push } = useNavigation();
  const { mode, setMode } = useContext(ColorModeContext);

  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = pathname.split("/")[1] || locale || "en";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLocale = event.target.value;
    if (newLocale === currentLocale) return;
    const path = pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}/${path}`);
  };

  // Navigation links for desktop and mobile menus
  const navLinks = [
    { label: t("recource-selction"), href: `/${currentLocale}/#recource-selction` },
    { label: t("contact"), href: `/${currentLocale}/#contact` },
    { label: t("bookDiscoveryFlight"), href: `/${currentLocale}/book` },
    { label: t("members"), href: `/${currentLocale}/profile` },
  ];

  return (
    <Box
      component="nav"
      sx={{
        width: "100%",
        background: `linear-gradient(360deg, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
        color: theme.palette.primary.contrastText,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          maxWidth: 1200,
          mx: "auto",
          px: 1,
          py: 0.5,
        }}
      >
        {/* Logo: Clickable area that navigates to home */}
        <Box
          sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={() => push(`/${currentLocale}/`)}
        >
          <NextImage
            src="/Logo.png" // Replace with your logo path
            width={50}
            height={17} // Adjust height to maintain proportions
            alt="Southern Finland Aircraft Rentals"
          />
        </Box>

        {/* Desktop: Navigation links, dark mode toggle, and language selector */}
        {isLargeScreen ? (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            {navLinks.map((link) => (
              <Button
                key={link.href}
                onClick={() => push(link.href)}
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  color: theme.palette.primary.contrastText,
                  padding: theme.spacing(0.5, 1),
                  transition: "transform 0.3s, background 0.3s",
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.light})`,
                    transform: "scale(1.05)",
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
            <IconButton
              color="inherit"
              onClick={() => setMode()}
              sx={{
                ml: 0.5,
                p: 0.5,
                border: `1px solid ${theme.palette.primary.contrastText}`,
              }}
            >
              {mode === "dark" ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
            </IconButton>
            <Select
              value={currentLocale}
              onChange={handleLanguageChange}
              sx={{
                borderRadius: 1,
                fontSize: "0.875rem",
                px: 0.75,
                py: 0.25,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                border: `1px solid ${theme.palette.secondary.main}`,
                ".MuiSelect-icon": { color: theme.palette.primary.contrastText, fontSize: "1rem" },
                "&:hover": {
                  borderColor: theme.palette.secondary.light,
                },
              }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="fi">FI</MenuItem>
            </Select>
          </Box>
        ) : (
          // Mobile: Dark mode toggle and menu toggle
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => setMode()}
              sx={{
                p: 0.5,
                border: `1px solid ${theme.palette.primary.contrastText}`,
              }}
            >
              {mode === "dark" ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              sx={{ p: 0.5 }}
            >
              {isMobileMenuOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
            </IconButton>
          </Box>
        )}
      </Toolbar>

      {/* Mobile Menu */}
      {!isLargeScreen && isMobileMenuOpen && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            background: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
            px: 1,
            py: 1,
            gap: 1,
          }}
        >
          {navLinks.map((link) => (
            <Button
              key={link.href}
              fullWidth
              onClick={() => {
                push(link.href);
                setIsMobileMenuOpen(false);
              }}
              sx={{
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "0.875rem",
                color: theme.palette.common.white,
                padding: theme.spacing(0.5, 1),
                transition: "transform 0.3s, background 0.3s",
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
                  transform: "scale(1.05)",
                },
              }}
            >
              {link.label}
            </Button>
          ))}
          <Select
            value={currentLocale}
            onChange={handleLanguageChange}
            fullWidth
            sx={{
              borderRadius: 1,
              fontSize: "0.875rem",
              px: 0.75,
              py: 0.25,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              border: `1px solid ${theme.palette.secondary.main}`,
              ".MuiSelect-icon": { color: theme.palette.primary.contrastText, fontSize: "1rem" },
              "&:hover": {
                borderColor: theme.palette.secondary.light,
              },
            }}
          >
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="fi">FI</MenuItem>
          </Select>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
