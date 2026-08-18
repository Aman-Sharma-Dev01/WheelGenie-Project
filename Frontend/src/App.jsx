import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ResponsiveProvider } from "./context/ResponsiveContext";

function Placeholder({ title, pageKey }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar activePage={pageKey} />
      <main className="flex-1 flex items-center justify-center py-20">
        <h1 className="wg-heading text-3xl font-bold text-wg-navy sm:text-4xl">
          {title}
        </h1>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ResponsiveProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/buy"
          element={<Placeholder title="Buy Cars" pageKey="buy" />}
        />

        <Route
          path="/sell"
          element={<Placeholder title="Sell Your Car" pageKey="sell" />}
        />

        <Route
          path="/calculator"
          element={<Placeholder title="AI Calculator" pageKey="calculator" />}
        />

        <Route
          path="/about"
          element={<Home />}
        />

        <Route
          path="/how-it-works"
          element={<Placeholder title="How It Works" pageKey="how" />}
        />

        <Route
          path="/contact"
          element={<Placeholder title="Contact" pageKey="contact" />}
        />
      </Routes>
    </BrowserRouter>
  </ResponsiveProvider>
);
}