import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function Placeholder({ title }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="wg-heading text-3xl font-bold text-wg-navy">
        {title}
      </h1>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/buy"
          element={<Placeholder title="Buy Cars" />}
        />

        <Route
          path="/sell"
          element={<Placeholder title="Sell Your Car" />}
        />

        <Route
          path="/calculator"
          element={<Placeholder title="AI Calculator" />}
        />

        <Route
          path="/about"
          element={<Placeholder title="About Us" />}
        />

        <Route
          path="/how-it-works"
          element={<Placeholder title="How It Works" />}
        />

        <Route
          path="/contact"
          element={<Placeholder title="Contact" />}
        />
      </Routes>
    </BrowserRouter>
  );
}