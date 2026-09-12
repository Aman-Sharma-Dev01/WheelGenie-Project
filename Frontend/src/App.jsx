import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChooseRole from "./pages/ChooseRole";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ResponsiveProvider } from "./context/ResponsiveContext";
import { AuthProvider } from "./context/AuthContext";
import AICalculator from "./pages/AiCalculater";
import Contact from "./pages/Contact";

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
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/choose-role" element={<ChooseRole />} />

            <Route
              path="/buy"
              element={<Placeholder title="Buy Cars" pageKey="buy" />}
            />

            <Route
              path="/sell"
              element={<Sell />}
            />

            

            <Route
              path="/about"
              element={<Home />}
            />

        <Route
          path="/calculator"
          element={<AICalculator/>}
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
              element={<Contact />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ResponsiveProvider>
  );
}
