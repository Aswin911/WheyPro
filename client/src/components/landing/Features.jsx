
import { motion } from "motion/react";
import {
  ShieldCheck,
  Leaf,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Quality comes first.",
    description:
      "Make informed choices with a quality-first approach to sports nutrition.",
    tag: "QUALITY FIRST",
  },
  {
    number: "02",
    icon: Leaf,
    title: "Nutrition with purpose.",
    description:
      "Explore nutrition that complements your lifestyle and fitness goals.",
    tag: "MINDFUL NUTRITION",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Progress through consistency.",
    description:
      "Build better habits, stay committed, and keep showing up for yourself.",
    tag: "KEEP PROGRESSING",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Features() {
  return (
    <section className="bg-background px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#91B83F]"
            >
              The WheyPro approach
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-5 text-4xl font-black tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl"
            >
              More than just
              <br />
              <span className="text-[#91B83F]">nutrition.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-md text-base leading-7 text-muted-foreground"
          >
            Your fitness journey is built on everyday decisions.
            We're here to make nutrition a part of that journey.
          </motion.p>
        </div>

        {/* Feature cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-5 md:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.number}
                variants={cardVariants}
                whileHover={{ y: -7 }}
                className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 sm:p-9"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 transition-all duration-300 group-hover:rotate-6 group-hover:bg-primary/25">
                    <Icon className="size-7 text-primary" />                  </div>

                  <span className="text-sm font-semibold text-muted-foreground/60">
                    {feature.number}
                  </span>
                </div>

                <div className="relative z-10 mt-12">
                  <span className="text-[10px] font-bold tracking-[0.18em] text-[#829C5B]">
                    {feature.tag}
                  </span>

                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-3 max-w-xs text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                <ArrowUpRight className="absolute bottom-8 right-8 size-5 text-muted-foreground/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
