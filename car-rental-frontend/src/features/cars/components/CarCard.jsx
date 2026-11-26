import { Link } from "react-router-dom";
import { Fuel, Gauge, MapPin, Users } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { CURRENCY } from "@/constants/config";

/** car: { id, name, image, pricePerDay, seats, transmission, fuel, city } */
export default function CarCard({ car }) {
  return (
    <article className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
      <div className="aspect-[16/10] overflow-hidden bg-primary-50">
        {car.image && (
          <img
            src={car.image}
            alt={car.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">{car.name}</h3>
        {car.city && (
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <MapPin size={14} aria-hidden="true" /> {car.city}
          </p>
        )}

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-primary-900/80">
          <li className="flex items-center gap-1.5">
            <Users size={16} aria-hidden="true" /> {car.seats} seats
          </li>
          <li className="flex items-center gap-1.5">
            <Gauge size={16} aria-hidden="true" /> {car.transmission}
          </li>
          <li className="flex items-center gap-1.5">
            <Fuel size={16} aria-hidden="true" /> {car.fuel}
          </li>
        </ul>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-xl font-extrabold text-accent-500">
            {car.pricePerDay} {CURRENCY}
            <span className="text-sm font-medium text-muted"> / day</span>
          </p>
          <Link
            to={ROUTES.carDetails(car.id)}
            className="btn-primary !py-2 text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
