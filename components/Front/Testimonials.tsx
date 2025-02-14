"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
  Grid,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Star as StarIcon,
  FormatQuote,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { getTheme } from "@theme/theme";
import { useColorMode } from "@contexts/color-mode";

// --- Types for Testimonials ---
type TestimonialType = "text" | "photo" | "video";

interface BaseTestimonial {
  id: number;
  name: string;
  feedback: string;
  rating: number;
  type: TestimonialType;
}

interface TextTestimonial extends BaseTestimonial {
  type: "text";
}

interface PhotoTestimonial extends BaseTestimonial {
  type: "photo";
  imageUrl: string;
}

interface VideoTestimonial extends BaseTestimonial {
  type: "video";
  videoUrl: string;
}

type Testimonial = TextTestimonial | PhotoTestimonial | VideoTestimonial;

// --- Sample testimonials data ---
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Emilia",
    feedback: "He communicated with everyone excellently and politely, on the other hand he was able to work very independently and had his own visions and ideas on how to do the work. He produced an amazing outreach video for our project.",
    rating: 5,
    type: "text",
  },
  {
    id: 2,
    name: "Kimmo",
    feedback: "The impact on our branding and visual image has been very positive. I would highly recommend these services for any company or NGO that wants to have reliable, fast paced and good quality visual updates for their social media and/or advertisement.",
    rating: 5,
    type: "photo",
    imageUrl: "/aircraft-hero-background.jpg",
  },
  {
    id: 3,
    name: "John Doe",
    feedback: "Watch how our website boosted our conversions!",
    rating: 4.5,
    type: "video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 4,
    name: "Emilia",
    feedback: "He communicated with everyone excellently and politely, on the other hand he was able to work very independently and had his own visions and ideas on how to do the work. He produced an amazing outreach video for our project.",
    rating: 5,
    type: "text",
  },
  {
    id: 5,
    name: "Kimmo",
    feedback: "The impact on our branding and visual image has been very positive. I would highly recommend these services for any company or NGO that wants to have reliable, fast paced and good quality visual updates for their social media and/or advertisement.",
    rating: 5,
    type: "photo",
    imageUrl: "/aircraft-hero-background.jpg",
  },
  {
    id: 6,
    name: "Doe John",
    feedback: "Watch how our website boosted our conversions!",
    rating: 4.5,
    type: "video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

// --- Animation Variants ---
const slideVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

interface CarouselProps {
  items: Testimonial[];
  TestimonialCardBG: string;
}

const TestimonialCarousel: React.FC<CarouselProps> = ({ items, TestimonialCardBG }) => {
  const t = useTranslations("Testimonials");
  const locale = useLocale();
  const { mode } = useColorMode();
  const theme = getTheme(mode);
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % items.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);

  if (items.length === 0) return null;

  const currentTestimonial = items[current];

  return (
    <Box sx={{ mb: 8 }}>
      <Container maxWidth="sm" sx={{ position: "relative" }}>
        <motion.div variants={slideVariants} initial="hidden" animate="visible">
          <Card
            sx={{
              bgcolor: TestimonialCardBG,
              p: 3,
              borderRadius: 3,
              boxShadow: 6,
              textAlign: "center",
              position: "relative",
            }}
          >
            {currentTestimonial.type === "text" && (
              <CardContent>
                <FormatQuote sx={{ fontSize: 40, color: "grey.300", mb: 2 }} />
                <Typography variant="body1" fontStyle="italic" sx={{ mb: 2 }}>
                  {currentTestimonial.feedback}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {currentTestimonial.name}
                </Typography>
              </CardContent>
            )}
            {currentTestimonial.type === "photo" && (
              <>
                <CardMedia
                  component="img"
                  image={(currentTestimonial as PhotoTestimonial).imageUrl}
                  alt={(currentTestimonial as PhotoTestimonial).name}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    border: `4px solid ${theme.palette.warning.main}`,
                    mx: "auto",
                    mb: 2,
                  }}
                />
                <CardContent>
                  <Typography variant="body1" fontStyle="italic" sx={{ mb: 2 }}>
                    {currentTestimonial.feedback}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {currentTestimonial.name}
                  </Typography>
                </CardContent>
              </>
            )}
            {currentTestimonial.type === "video" && (
              <>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "56.25%",
                    mb: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={(currentTestimonial as VideoTestimonial).videoUrl}
                    title={(currentTestimonial as VideoTestimonial).name}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                    allowFullScreen
                  />
                </Box>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {currentTestimonial.name}
                  </Typography>
                </CardContent>
              </>
            )}
            <Box mt={2}>
              <Rating
                name={`rating-${currentTestimonial.id}`}
                value={currentTestimonial.rating}
                precision={0.5}
                readOnly
                icon={<StarIcon fontSize="inherit" sx={{ color: theme.palette.warning.main }} />}
                emptyIcon={<StarIcon fontSize="inherit" sx={{ opacity: 0.3 }} />}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <IconButton
                onClick={prevSlide}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
                  color: "common.white",
                }}
                aria-label="Previous Slide"
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={nextSlide}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
                  color: "common.white",
                }}
                aria-label="Next Slide"
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default function Testimonials() {
  const t = useTranslations("Testimonials");
  const locale = useLocale();
  const { mode } = useColorMode();
  const theme = getTheme(mode);

  // Split testimonials by type.
  const textTestimonials = testimonials.filter((item) => item.type === "text");
  const photoTestimonials = testimonials.filter((item) => item.type === "photo");
  const videoTestimonials = testimonials.filter((item) => item.type === "video");

  return (
    <Box component="section" id="testimonials" sx={{ py: 10, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          textAlign="center"
          mb={6}
          fontWeight="bold"
          sx={{ color: theme.palette.text.primary }}
        >
          {t("title")}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <TestimonialCarousel items={photoTestimonials} TestimonialCardBG={theme.palette.primary.dark} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TestimonialCarousel items={textTestimonials} TestimonialCardBG={theme.palette.secondary.main} />
          </Grid>
          <Grid item xs={12} md={4}>
          <TestimonialCarousel items={photoTestimonials} TestimonialCardBG={theme.palette.primary.dark} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
