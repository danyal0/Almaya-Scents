import { BrandStory } from "@/components/home/BrandStory";
import { EditorialProductSection } from "@/components/home/EditorialProductSection";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { FullBleedImage } from "@/components/home/FullBleedImage";
import { Hero } from "@/components/home/Hero";
import { ImageStoryGrid } from "@/components/home/ImageStoryGrid";
import { Newsletter } from "@/components/home/Newsletter";
import { almayaContent } from "@/content/almaya-content";

export default function HomePage() {
  const [storyOne, storyTwo] = almayaContent.stories;

  return (
    <>
      <Hero />
      <FeaturedCollection />
      <EditorialProductSection story={storyOne} headingId="story-one-heading" />
      <FullBleedImage />
      <EditorialProductSection
        story={storyTwo}
        reverse
        headingId="story-two-heading"
      />
      <ImageStoryGrid />
      <BrandStory />
      <Newsletter />
    </>
  );
}
