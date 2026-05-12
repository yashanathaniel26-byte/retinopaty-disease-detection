"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

type Testimonial = {
  quote: string;
  name: string;
  title: string;
};

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section
      className="relative left-1/2 right-1/2 mt-16 w-screen -mx-[50vw]"
      aria-label="Testimoni"
    >

      <div className="mt-10 w-full">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="normal"
          className="w-full max-w-none px-6"
        />
      </div>
    </section>
  );
}
