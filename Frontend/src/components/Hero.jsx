import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { heroActions } from "../data/homeData";
import car from "../assets/car.png";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#F8FBFF] via-white to-[#F3F8FF]">
      
      {/* Decorative background */}
      <div className="pointer-events-none absolute right-[7%] top-8 hidden h-[230px] w-[230px] rounded-full bg-blue-100/50 blur-[1px] lg:block" />

      <div className="wg-container relative">
        <div className="grid min-h-[430px] items-center gap-8 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-10">
          
          {/* Left */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            <motion.h1
              variants={itemVariants}
              className="wg-heading max-w-[600px] text-4xl font-bold leading-[1.12] tracking-[-0.03em] text-wg-navy sm:text-5xl"
            >
              Buy, Sell and value your
              <br />
              car with{" "}
              <span className="text-wg-blue">AI.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-[500px] text-base leading-7 text-slate-600 sm:text-lg"
            >
              Your all-in-one platform for buying, selling,
              <br className="hidden sm:block" />
              and smart car valuation.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-7 grid max-w-[710px] gap-3 sm:grid-cols-3"
            >
              {heroActions.map((action) => {
                const Icon = action.icon;

                const styles = {
                  navy: "bg-wg-navy text-white",
                  blue: "bg-wg-blue text-white",
                  outline:
                    "border border-wg-blue bg-white text-wg-blue",
                };

                return (
                  <motion.a
                    key={action.title}
                    href={action.href}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`group flex min-h-[76px] items-center gap-3 rounded-[10px] px-4 py-3 transition-shadow duration-300 hover:shadow-lg ${styles[action.variant]}`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        action.variant === "outline"
                          ? "bg-blue-50"
                          : "bg-white/10"
                      }`}
                    >
                      <Icon size={25} strokeWidth={1.8} />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        {action.title}
                      </span>

                      <span
                        className={`mt-1 block text-xs ${
                          action.variant === "outline"
                            ? "text-slate-600"
                            : "text-white/85"
                        }`}
                      >
                        {action.description}
                      </span>
                    </span>

                    <ArrowRight
                      size={16}
                      className="ml-auto hidden opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 sm:block"
                    />
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Car */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute h-[290px] w-[290px] rounded-full bg-blue-100/60 sm:h-[360px] sm:w-[360px]" />

            <div className="absolute h-[230px] w-[230px] rounded-full border-[24px] border-blue-50 sm:h-[300px] sm:w-[300px]" />

            <motion.img
              src={car}
              alt="White car"
              className="relative z-10 w-full max-w-[600px] object-contain drop-shadow-[0_20px_25px_rgba(11,31,58,0.16)]"
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Dots */}
            <div className="absolute right-0 top-4 grid grid-cols-5 gap-3 opacity-50">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  key={index}
                  className="h-1.5 w-1.5 rounded-full bg-blue-300"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}