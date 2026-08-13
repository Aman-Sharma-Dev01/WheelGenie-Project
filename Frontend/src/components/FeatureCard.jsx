
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const accentStyles = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    bottom: "bg-blue-600",
    link: "text-blue-600",
  },
  green: {
    icon: "bg-green-50 text-green-600",
    bottom: "bg-green-600",
    link: "text-green-600",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600",
    bottom: "bg-purple-600",
    link: "text-purple-600",
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
  const style = accentStyles[accent];

  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="
        group
        relative
        flex
        min-h-[112px]
        overflow-hidden
        rounded-[12px]
        border
        border-slate-200
        bg-white
        px-5
        py-3
        shadow-[0_2px_12px_rgba(11,31,58,0.025)]
        transition-all
        duration-300
        hover:border-slate-300
        hover:shadow-[0_8px_22px_rgba(11,31,58,0.07)]
      "
    >
      <div className="flex w-full items-center gap-5">

        {/* Icon */}
        <div
          className={`
            flex
            h-[52px]
            w-[52px]
            shrink-0
            items-center
            justify-center
            rounded-[13px]
            ${style.icon}
          `}
        >
          <Icon
            size={26}
            strokeWidth={1.8}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">

          {/* Title */}
          <h3 className="wg-heading text-[17px] font-semibold leading-[1.25] text-wg-navy">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-1 max-w-[300px] text-[13px] leading-[1.45] text-slate-600">
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
              ${style.link}
            `}
          >
            {linkText}

            <ArrowRight
              size={14}
              strokeWidth={2}
              className="
                transition-transform
                duration-200
                group-hover:translate-x-1
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
          ${style.bottom}
        `}
      />
    </motion.a>
  );
}