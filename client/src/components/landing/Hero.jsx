
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function ProductVisual() {
  return (
    <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#E9EDE1] sm:min-h-[540px]">
      {/* Background decoration */}
      <div className="absolute left-1/2 top-1/2 size-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D5E9B7] blur-3xl sm:size-[420px]" />

      <div className="absolute left-8 top-10 text-xs font-semibold uppercase tracking-[0.25em] text-[#758064]">
        WheyPro / Performance
      </div>

      {/* Decorative circles */}
      <div className="absolute right-12 top-20 size-20 rounded-full border border-[#B9C9A2]" />
      <div className="absolute bottom-16 left-10 size-12 rounded-full border border-[#B9C9A2]" />

      {/* Temporary CSS product packaging */}
      <motion.div
        initial={{ opacity: 0, y: 35, rotate: -5 }}
        animate={{ opacity: 1, y: 0, rotate: -4 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
        whileHover={{ rotate: 0, scale: 1.035 }}
        className="relative z-10 flex h-[330px] w-[205px] flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#20241D] shadow-[0_35px_65px_-20px_rgba(0,0,0,0.4)] sm:h-[390px] sm:w-[245px]"
      >
        <div className="mx-auto mt-[-2px] h-7 w-[72%] rounded-b-lg bg-[#11130F]" />

        <div className="flex flex-1 flex-col justify-between px-5 pb-7 pt-7 text-white sm:px-7">
          <div>
            <div className="text-[11px] font-bold tracking-[0.3em] text-[#C7F36B]">
              SPORTS NUTRITION
            </div>

            <div className="mt-5 text-3xl font-black tracking-tighter sm:text-4xl">
              WHEY
              <span className="text-[#C7F36B]">PRO</span>
            </div>

            <div className="mt-1 text-[10px] tracking-[0.22em] text-white/60">
              PREMIUM SERIES
            </div>
          </div>

          <div>
            <div className="mb-3 h-[2px] w-full bg-[#C7F36B]" />

            <div className="text-2xl font-black tracking-tight sm:text-3xl">
              WHEY
              <br />
              PROTEIN
            </div>

            <div className="mt-3 inline-flex rounded-full bg-[#C7F36B] px-3 py-1 text-[9px] font-black tracking-wider text-[#151515]">
              PROTEIN SUPPLEMENT
            </div>

            <div className="mt-5 flex items-end justify-between">
              <span className="text-[9px] tracking-widest text-white/60">
                PERFORMANCE
                <br />
                NUTRITION
              </span>
              <span className="text-xs font-bold text-[#C7F36B]">
                W/P
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating quality badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute right-3 top-[35%] z-20 rounded-2xl border border-white/60 bg-white/85 p-3 shadow-xl backdrop-blur-md sm:right-8 sm:p-4"
      >
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#C7F36B]">
            <ShieldCheck className="size-5 text-[#151515]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#151515]">
              Quality first
            </p>
            <p className="text-[10px] text-[#777A72]">
              Nutrition focused
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating brand badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="absolute bottom-8 left-4 z-20 flex items-center gap-2 rounded-full bg-[#151715] px-4 py-3 text-white shadow-xl sm:left-8"
      >
        <Zap className="size-4 fill-[#C7F36B] text-[#C7F36B]" />
        <span className="text-xs font-semibold">
          Built for your goals
        </span>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-background"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pb-28 lg:pt-36">

        {/* Left content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DCE7C9] bg-[#EEF5E4] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#536B35]">
              <span className="size-2 rounded-full bg-[#91B83F]" />
              Nutrition meets performance
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-8 max-w-2xl text-5xl font-black leading-[1.04] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl"
          >
            Fuel your
            <br />
            ambition.
            <br />
            <span className="text-[#91B83F]">
              Own your
            </span>
            <br />
            journey.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-7 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg"
          >
            Your fitness journey deserves more than ordinary.
            Discover nutrition designed to complement your
            training, support your goals, and keep you moving.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#products"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#b6e653]"
            >
              Explore Products
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-4 text-sm font-semibold text-foreground transition-all hover:border-foreground"
            >
              Our Story
              <ArrowUpRight className="size-4" />
            </a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-border pt-7"
          >
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#91B83F]" />
              <span className="text-xs font-medium text-muted-foreground">
                Quality focused
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#91B83F]" />
              <span className="text-xs font-medium text-muted-foreground">
                Goal oriented
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right product visual */}
        <ProductVisual />

      </div>
    </section>
  );
}
