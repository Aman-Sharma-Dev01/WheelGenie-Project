import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

import footerLogo from "../assets/footerlogo.png";

const footerColumns = [
  {
    title: "Quick Links",
    links: [
      ["Buy Cars", "/buy"],
      ["Sell Your Car", "/sell"],
      ["AI Calculator", "/calculator"],
      ["How It Works", "/how-it-works"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Us", "/"],
      ["Careers", "/careers"],
      ["Blog", "/blog"],
      ["Contact Us", "/contact"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help Center", "/help"],
      ["Terms & Conditions", "/terms"],
      ["Privacy Policy", "/privacy"],
      ["FAQ", "/faq"],
    ],
  },
];

const socialLinks = [
  {
    icon: FaFacebookF,
    href: "#",
    label: "Facebook",
  },
  {
    icon: FaInstagram,
    href: "#",
    label: "Instagram",
  },
  {
    icon: FaTwitter,
    href: "#",
    label: "Twitter",
  },
  {
    icon: FaYoutube,
    href: "#",
    label: "YouTube",
  },
];

export default function Footer() {
  return (
    <footer className="bg-wg-navy text-white border-t border-white/5">
      <div className="wg-container py-10">
        <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.35fr_0.9fr_0.9fr_0.9fr_1.25fr]">

          {/* Brand */}
          <div>
            <img
              src={footerLogo}
              alt="WheelGenie"
              className="h-10 w-auto object-contain"
            />

            <p className="mt-4 max-w-[250px] text-sm leading-6 text-slate-300">
              Simplifying the way you buy, sell and value your car.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-slate-300 transition-all duration-200 hover:border-wg-blue hover:bg-wg-blue hover:text-white hover:-translate-y-0.5"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white">
                {column.title}
              </h3>

              <div className="mt-4 space-y-2.5">
                {column.links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="block text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Contact Us
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-300 font-medium">

              {/* Phone */}
              <a
                href="tel:+14039736444"
                className="flex gap-3 transition-colors duration-200 hover:text-white"
              >
                <Phone
                  size={17}
                  className="mt-0.5 shrink-0 text-slate-400"
                />

                <span>+1(403)9736444</span>
              </a>

              {/* Email */}
              <a
                href="mailto:Admin@wheelgenie.ca"
                className="flex gap-3 transition-colors duration-200 hover:text-white"
              >
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-slate-400"
                />

                <span>Admin@wheelgenie.ca</span>
              </a>

              {/* Address */}
              <div className="flex gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-slate-400"
                />

                <span>
                  +1(403)9736444
                  <br />
                  2600 - 1066 WEST HASTINGS STREET VANCOUVER BC V6E 3X1 CANADA
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="wg-container py-4 text-center text-xs text-slate-400">
          © 2026 WheelGenie. All rights reserved.
        </div>
      </div>
    </footer>
  );
}