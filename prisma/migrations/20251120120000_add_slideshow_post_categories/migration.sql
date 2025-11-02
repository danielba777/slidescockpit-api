-- Add categories array to slideshow posts
ALTER TABLE "SlideshowPost"
ADD COLUMN "categories" TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL;
