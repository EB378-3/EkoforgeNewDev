"use client";

import React, { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

// MUI Icons
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";

// Motion-enabled components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const Contact = () => {
  const t = useTranslations("Contact");
  const theme = useTheme();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "f1363286-3773-4366-a303-f62f033511e6",
          name: formData.get("name"),
          email: formData.get("email"),
          reason: formData.get("reason"),
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Thank you for your submission!");
        form.reset();
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <MotionBox
      id="contact"
      sx={{
        position: "relative",
        py: 12,
        px: 4,
        background: `linear-gradient(to bottom, ${theme.palette.background.default}, ${theme.palette.primary.dark})`,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Contact Form */}
          <Grid item xs={12} lg={6}>
            <MotionBox
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              sx={{
                backgroundColor: alpha(theme.palette.common.white, 0.85),
                borderRadius: 2,
                boxShadow: theme.shadows[3],
                p: 3,
              }}
            >
              <MotionTypography
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                variant="h5"
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.grey[800],
                  mb: 2,
                  fontSize: "1.25rem",
                }}
              >
                {t("title")}
              </MotionTypography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <MotionBox
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    name="name"
                    label={t("name")}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: theme.palette.grey[700] },
                        "&:hover fieldset": { borderColor: theme.palette.primary.dark },
                        "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                        color: theme.palette.secondary.contrastText,
                      },
                      "& .MuiInputLabel-root": {
                        color: theme.palette.secondary.contrastText,
                        fontSize: "0.875rem",
                      },
                      fontSize: "0.875rem",
                    }}
                  />
                </MotionBox>
                <MotionBox
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    name="email"
                    label={t("emailentry")}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: theme.palette.grey[700] },
                        "&:hover fieldset": { borderColor: theme.palette.primary.dark },
                        "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                        color: theme.palette.secondary.contrastText,
                      },
                      "& .MuiInputLabel-root": {
                        color: theme.palette.secondary.contrastText,
                        fontSize: "0.875rem",
                      },
                      fontSize: "0.875rem",
                    }}
                  />
                </MotionBox>
                <MotionBox
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="reason"
                    label={t("reason")}
                    required
                    multiline
                    rows={4}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: theme.palette.grey[700] },
                        "&:hover fieldset": { borderColor: theme.palette.primary.dark },
                        "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                        color: theme.palette.secondary.contrastText,
                      },
                      "& .MuiInputLabel-root": {
                        color: theme.palette.secondary.contrastText,
                        fontSize: "0.875rem",
                      },
                      fontSize: "0.875rem",
                    }}
                  />
                </MotionBox>
                <MotionBox
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      py: 1,
                      background: `linear-gradient(to right, ${theme.palette.error.main}, ${theme.palette.error.light})`,
                      color: theme.palette.common.white,
                      fontWeight: "bold",
                      borderRadius: 2,
                      boxShadow: theme.shadows[3],
                      textTransform: "none",
                      fontSize: "0.875rem",
                      transition: "all 0.3s",
                      "&:hover": {
                        opacity: 0.9,
                        background: `linear-gradient(to right, ${theme.palette.error.main}, ${theme.palette.error.light})`,
                      },
                    }}
                  >
                    {t("send")}
                  </Button>
                </MotionBox>
              </Box>
            </MotionBox>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} lg={6}>
            <MotionBox
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              sx={{
                textAlign: { xs: "center", lg: "left" },
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.warning.contrastText,
                  fontSize: "1rem",
                }}
              >
                {t("contact information")}
              </Typography>
              <MotionBox
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", lg: "flex-start" },
                    gap: 1,
                  }}
                >
                  <PhoneIcon sx={{ color: theme.palette.warning.main, fontSize: 24 }} />
                  <Link
                    href="tel:+358442413840"
                    underline="none"
                    sx={{
                      fontSize: "0.875rem",
                      color: theme.palette.text.primary,
                      "&:hover": { color: theme.palette.warning.light },
                    }}
                  >
                    +358 44 241 3840
                  </Link>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", lg: "flex-start" },
                    gap: 1,
                  }}
                >
                  <EmailIcon sx={{ color: theme.palette.warning.main, fontSize: 24 }} />
                  <Link
                    href="mailto:Air.rentals@gmail.com"
                    underline="none"
                    sx={{
                      fontSize: "0.875rem",
                      color: theme.palette.text.primary,
                      "&:hover": { color: theme.palette.warning.light },
                    }}
                  >
                    ekoforge@gmail.com
                  </Link>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", lg: "flex-start" },
                    gap: 1,
                  }}
                >
                  <BusinessIcon sx={{ color: theme.palette.warning.main, fontSize: 24 }} />
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", color: theme.palette.text.primary }}
                  >
                    EkoForge 
                  </Typography>
                </Box>
              </MotionBox>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </MotionBox>
  );
};

export default Contact;
