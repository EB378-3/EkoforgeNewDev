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
  Button,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Star as StarIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

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
    name: "Alice Johnson",
    feedback: "This service transformed my business—highly recommended!",
    rating: 5,
    type: "text",
  },
  {
    id: 2,
    name: "Michael Smith",
    feedback: "Amazing results and exceptional support.",
    rating: 4.5,
    type: "photo",
    imageUrl: "/testimonials/michael.jpg",
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
    name: "Johnson Alice",
    feedback: "This service transformed my business—highly recommended!",
    rating: 5,
    type: "text",
  },
  {
    id: 5,
    name: "Smith Michael",
    feedback: "Amazing results and exceptional support.",
    rating: 4.5,
    type: "photo",
    imageUrl: "/testimonials/michael.jpg",
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
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

interface CarouselProps {
  items: Testimonial[];
}

const TestimonialCarousel: React.FC<CarouselProps> = ({ items }) => {
  const t = useTranslations("Testimonials");
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % items.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);

  if (items.length === 0) return null;

  const currentTestimonial = items[current];

  return (
    <Box sx={{ mb: 8 }}>
      <Container maxWidth="sm" sx={{ position: "relative" }}>
        <motion.div variants={slideVariants} initial="hidden" animate="visible">
          <Card sx={{ bgcolor: "grey.800", p: 2, textAlign: "center" }}>
            {currentTestimonial.type === "text" && (
              <CardContent>
                <Typography variant="body1" fontStyle="italic">
                  {currentTestimonial.feedback}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
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
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    border: "4px solid",
                    borderColor: "warning.main",
                    mx: "auto",
                    mb: 2,
                  }}
                />
                <CardContent>
                  <Typography variant="body1" fontStyle="italic">
                    {currentTestimonial.feedback}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" mt={2}>
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
                    paddingTop: "56.25%", // 16:9 aspect ratio
                    mb: 2,
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
                  <Typography variant="body1" fontStyle="italic">
                    {currentTestimonial.feedback}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                    {currentTestimonial.name}
                  </Typography>
                </CardContent>
              </>
            )}
            <Box mt={1}>
              <Rating
                name={`rating-${currentTestimonial.id}`}
                value={currentTestimonial.rating}
                precision={0.5}
                readOnly
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarIcon fontSize="inherit" sx={{ opacity: 0.3 }} />}
              />
            </Box>
          </Card>
        </motion.div>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <IconButton onClick={prevSlide} sx={{ color: "common.white" }} aria-label="Previous Slide">
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={nextSlide} sx={{ color: "common.white" }} aria-label="Next Slide">
            <ChevronRight />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default function Testimonials() {
  const t = useTranslations("Testimonials");

  // Split testimonials by type.
  const textTestimonials = testimonials.filter((item) => item.type === "text");
  const photoTestimonials = testimonials.filter((item) => item.type === "photo");
  const videoTestimonials = testimonials.filter((item) => item.type === "video");

  return (
    <Box component="section" sx={{ py: 8, color: "common.white" }}>
      <Typography variant="h4" textAlign="center" mb={4} fontWeight="bold">
        {t("title")}
      </Typography>
      <TestimonialCarousel items={textTestimonials} />
      <TestimonialCarousel items={photoTestimonials} />
      <TestimonialCarousel items={videoTestimonials} />
    </Box>
  );
}
