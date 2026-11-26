import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import HomeFeatures from "../components/HomeFeatures";
import FeaturedCars from "../components/FeaturedCars";

export default function HomePage() {
  // TODO: replace with useCars({ featured: true, limit: 6 }) once carService exists.
  const cars = [];
  const loading = false;

  return (
    <>
      <Hero />
      <div className="container-page relative z-10 -mt-12 md:-mt-16">
        <SearchBar />
      </div>
      <HomeFeatures />
      <FeaturedCars cars={cars} loading={loading} />
    </>
  );
}
