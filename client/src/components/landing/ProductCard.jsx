
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export default function ProductCard({ product, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
      }}
      className="group overflow-hidden rounded-[1.75rem] border border-border bg-white"
    >
      {/* Product image */}
      <div
        className="relative h-[340px] overflow-hidden"
        style={{ backgroundColor: product.color }}
      >
        <span className="absolute left-5 top-5 z-10 rounded-full border border-black/5 bg-white/90 px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-[#151515] shadow-sm backdrop-blur-sm">
            {product.category}
        </span>

        <span className="absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-full border border-black/5 bg-white/90 text-xs font-bold text-[#151515] shadow-sm backdrop-blur-sm">
            {product.number}
        </span>

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transform-gpu transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] will-change-transform"
        />

        <div className="absolute bottom-5 left-5 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-[10px] font-semibold text-[#555] backdrop-blur">
          {product.flavor}
        </div>
      </div>

      {/* Product details */}
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#91B83F]">
              {product.category}
            </p>

            <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">
              {product.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:bg-primary"
            style={{ backgroundColor: product.color }}
          >
            <ArrowUpRight className="size-5 text-[#151515] transition-transform group-hover:rotate-45" />
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <span className="text-xs font-semibold text-muted-foreground">
            Product details coming soon
          </span>
        </div>
      </div>
    </motion.article>
  );
}
