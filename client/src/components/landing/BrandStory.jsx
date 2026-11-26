
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";

export default function BrandStory() {
  const shouldReduceMotion = useReducedMotion();

  const reveal = {
    initial: shouldReduceMotion ? false : { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.65, ease: "easeOut" },
  };

  return (
    <section
      id="about"
      className="scroll-mt-20 overflow-hidden bg-background px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">

        {/* Image side */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative min-h-[480px] overflow-hidden rounded-[2rem] bg-[#20241D] sm:min-h-[580px]">

            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=85"
              alt="Modern gym environment"
              loading="lazy"
              className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-1000 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div className="absolute bottom-8 left-8 right-8 text-white sm:bottom-10 sm:left-10">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C7F36B]">
                The WheyPro mindset
              </span>

              <p className="mt-4 max-w-md text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Great things are built through consistency.
              </p>
            </div>

            {/* Decorative label */}
            <div className="absolute right-7 top-7 rounded-full border border-white/30 bg-black/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              WHEYPRO / 001
            </div>
          </div>

          {/* Floating accent */}
          <div className="absolute -bottom-5 -right-3 -z-10 size-32 rounded-full bg-[#C7F36B]/30 blur-3xl" />
        </motion.div>

        {/* Story content */}
        <div className="flex flex-col justify-center">

          <motion.div {...reveal}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#91B83F]">
              Who we are
            </span>

            <h2 className="mt-6 text-4xl font-black leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              Built around
              <br />
              <span className="text-[#91B83F]">
                your ambition.
              </span>
            </h2>
          </motion.div>

          <motion.p
            {...reveal}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="mt-8 text-base leading-8 text-muted-foreground"
          >
            Every fitness journey starts with a decision to do
            better. WheyPro is built around that mindset —
            making sports nutrition part of a lifestyle driven
            by commitment, discipline and progress.
          </motion.p>

          <motion.p
            {...reveal}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="mt-5 text-base leading-8 text-muted-foreground"
          >
            We believe progress isn't about overnight
            transformations. It's about showing up, making
            informed choices and staying consistent with
            the goals you set for yourself.
          </motion.p>

          {/* Brand principles */}
          <motion.div
            {...reveal}
            transition={{ duration: 0.65, delay: 0.28 }}
            className="mt-9 space-y-4 border-t border-border pt-7"
          >
            {[
              "Commitment over shortcuts",
              "Quality-conscious choices",
              "Progress through consistency",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#EAF5D8]">
                  <Check className="size-3.5 text-[#688B32]" />
                </span>

                <span className="text-sm font-semibold text-foreground">
                  {item}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div {...reveal} className="mt-10">
            <a
              href="#products"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-[#b6e653]"
            >
              Explore our range
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
