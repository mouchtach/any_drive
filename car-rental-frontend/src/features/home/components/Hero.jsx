import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import slide1 from "@/assets/images/hero/s-1.jpg";
import slide2 from "@/assets/images/hero/s-2.jpg";
import slide3 from "@/assets/images/hero/s-3.jpg";

const SLIDES = [slide1, slide2, slide3];

export default function Hero() {
  return (
    <section className="w-full">
      <div className="relative overflow-hidden bg-brand-gradient px-6 pb-28 pt-14 text-white md:px-14 md:pb-36 md:pt-24">
        {/* background image slideshow */}
        <div className="absolute inset-0" aria-hidden="true">
          {SLIDES.map((src, i) => (
            <div
              key={src}
              className="hero-slide absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${src})`,
                animationDelay: `${i * 6}s`,
              }}
            />
          ))}
          {/* blue brand filter + gradient for text contrast */}
          <div className="absolute inset-0 bg-primary-700/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/60 via-primary-900/30 to-primary-900/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-widest text-accent-400">
              Drive Anywhere. Anytime.
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Book your car and{" "}
              <span className="text-accent-500">hit the road!</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-100 md:text-lg">
              Rent from trusted agencies across Morocco. Transparent prices,
              instant requests, zero hassle.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={ROUTES.CARS} className="group btn-cta">
                Book Now
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                to={ROUTES.REGISTER_AGENCY}
                className="btn rounded-xl border border-white/30 px-5 py-3 text-white hover:bg-white/10 focus:ring-white/30"
              >
                Become a partner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
