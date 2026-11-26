import { CalendarCheck, Compass, ShieldCheck, Headset } from "lucide-react";

const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Book a Car",
    text: "Pick dates, send a request in minutes.",
  },
  {
    icon: Compass,
    title: "Explore Places",
    text: "Cars available in cities across the country.",
  },
  {
    icon: ShieldCheck,
    title: "Travel Safe",
    text: "Verified agencies and moderated listings.",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    text: "We are here whenever you need us.",
  },
];

export default function HomeFeatures() {
  return (
    <section
      className="container-page py-16 md:py-24"
      aria-labelledby="why-title"
    >
      <h2 id="why-title" className="text-center text-2xl md:text-3xl">
        Why choose Any<span className="text-accent-500">Drive</span>
      </h2>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="text-center">
            <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
              <span
                className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-500"
                aria-hidden="true"
              />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
