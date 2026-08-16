import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { heroActions } from "../data/homeData";
import car from "../assets/car.png";
import car1 from "../assets/car1.png";
import car3 from "../assets/car3.png";
import car4 from "../assets/car4.png.png";
import car5 from "../assets/car5.png";

const carImages = [car, car1, car3, car4, car5];


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
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarIndex((prevIndex) => (prevIndex + 1) % carImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#F8FBFF] via-white to-[#F3F8FF]">
      


      <div className="wg-container relative">
        <div className="grid min-h-[430px] items-center gap-8 py-12 lg:grid-cols-[1.25fr_0.75fr] lg:py-10">
          
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
              className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-[680px] w-full"
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
                    className={`group flex min-h-[68px] items-center gap-2.5 rounded-[10px] px-4 py-2.5 transition-shadow duration-300 hover:shadow-lg ${styles[action.variant]}`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        action.variant === "outline"
                          ? "bg-blue-50"
                          : "bg-white/10"
                      }`}
                    >
                      <Icon size={20} strokeWidth={1.8} />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold leading-tight whitespace-nowrap">
                        {action.title}
                      </span>

                      <span
                        className={`mt-0.5 block text-[13px] leading-tight whitespace-nowrap ${
                          action.variant === "outline"
                            ? "text-slate-500"
                            : "text-white/85"
                        }`}
                      >
                        {action.description}
                      </span>
                    </span>
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
            className="relative flex items-center justify-center scale-105 sm:scale-110 lg:scale-115"
          >
            <div className="absolute h-[290px] w-[290px] rounded-full bg-blue-100/60 sm:h-[360px] sm:w-[360px]" />

            <div className="absolute h-[230px] w-[230px] rounded-full border-[24px] border-blue-50 sm:h-[300px] sm:w-[300px]" />

            <motion.div
              className="relative z-10 w-full max-w-[600px] flex justify-center items-center"
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {carImages.map((image, index) => (
                <motion.img
                  key={index}
                  src={image}
                  alt={`Car ${index + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === currentCarIndex ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`w-full object-contain drop-shadow-[0_20px_25px_rgba(11,31,58,0.16)] ${
                    index === 0 ? "relative" : "absolute inset-0"
                  }`}
                  style={{
                    pointerEvents: index === currentCarIndex ? "auto" : "none",
                  }}
                />
              ))}
            </motion.div>

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