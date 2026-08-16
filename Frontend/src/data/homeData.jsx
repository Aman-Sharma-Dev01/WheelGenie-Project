import {
  CarFront,
  Tag,
  Calculator,
  UsersRound,
  Award,
  Clock,
  BadgeCheck,
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
    icon: BadgeCheck,
    href: "/calculator",
    variant: "outline",
  },
];

export const features = [
  {
    title: "Buy Cars",
    description:
      "Explore a wide range of verified cars to find the one that fits you best.",
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
    value: "25+",
    label: "Years of Experience",
    icon: Award,
  },
  {
    value: "2,100+",
    label: "Satisfied Customers",
    icon: UsersRound,
  },
  {
    value: "500+",
    label: "Cars for Rent",
    icon: CarFront,
  },
  {
    value: "6,450+",
    label: "Working Hours",
    icon: Clock,
  },
];