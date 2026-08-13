import {
  CarFront,
  Tag,
  Calculator,
  UsersRound,
  ShieldCheck,
  Award,
} from "lucide-react";

export const heroActions = [
  {
    title: "Buy a Car",
    description: "Find your perfect car",
    icon: CarFront,
    href: "/buy",
    variant: "navy",
  },
  {
    title: "Sell Your Car",
    description: "List and sell in minutes",
    icon: Tag,
    href: "/sell",
    variant: "blue",
  },
  {
    title: "AI Calculator",
    description: "Get instant car value",
    icon: Calculator,
    href: "/calculator",
    variant: "outline",
  },
];

export const features = [
  {
    title: "Buy Cars",
    description:
      "Explore a wide range of verified cars. Compare and find the one that fits you best.",
    linkText: "Explore Cars",
    href: "/buy",
    icon: CarFront,
    accent: "blue",
  },
  {
    title: "Sell Your Car",
    description:
      "List your car in minutes and reach thousands of potential buyers near you.",
    linkText: "List Your Car",
    href: "/sell",
    icon: Tag,
    accent: "green",
  },
  {
    title: "AI Calculator",
    description:
      "Get an accurate estimate of your car’s value using our AI-powered calculator.",
    linkText: "Calculate Now",
    href: "/calculator",
    icon: Calculator,
    accent: "purple",
  },
];

export const stats = [
  {
    value: "10K+",
    label: "Happy Customers",
    icon: UsersRound,
  },
  {
    value: "15K+",
    label: "Cars Listed",
    icon: CarFront,
  },
  {
    value: "100%",
    label: "Verified Listings",
    icon: ShieldCheck,
  },
  {
    value: "4.8/5",
    label: "Average Rating",
    icon: Award,
  },
];