"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import NextLink from "next/link";
import NextImage from "next/image";
import { motion } from "framer-motion";

// MUI components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Hero = () => {
  const t = useTranslations("HomePage");
  const locale = useLocale();

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
        // Use minHeight instead of a fixed height
        minHeight: { xs: "25vh", sm: "25vh", md: "40vh" },
        // Remove overflow hidden so all content is visible
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
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
          // Note: to use theme values you might want to access the theme directly via useTheme,
          // here we are using a string literal for simplicity.
          backgroundColor: "black",
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

      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          // Remove the fixed height to allow container to grow with its content
          px: { xs: 0, sm: 2, md: 3, lg: 5 },
        }}
      >
        {/* Hero Text */}
        <Box
          sx={{
            zIndex: 10,
            maxWidth: { xs: "90%", md: "60%" },
            textAlign: "left",
            mt: { xs: 2, md: 0 },
          }}
        >
          <motion.div initial="hidden" whileInView="visible" variants={textSlideIn}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: { xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem" },
                lineHeight: 1.2,
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {t("Affordable Aircraft Rentals")}
            </Typography>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={textSlideIn}
            transition={{ delay: 0.3 }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#fff",
                mt: 2,
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              {t("Explore the beauty of Southern Finland from the skies")}
            </Typography>
          </motion.div>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
            // Let the CTA section grow naturally
            height: "auto",
            
          }}
        >
          {/* Mobile CTA: Thin Box */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
              background: (theme) =>
                `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              borderRadius: "12px",
              p: 1,
              mt: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <NextLink href={`/${locale}/book`} passHref>
              <Button
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                variant="contained"
                sx={{
                  px: 2,
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variant="outlined"
                sx={{
                  px: 2,
                  py: 1,
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  boxShadow: 3,
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
              width: "75%",
              height: "45vh", // Set a fixed height so the banner is visible
              background: (theme) =>
                `linear-gradient(to top, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
              transform: "skewX(-20deg)",
              overflow: "hidden", // Hide any overflow outside the container
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
                flexDirection: { xs: "column", xl: "row" },
                justifyContent: "center",
                alignItems: "center",
                gap: { xs: 1, md: 2, lg: 3 },
                zIndex: 1, // Ensure this content is visible
              }}
            >
              <NextLink href={`/${locale}/book`} passHref>
                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  variant="contained"
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: { xs: 1, md: 2 },
                    bgcolor: "secondary.main.dark",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: "50px",
                    boxShadow: 3,
                    border: "2px solid transparent",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Animated Border */}
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
                  whileHover={{ scale: 1.05 }}
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
  );
};

export default Hero;
