
import { motion } from "framer-motion";
import { ArrowRight, Search, Plus } from "lucide-react";

const accentStyles = {
  blue: {
    icon: "bg-blue-50/90 text-wg-blue group-hover:bg-blue-100/90 group-hover:shadow-[0_0_15px_rgba(47,128,237,0.35)]",
    bottom: "bg-wg-blue",
    link: "text-wg-blue",
    hoverClass: "wg-glass-hover-blue",
    borderHover: "group-hover:border-blue-300/60",
    badge: "bg-blue-50 text-wg-blue",
    glowBg: "bg-blue-400/20",
  },
  green: {
    icon: "bg-green-50/90 text-wg-green group-hover:bg-green-100/90 group-hover:shadow-[0_0_15px_rgba(39,174,96,0.35)]",
    bottom: "bg-wg-green",
    link: "text-wg-green",
    hoverClass: "wg-glass-hover-green",
    borderHover: "group-hover:border-green-300/60",
    badge: "bg-green-50 text-wg-green",
    glowBg: "bg-green-400/20",
  },
  purple: {
    icon: "bg-[#B75EFF]/10 text-[#B75EFF] group-hover:bg-[#B75EFF]/20 group-hover:shadow-[0_0_18px_rgba(183,94,255,0.40)]",
    bottom: "bg-[#B75EFF]",
    link: "text-[#B75EFF]",
    hoverClass: "wg-glass-hover-purple",
    borderHover: "group-hover:border-[#B75EFF]/40",
    badge: "bg-[#B75EFF]/10 text-[#B75EFF]",
    glowBg: "bg-[#B75EFF]/25",
  },
};

export default function FeatureCard({
  title,
  description,
  linkText,
  href,
  icon: Icon,
  accent,
}) {
  const style = accentStyles[accent] || accentStyles.blue;

  return (
    <div className="relative h-full w-full">
      {/* Outer ambient glow behind card on hover */}
      <div
        className={`pointer-events-none absolute -inset-1 rounded-[16px] opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 -z-10 ${style.glowBg}`}
      />

      <motion.a
        href={href}
        className={`
          group
          relative
          flex
          h-full
          w-full
          min-h-[112px]
          overflow-hidden
          rounded-[14px]
          border
          border-slate-200/90
          bg-white/90
          backdrop-blur-md
          px-5
          py-3.5
          shadow-[0_4px_16px_rgba(11,31,58,0.03)]
          transition-all
          duration-500
          ease-[cubic-bezier(0.16,1,0.3,1)]
          ${style.hoverClass}
        `}
      >
        {/* Subtle white reflection highlight along top edge */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-[14px] opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-0" />

        <div className="relative z-10 flex w-full items-center gap-5">
          {/* Icon */}
          <div
            className={`
              relative
              flex
              h-[52px]
              w-[52px]
              shrink-0
              items-center
              justify-center
              rounded-[13px]
              transition-all
              duration-500
              ${style.icon}
            `}
          >
            <Icon
              size={26}
              strokeWidth={1.8}
            />
            {title === "Buy Cars" && (
              <div className="absolute -bottom-1 -right-1 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-blue-50 text-wg-blue shadow-[0_2px_5px_rgba(0,0,0,0.1)] border border-white">
                <Search size={11} strokeWidth={2.5} />
              </div>
            )}
            {title === "AI Calculator" && (
              <div className="absolute -top-1.5 -right-1.5 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#B75EFF]/15 text-[#B75EFF] shadow-[0_2px_5px_rgba(0,0,0,0.05)] border border-white">
                <Plus size={10} strokeWidth={3} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Title */}
            <h3 className="wg-heading text-[17px] font-semibold leading-[1.25] text-wg-navy transition-colors duration-300">
              {title}
            </h3>

            {/* Description */}
            <p className="mt-1 max-w-[220px] text-[13px] leading-[1.45] text-slate-600 transition-colors duration-300">
              {description}
            </p>

            {/* CTA */}
            <span
              className={`
                mt-1.5
                inline-flex
                items-center
                gap-1
                text-[13px]
                font-semibold
                transition-colors
                duration-300
                ${style.link}
              `}
            >
              {linkText}

              <ArrowRight
                size={14}
                strokeWidth={2}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1.5
                "
              />
            </span>
          </div>
        </div>

        {/* Bottom Accent */}
        <span
          className={`
            absolute
            bottom-0
            left-0
            h-[3px]
            w-full
            transition-all
            duration-500
            ${style.bottom}
          `}
        />
      </motion.a>
    </div>
  );
}