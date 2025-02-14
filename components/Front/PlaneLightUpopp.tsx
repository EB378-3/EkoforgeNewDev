"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import FlightIcon from "@mui/icons-material/Flight";

export default function PlaneScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const theme = useTheme();

  // Map scroll progress (0 to 1) to a width (0% to 100%)
  const progressWidth = useTransform(scrollYProgress, [1, 0], ["0%", "200%"]);

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        width: "100vw", // spans full viewport width
        height: 4, // progress bar height
        backgroundColor: theme.palette.grey[300],
        zIndex: 1000,
        pointerEvents: "none", // so it doesn't block interactions
      }}
    >
      {/* Animated progress bar */}
      <motion.div
        style={{
          width: progressWidth,
          height: "100%",
          backgroundColor: theme.palette.primary.main,
        }}
      />
      {/* Plane icon that follows the progress */}
      <motion.div
        style={{
          position: "relative",
          top: -17, // adjust vertical positioning of the plane
          left: progressWidth, // plane moves with progress
          translateX: "-1%", // center the plane over the progress edge
        }}
      >
        <FlightIcon sx={{ fontSize: 32, transform: "rotate(90deg)", color: theme.palette.primary.main }} />
      </motion.div>
    </Box>
  );
}
