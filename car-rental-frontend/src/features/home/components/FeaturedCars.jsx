import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CarCard from "@/features/cars/components/CarCard";
import { ROUTES } from "@/constants/routes";

function CardSkeleton() {
  return (
    <div
      className="h-80 animate-pulse rounded-2xl bg-primary-50"
      aria-hidden="true"
    />
  );
}

/** Presentational: data comes from the page (useCars hook later). */
export default function FeaturedCars({ cars = [], loading = false }) {
  return (
    <section
      className="bg-white py-16 md:py-24"
      aria-labelledby="featured-title"
    >
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="featured-title" className="text-2xl md:text-3xl">
              Popular <span className="text-accent-500">cars</span>
            </h2>
            <p className="mt-2 text-muted">
              Hand-picked rides from our top-rated agencies.
            </p>
          </div>
          <Link to={ROUTES.CARS} className="btn-ghost group">
            View all
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)
            : cars.map((car) => <CarCard key={car.id} car={car} />)}
        </div>

        {!loading && cars.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-line py-12 text-center text-sm text-muted">
            No featured cars yet. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
