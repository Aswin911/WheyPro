
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
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

// Product visual must be outside Hero
function ProductVisual() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#E9EDE1]">
      <img
        src="/images/Hero_image.png"
        alt="WheyPro premium whey protein"
        fetchPriority="high"
        className="h-full min-h-[460px] w-full object-cover sm:min-h-[540px]"
      />

      <div className="absolute bottom-8 left-4 rounded-full bg-[#151715] px-4 py-3 text-xs font-semibold text-white sm:left-8">
        Built for your goals
      </div>
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
          {/* <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DCE7C9] bg-[#EEF5E4] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#536B35]">
              <span className="size-2 rounded-full bg-[#91B83F]" />
              Nutrition meets performance
            </span>
          </motion.div> */}

          <motion.h1
            variants={itemVariants}
            className="mt-8 max-w-2xl text-5xl font-black leading-[1.04] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl"
          >
            Fuel your
            <br />
            ambition.
            <br />
            <span className="text-[#91B83F]">Own your</span>
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
