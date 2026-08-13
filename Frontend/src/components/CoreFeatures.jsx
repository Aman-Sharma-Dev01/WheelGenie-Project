import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import { features } from "../data/homeData";

export default function CoreFeatures() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="wg-container">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="wg-heading text-2xl font-bold text-wg-navy sm:text-3xl">
            Our Core Features
          </h2>

          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Everything you need in one simple platform.
          </p>
        </motion.div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}