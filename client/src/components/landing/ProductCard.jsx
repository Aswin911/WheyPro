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
      {/* Product visual */}
      <div
        className="relative flex h-[340px] items-center justify-center overflow-hidden"
        style={{ backgroundColor: product.color }}
      >
        <span className="absolute left-6 top-6 text-xs font-bold tracking-[0.2em] text-[#555]">
          {product.category}
        </span>

        <span className="absolute right-6 top-6 text-sm font-semibold text-[#777]">
          {product.number}
        </span>

        {/* Decorative background */}
        <div className="absolute size-64 rounded-full border border-black/10 transition-transform duration-700 group-hover:scale-110" />

        {/* CSS product container */}
        <motion.div
          whileHover={{ y: -8, rotate: -3 }}
          transition={{ duration: 0.35 }}
          className="relative z-10 flex h-[230px] w-[155px] flex-col overflow-hidden rounded-[1.4rem] bg-[#20241D] shadow-[0_25px_45px_-15px_rgba(0,0,0,0.35)]"
        >
          <div className="mx-auto h-5 w-[72%] rounded-b-md bg-[#11130F]" />

          <div className="flex flex-1 flex-col justify-between p-4 text-white">
            <div>
              <p className="text-[8px] font-bold tracking-[0.25em] text-[#C7F36B]">
                WHEYPRO
              </p>

              <p className="mt-4 text-xl font-black leading-tight tracking-tight">
                {product.name.split(" ").slice(0, 2).join(" ")}
              </p>
            </div>

            <div>
              <div className="mb-3 h-[2px] w-full bg-[#C7F36B]" />

              <p className="text-[9px] font-bold tracking-widest text-white/70">
                {product.category}
              </p>

              <p className="mt-2 text-[8px] text-[#C7F36B]">
                DEMO PACKAGING
              </p>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-5 left-5 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-[10px] font-semibold text-[#555] backdrop-blur">
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