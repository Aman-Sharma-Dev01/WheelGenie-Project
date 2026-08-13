import { motion } from "framer-motion";
import { stats } from "../data/homeData";

export default function StatsSection() {
  return (
    <section className="pb-10">
      <div className="wg-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(11,31,58,0.03)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`flex items-center justify-center gap-4 px-5 py-5 lg:justify-start ${
                  index !== stats.length - 1
                    ? "border-b border-slate-200 lg:border-b-0 lg:border-r"
                    : ""
                }`}
              >
                <Icon
                  size={38}
                  strokeWidth={1.6}
                  className="shrink-0 text-blue-600"
                />

                <div>
                  <div className="wg-heading text-2xl font-bold text-wg-navy">
                    {stat.value}
                  </div>

                  <div className="mt-0.5 text-xs text-slate-600">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}