import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  return (
    <section
      id="products"
      className="scroll-mt-20 bg-[#F0F0EB] px-5 py-24 dark:bg-background sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#91B83F]"
            >
              Explore WheyPro
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-5 text-4xl font-black tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl"
            >
              Find your
              <br />
              <span className="text-[#91B83F]">formula.</span>
            </motion.h2>
          </div>

          <p className="max-w-md text-base leading-7 text-muted-foreground">
            Explore the WheyPro range and discover products
            designed to complement your fitness journey.
          </p>
        </div>

        {/* Product cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex justify-center">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full border border-foreground/15 px-7 py-4 text-sm font-bold transition-all duration-300 hover:border-primary hover:bg-primary"
          >
            Discover WheyPro
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

      </div>
    </section>
  );
}