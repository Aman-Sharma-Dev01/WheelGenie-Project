import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { stats } from "../data/homeData";

function Counter({ value }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const elementRef = useRef(null);

  // Parse the value (e.g. "2,100+" -> target = 2100, suffix = "+", hasCommas = true)
  const numStr = value.replace(/,/g, "");
  const match = numStr.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const hasCommas = value.includes(",");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let startTimestamp = null;
    const duration = 2000; // 2 seconds animation

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuad
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(easeProgress * target);

      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [started, target]);

  const displayValue = hasCommas ? count.toLocaleString() : count;

  return <span ref={elementRef}>{displayValue}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="relative pb-12 pt-2">
      <div className="wg-container relative">
        {/* Soft ambient glow behind stats container */}
        <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2F80ED]/15 via-[#B75EFF]/12 to-[#27AE60]/10 blur-xl opacity-75" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative z-10 grid overflow-hidden rounded-2xl border border-white/15 bg-[#041527] shadow-[0_20px_50px_rgba(4,21,39,0.15)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`flex items-center justify-center gap-4 px-5 py-5 lg:justify-start ${
                  index !== stats.length - 1
                    ? "border-b-2 border-white lg:border-b-0 lg:border-r-2"
                    : ""
                }`}
              >
                <Icon
                  size={38}
                  strokeWidth={1.6}
                  className="shrink-0 text-white"
                />

                <div>
                  <div className="wg-heading text-2xl font-bold text-white">
                    <Counter value={stat.value} />
                  </div>

                  <div className="mt-0.5 text-xs text-slate-400">
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