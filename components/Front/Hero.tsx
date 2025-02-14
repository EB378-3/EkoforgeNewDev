"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import NextLink from "next/link";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { useColorMode } from "@contexts/color-mode";

// MUI components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getTheme } from "@theme/theme";

const Hero = () => {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const { mode } = useColorMode();
  const theme = getTheme(mode);

  // Framer-motion animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const textSlideIn = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } },
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: {xs:"50vh", sm:"30vh", md:"75vh"}, // Fixed hero height
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <NextImage
          src="/aircraft-hero-background.jpg"
          alt="Hero Background"
          fill
          style={{
            objectFit: "cover",
            filter: "blur(4px) brightness(0.5)",
          }}
        />
      </motion.div>

      {/* Content Container */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          px: { md: 5 },
          height: "100%",
        }}
      >
        {/* Hero Text */}
        <Box
          sx={{
            maxWidth: { xs: "90%", md: "60%" },
            textAlign: "left",
            my: { xs: 4, md: 0 },
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textSlideIn}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem", lg: "4rem" },
                lineHeight: 1.2,
                textShadow: "0 2px 4px rgba(0,0,0,0.6)",
              }}
            >
              {t("HeroTitle")}
            </Typography>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textSlideIn}
            transition={{ delay: 0.3 }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#fff",
                mt: 2,
                fontSize: { xs: "1rem", md: "1.25rem" },
                textShadow: "0 1px 3px rgba(0,0,0,0.6)",
              }}
            >
              {t("HeroSubTitle")}
            </Typography>
          </motion.div>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            width: { xs: "100%", md: "30%" },
            height: {md: "100%"},
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Mobile CTA */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              p: 2,
              alignItems: "baseline",
              justifyContent: "space-around",
            }}
          >
            <NextLink href={`https://calendly.com/ekoforge`} passHref>
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                variant="contained"
                sx={{
                  px: 3,
                  py: 1,
                  bgcolor: "secondary.main",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  boxShadow: 3,
                }}
              >
                {t("CTA")}
              </Button>
            </NextLink>
            <NextLink href="#contact" passHref>
              <Button
                component={motion.button}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                variant="outlined"
                sx={{
                  px: 3,
                  py: 1,
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  boxShadow: 3,
                  borderColor: "#fff",
                }}
              >
                {t("Contact Us")}
              </Button>
            </NextLink>
          </Box>

          {/* Desktop CTA: Diagonal Banner */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: "100%",
              height: "100%", // Fill the CTA container's height (75vh)
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(to top, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
                transform: "skewX(-20deg)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transform: "skewX(20deg)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: { xs: 1, md: 2, lg: 3 },
                  zIndex: 1,
                }}
              >
                <NextLink href={`https://calendly.com/ekoforge`} passHref>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    variant="contained"
                    sx={{
                      px: { xs: 3, md: 4 },
                      py: { xs: 1, md: 2 },
                      bgcolor: "secondary.main",
                      color: "#fff",
                      fontWeight: "bold",
                      borderRadius: "50px",
                      boxShadow: 3,
                      border: "2px solid transparent",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50px",
                        border: "2px solid transparent",
                        transition: "border-color 0.3s",
                        "&:hover": { borderColor: "secondary.main" },
                      }}
                    />
                    {t("CTA")}
                  </Button>
                </NextLink>
                <NextLink href="#contact" passHref>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    variant="outlined"
                    sx={{
                      px: { xs: 3, md: 4 },
                      py: { xs: 1, md: 2 },
                      borderColor: "#fff",
                      color: "#fff",
                      fontWeight: "bold",
                      borderRadius: "50px",
                      boxShadow: 3,
                      zIndex: 2,
                    }}
                  >
                    {t("Contact Us")}
                  </Button>
                </NextLink>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
