"use client";

import React, { Suspense } from "react";
import Navbar from "@components/Front/Navbar";
import Footer from "@components/Front/Footer";
import Hero from "@components/Front/Hero";
import Contact from "@components/Front/Contact";
import Testimonials from "@components/Front/Testimonials";
import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
import { motion } from "framer-motion";

// MUI components
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getTheme } from "@theme/theme";
import { useColorMode } from "@contexts/color-mode";

export default function IndexPage() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const { mode } = useColorMode();
  const theme = getTheme(mode);

  // Animation variants.
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } },
  };

  // Data for the information cards.
  const cardsData = [
    {
      title: t("Flexible Booking"),
      detail: t("Choose rental times that fit your schedule"),
      gradient: `linear-gradient(to top, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
    },
    {
      title: t("Cost-Effective Pricing"),
      detail: `${t("twoOne")}\n${t("twoTwo")}\n${t("twoThree")}\n${t("twoFour")}`,
      gradient: `linear-gradient(to top, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
    },
    {
      title: t("Beautiful Destinations"),
      detail: t("Fly to stunning locations around Southern Finland"),
      gradient: `linear-gradient(to top, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          color: theme.palette.text.primary,
          overflow: "hidden",
        }}
      >
        <Box
          component="main"
          sx={{
            width: "100%",
            backgroundColor: theme.palette.background.default,
            position: "relative",
          }}
        >
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Hero />
          </motion.div>

          {/* Problem-Solution Section */}
          <Container sx={{ mt: 8, textAlign: "center", px: { xs: 2, sm: 3, lg: 6 } }}>
            <motion.div initial="hidden" whileInView="visible" variants={slideInRight}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 6 }}>
                {t("disrupt")}
                <Box
                  component="span"
                  sx={{
                    backgroundColor: theme.palette.secondary.dark,
                    px: 2,
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: "0 2px 4px rgba(255,255,255,0.5)",
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {t("loosing clients")}
                </Box>
              </Typography>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible">
              <Grid container spacing={4} justifyContent="center">
                {cardsData.map((item, index) => (
                  <Grid item key={index} xs={12} md={4}>
                    <motion.div
                      variants={fadeInUp}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
                      }}
                      style={{
                        background: item.gradient,
                        padding: theme.spacing(2),
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[4],
                        maxWidth: 320,
                        margin: "0 auto",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          color: theme.palette.secondary.contrastText,
                          fontWeight: "bold",
                          mb: 1,
                          fontSize: "1rem",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.grey[100],
                          fontSize: "0.875rem",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {item.detail}
                      </Typography>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>

          {/* Call-to-Action Section */}
          <motion.div initial="hidden" whileInView="visible" variants={slideInRight}>
            <Container sx={{ my: 8, textAlign: "center", px: { xs: 2, sm: 3, lg: 6 } }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  mb: 1,
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                }}
              >
                {t("Start Your Adventure Today")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem" },
                }}
              >
                {t("Discover the freedom of flight")}
              </Typography>
              <NextLink href={`/${locale}/book`} passHref>
                <motion.div whileHover={{ scale: 1.15 }}>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      px: 4,
                      py: 2,
                      background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      color: theme.palette.common.white,
                      fontWeight: "bold",
                      borderRadius: 50,
                      boxShadow: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    {t("Book Now")}
                  </Button>
                </motion.div>
              </NextLink>
            </Container>
          </motion.div>


          {/* Testimonials Section */}
          <motion.div initial="hidden" whileInView="visible" variants={fadeInUp}>
            <Testimonials />
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Contact />
          </motion.div>
        </Box>
      </Box>
      <Footer />
    </Suspense>
  );
}
