
import { motion } from "motion/react";
import { ArrowUpRight, Zap } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#151715] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-40 size-[500px] rounded-full bg-[#C7F36B]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-[400px] rounded-full bg-[#C7F36B]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
            <Zap className="size-4 fill-[#C7F36B] text-[#C7F36B]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C7F36B]">
              Your journey starts here
            </span>
          </div>

          <h2 className="mt-9 max-w-4xl text-5xl font-black leading-[1.05] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
            Your goals.
            <br />
            Your journey.
            <br />
            <span className="text-[#C7F36B]">Your WheyPro.</span>
          </h2>

          <p className="mt-7 max-w-xl text-base leading-8 text-white/55 sm:text-lg">
            Every step forward counts. Explore WheyPro and
            make nutrition part of your fitness journey.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#products"
              className="group inline-flex items-center gap-3 rounded-full bg-[#C7F36B] px-8 py-4 text-sm font-bold text-[#151515] transition-all duration-300 hover:-translate-y-1 hover:bg-[#B6E653] hover:shadow-xl hover:shadow-[#C7F36B]/10"
            >
              Explore Products
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>

        {/* Bottom brand strip */}
        <div className="mt-20 border-t border-white/10 pt-7">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs font-semibold tracking-[0.2em] text-white/40">
              WHEYPRO / BUILT FOR YOUR GOALS
            </p>

            <p className="text-xs text-white/40">
              Progress starts with consistency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
