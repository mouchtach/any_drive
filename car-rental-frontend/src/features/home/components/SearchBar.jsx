import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/constants/routes";

const today = () => new Date().toISOString().slice(0, 10);

/** Location + pickup/return dates -> /cars?location=&from=&to= */
export default function SearchBar() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ location: "", from: "", to: "" });
  const [error, setError] = useState("");

  const onChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (values.from && values.to && values.to < values.from) {
      return setError("Return date must be after the pickup date.");
    }
    setError("");
    const params = new URLSearchParams();
    Object.entries(values).forEach(
      ([k, v]) => v.trim() && params.set(k, v.trim()),
    );
    navigate(`${ROUTES.CARS}${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search cars"
      className="card grid gap-4 p-5 shadow-lift md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end md:p-6"
    >
      <Input
        label="Pickup location"
        name="location"
        placeholder="City or airport"
        autoComplete="off"
        value={values.location}
        onChange={onChange}
      />
      <Input
        label="Pickup date"
        name="from"
        type="date"
        min={today()}
        value={values.from}
        onChange={onChange}
      />
      <Input
        label="Return date"
        name="to"
        type="date"
        min={values.from || today()}
        value={values.to}
        onChange={onChange}
        error={error}
      />
      <Button type="submit" variant="cta" className="md:mb-0">
        <Search size={18} aria-hidden="true" /> Search
      </Button>
    </form>
  );
}
