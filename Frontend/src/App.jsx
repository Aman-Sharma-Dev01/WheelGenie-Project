import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Buy from "./pages/Buy";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChooseRole from "./pages/ChooseRole";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ResponsiveProvider } from "./context/ResponsiveContext";
import { AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";
import AICalculator from "./pages/AiCalculater";
import Contact from "./pages/Contact";

// Setup TanStack Query Client for caching and optimistic queries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <ResponsiveProvider>
        <AuthProvider>
          <LocationProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/choose-role" element={<ChooseRole />} />

                {/* Buy Cars Marketplace (Protected by Mandatory Authentication Guard) */}
                <Route
                  path="/buy"
                  element={
                    <ProtectedRoute>
                      <Buy />
                    </ProtectedRoute>
                  }
                />

                {/* Alias route /buy-cars */}
                <Route
                  path="/buy-cars"
                  element={
                    <ProtectedRoute>
                      <Buy />
                    </ProtectedRoute>
                  }
                />

                <Route path="/sell" element={<Sell />} />

                <Route path="/calculator" element={<AICalculator />} />

                <Route path="/about" element={<Home />} />

                <Route
                  path="/how-it-works"
                  element={<Placeholder title="How It Works" pageKey="how" />}
                />

                <Route path="/contact" element={<Contact />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </LocationProvider>
        </AuthProvider>
      </ResponsiveProvider>
    </QueryClientProvider>
  );
}
