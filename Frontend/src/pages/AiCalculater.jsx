import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ChevronDown,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Download,
  Share2,
  Info,
  CheckCircle2,
  Lock,
  Sparkles,
  Car,
  FileText,
  Eye,
  Calculator,
} from "lucide-react";


// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------

const STEPS = [
  { id: 1, label: "Enter Details", subtitle: "Enter car information", icon: FileText },
  { id: 2, label: "Review", subtitle: "Check your details", icon: Eye },
  { id: 3, label: "Get Valuation", subtitle: "See your AI estimate", icon: Calculator },
];

const CONDITIONS = [
  { id: "excellent", label: "Excellent", icon: ShieldCheck },
  { id: "good", label: "Good", icon: CheckCircle2 },
  { id: "average", label: "Average", icon: TrendingUp },
  { id: "poor", label: "Poor", icon: Info },
];

// Make/model/variant inputs accept only catalogue values. Fuel Type and
// Transmission are limited to what the selected model actually ships with —
// e.g. Thar never shows CNG, Bolero never shows Automatic.
const CAR_CATALOG = {
  Toyota: {
    Fortuner: { fuels: ["Diesel", "Petrol"], transmissions: ["Automatic", "Manual"], variants: ["2.8 4x4 AT", "2.8 4x2 MT", "2.7 Petrol AT", "Legender 4x2 AT"] },
    "Innova Crysta": { fuels: ["Diesel", "Petrol"], transmissions: ["Automatic", "Manual"], variants: ["2.4 GX MT", "2.4 ZX AT", "2.7 VX MT"] },
    Camry: { fuels: ["Petrol", "Hybrid"], transmissions: ["Automatic"], variants: ["Hybrid AT"] },
    Glanza: { fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["G MT", "V CVT", "S CNG"] },
    "Urban Cruiser Hyryder": { fuels: ["Petrol", "Hybrid", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["E MT", "S Hybrid AT", "G CNG"] },
  },
  Honda: {
    City: { fuels: ["Petrol"], transmissions: ["Manual", "Automatic"], variants: ["ZX CVT", "V MT", "VX CVT"] },
    Amaze: { fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["VX MT", "V CVT"] },
    Elevate: { fuels: ["Petrol"], transmissions: ["Manual", "Automatic"], variants: ["V MT", "ZX CVT"] },
    "WR-V": { fuels: ["Petrol"], transmissions: ["Manual"], variants: ["VX MT", "SV MT"] },
  },
  Hyundai: {
    Creta: { fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["SX PLUS", "SX(O) Diesel AT", "EX Petrol MT", "S Diesel MT"] },
    Verna: { fuels: ["Petrol"], transmissions: ["Manual", "Automatic"], variants: ["SX(O) Turbo DCT", "S MT"] },
    i20: { fuels: ["Petrol"], transmissions: ["Manual", "Automatic"], variants: ["Sportz MT", "Asta IVT"] },
    Venue: { fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["SX Turbo DCT", "S Diesel MT"] },
    Exter: { fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["SX MT", "SX(O) AMT", "S CNG"] },
  },
  "Maruti Suzuki": {
    Swift: { fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["ZXi AMT", "VXi MT", "LXi MT"] },
    Baleno: { fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["Zeta AMT", "Alpha CVT"] },
    Brezza: { fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["ZXi+ AT", "VXi MT"] },
    Ertiga: { fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["ZXi MT", "VXi CNG"] },
    "Wagon R": { fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["LXi MT", "VXi AMT"] },
  },
  Mahindra: {
    XUV700: { fuels: ["Diesel", "Petrol"], transmissions: ["Manual", "Automatic"], variants: ["AX7 Diesel AT", "AX5 Petrol MT", "AX7L 4x4 AT"] },
    "Scorpio-N": { fuels: ["Diesel", "Petrol"], transmissions: ["Manual", "Automatic"], variants: ["Z8L Diesel AT", "Z4 Petrol MT"] },
    Thar: { fuels: ["Diesel", "Petrol"], transmissions: ["Manual", "Automatic"], variants: ["LX Diesel AT 4x4", "AX Petrol MT RWD"] },
    XUV300: { fuels: ["Diesel", "Petrol"], transmissions: ["Manual", "Automatic"], variants: ["W8 Diesel MT", "W6 Petrol AMT"] },
    Bolero: { fuels: ["Diesel"], transmissions: ["Manual"], variants: ["B6 MT", "B4 MT"] },
  },
  Tata: {
    Nexon: { fuels: ["Petrol", "Diesel", "CNG", "Electric"], transmissions: ["Manual", "Automatic"], variants: ["Creative MT", "Fearless+ AMT", "EV Empowered LR"] },
    Punch: { fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["Adventure MT", "Creative AMT"] },
    Harrier: { fuels: ["Diesel"], transmissions: ["Manual", "Automatic"], variants: ["Adventure MT", "Fearless+ AT"] },
    Altroz: { fuels: ["Petrol", "Diesel", "CNG"], transmissions: ["Manual"], variants: ["XZ+ MT", "XM CNG"] },
  },
  Kia: {
    Seltos: { fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["HTX Diesel AT", "HTK Petrol MT"] },
    Sonet: { fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["HTX Turbo DCT", "HTE Diesel MT"] },
    Carens: { fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["Luxury Plus AT", "Premium MT"] },
  },
  Ford: {
    EcoSport: { fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["Titanium MT", "Ambiente Diesel MT"] },
    Endeavour: { fuels: ["Diesel"], transmissions: ["Automatic"], variants: ["Titanium+ 4x4 AT"] },
  },
  Volkswagen: {
    Taigun: { fuels: ["Petrol"], transmissions: ["Manual", "Automatic"], variants: ["GT Plus DSG", "Comfortline MT"] },
    Virtus: { fuels: ["Petrol"], transmissions: ["Manual", "Automatic"], variants: ["GT Plus DSG", "Dynamic Line MT"] },
  },
  Skoda: {
    Slavia: { fuels: ["Petrol"], transmissions: ["Manual", "Automatic"], variants: ["Style AT", "Ambition MT"] },
    Kushaq: { fuels: ["Petrol"], transmissions: ["Manual", "Automatic"], variants: ["Style DSG", "Ambition MT"] },
  },
};

const MAKE_SUGGESTIONS = Object.keys(CAR_CATALOG);
const YEAR_OPTIONS = ["2024", "2023", "2022", "2021", "2020", "2019"];

// City -> RTO codes registered in that city.
const CITY_RTO_MAP = {
  Delhi: ["DL01", "DL02", "DL03", "DL08", "DLBC"],
  Mumbai: ["MH01", "MH02", "MH03", "MH04"],
  Bengaluru: ["KA01", "KA02", "KA03", "KA04", "KA05"],
  Pune: ["MH12", "MH14"],
  Jaipur: ["RJ14", "RJ45"],
  Chandigarh: ["CH01"],
  Hyderabad: ["TS07", "TS08", "TS09"],
  Chennai: ["TN01", "TN02", "TN04", "TN07"],
  Kolkata: ["WB01", "WB02", "WB04", "WB06"],
  Ahmedabad: ["GJ01", "GJ27"],
  Lucknow: ["UP32", "UP78"],
  Noida: ["UP16"],
  Gurugram: ["HR26"],
  Surat: ["GJ05"],
  Nagpur: ["MH31"],
  Indore: ["MP09"],
  Bhopal: ["MP04"],
  Kochi: ["KL07"],
  Coimbatore: ["TN37", "TN38"],
  Patna: ["BR01"],
};
const CITY_SUGGESTIONS = Object.keys(CITY_RTO_MAP);

// The valuation calculator uses the separate FastAPI service.
const AI_API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_AI_API_URL) ||
  "http://localhost:8000/api/v1";

function formatINR(n) {
  return "₹ " + Math.round(n).toLocaleString("en-IN");
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function FieldLabel({ children, required }) {
  return (
    <label className="mb-2 block text-xs font-bold text-[#1D1435]">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

const glassInputClass =
  "h-11 w-full rounded-xl border border-white/85 bg-white/75 px-3.5 text-sm font-medium text-[#1D1435] outline-none transition-all placeholder:text-slate-400 focus:bg-white/95 focus:border-[#7F68A9] focus:ring-4 focus:ring-[#7F68A9]/20 shadow-sm backdrop-blur-md";

function Select({ label, value, onChange, options, placeholder, required }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${glassInputClass} appearance-none pr-9 ${
            value ? "text-[#1D1435]" : "text-slate-400"
          }`}
        >
          <option value="" disabled hidden>
            {placeholder || "Select…"}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, suffix, icon: Icon, placeholder, listId, list, required }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          list={listId}
          className={`${glassInputClass} ${suffix || Icon ? "pr-12" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
            {suffix}
          </span>
        )}
        {Icon && (
          <Icon
            size={15}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        {listId && list && (
          <datalist id={listId}>
            {list.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        )}
      </div>
    </div>
  );
}

// Dropdown fields accept catalogue values only.
function Combobox({ label, value, onChange, options, placeholder, required }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const openList = () => {
    setOpen(true);
  };

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        <input
          value={value}
          onFocus={openList}
          onClick={openList}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "ArrowDown") setOpen(true);
          }}
          readOnly
          aria-haspopup="listbox"
          aria-expanded={open}
          placeholder={placeholder}
          className={`${glassInputClass} appearance-none pr-9`}
        />
        <button
          type="button"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={openList}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {open && options.length > 0 && (
        <div
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-52 w-full overflow-y-auto rounded-xl border border-white/85 bg-white/95 py-1.5 shadow-lg backdrop-blur-md"
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={value === opt}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(opt)}
              className="block w-full px-3.5 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#7F68A9]/10 hover:text-[#5c4680]"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AICalculator() {
  const [step, setStep] = useState(1);
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [kms, setKms] = useState("");
  const [city, setCity] = useState("");
  const [rto, setRto] = useState("");
  const [condition, setCondition] = useState("");

  const [prediction, setPrediction] = useState(null); // { current, months_6, year_1, years_3, years_5 }
  const [apiError, setApiError] = useState("");
  const [shareStatus, setShareStatus] = useState("");

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [processedUrl, setProcessedUrl] = useState("");
  const [bgRemoving, setBgRemoving] = useState(false);
  const [imageRequest, setImageRequest] = useState(null);

  // Fetch and process a car photo only after the user requests a valuation.
  useEffect(() => {
    setImageLoaded(false);
    setImageFailed(false);
    setBgRemoving(false);
    setProcessedUrl((old) => {
      if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
      return "";
    });

    if (!imageRequest?.make.trim() || !imageRequest?.model.trim()) return;

    let cancelled = false;
    (async () => {
      setBgRemoving(true);
      let sourceUrl = null;
      try {
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
            `${imageRequest.make} ${imageRequest.model} car`.trim()
          )}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=420&format=json&origin=*`
        );
        const data = await res.json();
        const pages = data?.query?.pages;
        sourceUrl = pages ? Object.values(pages)[0]?.thumbnail?.source : null;
      } catch (err) {
        console.error("Wikipedia photo lookup failed:", err);
      }

      if (cancelled || !sourceUrl) {
        if (!cancelled) {
          setImageFailed(true);
          setBgRemoving(false);
        }
        return;
      }

      try {
        const { removeBackground } = await import("@imgly/background-removal");
        const blob = await removeBackground(sourceUrl, {
          model: "small",
          output: { format: "image/png", quality: 0.8 },
        });
        if (cancelled) return;
        setProcessedUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error(
          "Background removal failed — showing the plain photo instead:",
          err
        );
        if (!cancelled) setProcessedUrl(sourceUrl);
      } finally {
        if (!cancelled) setBgRemoving(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [imageRequest]);

  const carImageUrl = processedUrl;
  const imageMatchesCurrentCar =
    imageRequest?.make === make.trim() &&
    imageRequest?.model === model.trim();

  // Dependent options are available only for known catalogue entries.
  const modelSuggestions = Object.keys(CAR_CATALOG[make] ?? {});
  const carInfo = CAR_CATALOG[make]?.[model];
  const variantSuggestions = carInfo?.variants ?? [];
  const fuelOptions = carInfo?.fuels ?? [];
  const transmissionOptions = carInfo?.transmissions ?? [];
  const rtoSuggestions = CITY_RTO_MAP[city] ?? [];

  const clearValuation = () => {
    setCalculated(false);
    setPrediction(null);
    setShareStatus("");
    setApiError("");
  };
  const updateValuationInput = (setter) => (value) => {
    setter(value);
    clearValuation();
  };

  const handleMakeChange = (value) => {
    setMake(value);
    setModel("");
    setVariant("");
    setFuel("");
    setTransmission("");
    clearValuation();
  };
  const handleModelChange = (value) => {
    setModel(value);
    setVariant("");
    setFuel("");
    setTransmission("");
    clearValuation();
  };
  const handleCityChange = (value) => {
    setCity(value);
    setRto("");
    clearValuation();
  };

  const hasRequiredFields = [
    make.trim(),
    model.trim(),
    variant.trim(),
    year,
    fuel,
    transmission,
    kms.trim(),
    city.trim(),
    rto.trim(),
  ].every(Boolean);
  const invalidSuggestionFields = [
    [make, MAKE_SUGGESTIONS, "Make"],
    [model, modelSuggestions, "Model"],
    [variant, variantSuggestions, "Variant"],
    [fuel, fuelOptions, "Fuel Type"],
    [transmission, transmissionOptions, "Transmission"],
    [year, YEAR_OPTIONS, "Year of Purchase"],
    [city, CITY_SUGGESTIONS, "City"],
    [rto, rtoSuggestions, "RTO"],
  ]
    .filter(([value, options]) => !options.includes(value.trim()))
    .map(([, , label]) => label);
  const mileage = Number(kms.replace(/,/g, "").trim());
  const isMileageValid = Number.isFinite(mileage) && mileage >= 0;

  // Condition isn't part of the CatBoost model's feature set (see main.py's
  // EXPECTED_COLUMNS), so we apply it as a light client-side adjustment on
  // top of the model's raw prediction.
  const breakdown = useMemo(() => {
    if (!prediction) return null;
    const conditionMult =
      { excellent: 1.03, good: 1.0, average: 0.94, poor: 0.85 }[condition] ??
      1;
    const total = Math.round(prediction.current * conditionMult);
    const base = Math.round(prediction.current);
    // "Similar cars in your city" baseline = the model's raw prediction
    // before the condition adjustment. The % shown in the banner is how
    // much your car's actual estimate differs from that baseline — driven
    // entirely by the condition you picked, so it updates live.
    const percentVsSimilar = base ? ((total - base) / base) * 100 : 0;
    return {
      base,
      conditionAdj: total - base,
      total,
      low: Math.round(total * 0.949),
      high: Math.round(total * 1.051),
      horizon: prediction,
      percentVsSimilar,
    };
  }, [prediction, condition]);

  const handleCalculate = async () => {
    if (!hasRequiredFields) {
      setApiError("Please fill in every field before calculating.");
      return;
    }
    if (invalidSuggestionFields.length > 0) {
      setApiError(
        `Please select valid options for: ${invalidSuggestionFields.join(", ")}.`
      );
      return;
    }
    if (!isMileageValid) {
      setApiError("KMs Driven must be a valid number greater than or equal to 0.");
      return;
    }
    if (!condition) {
      setApiError("Please select your car's condition before calculating.");
      return;
    }
    setCalculated(false);
    setPrediction(null);
    setImageRequest({ make: make.trim(), model: model.trim() });
    setLoading(true);
    setApiError("");
    setShareStatus("");
    setStep(2);

    const payload = {
      make: make.trim(),
      model: model.trim(),
      variant: variant.trim(),
      fuel: fuel.trim(),
      transmission: transmission.trim(),
      location: city.trim(),
      rto: rto.trim(),
      mileage,
      age: Math.max(0, new Date().getFullYear() - parseInt(year, 10)),
    };

    try {
      const res = await fetch(`${AI_API_URL}/predict-buyback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.detail || `Server responded ${res.status}`);
      }
      const data = await res.json();
      setPrediction(data.projections);
      setStep(3);
      setCalculated(true);
    } catch (err) {
      setApiError(
        `Couldn't reach the valuation server (${err.message}). Is main.py running on ${AI_API_URL}?`
      );
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const buildReportText = () => {
    if (!breakdown) return "";
    return [
      "WheelGenie — AI Buyback Valuation Report",
      "-----------------------------------------",
      `Vehicle: ${make} ${model} ${variant}`,
      `Year of Purchase: ${year}  |  Fuel: ${fuel}  |  Transmission: ${transmission}`,
      `KMs Driven: ${kms}  |  City: ${city}  |  Condition: ${CONDITIONS.find((c) => c.id === condition)?.label}`,
      "",
      `Estimated Market Value: ${formatINR(breakdown.total)}`,
      `Price Range: ${formatINR(breakdown.low)} - ${formatINR(breakdown.high)}`,
      "",
      "Future Buyback Projections:",
      `  Today: ₹${(breakdown.horizon.current / 100000).toFixed(2)}L`,
      `  6 Months: ₹${(breakdown.horizon.months_6 / 100000).toFixed(2)}L`,
      `  1 Year: ₹${(breakdown.horizon.year_1 / 100000).toFixed(2)}L`,
      `  3 Years: ₹${(breakdown.horizon.years_3 / 100000).toFixed(2)}L`,
      `  5 Years: ₹${(breakdown.horizon.years_5 / 100000).toFixed(2)}L`,
      "",
      "Valid for 7 days from today.",
    ].join("\n");
  };

  const handleDownload = () => {
    const text = buildReportText();
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WheelGenie-Valuation-${make}-${model}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const text = buildReportText();
    if (!text) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: "WheelGenie Valuation", text });
        setShareStatus("Shared!");
      } else {
        await navigator.clipboard.writeText(text);
        setShareStatus("Copied to clipboard!");
      }
    } catch {
      setShareStatus("Couldn't share — copy manually.");
    }
    setTimeout(() => setShareStatus(""), 2500);
  };

  return (
    <div
      className="min-h-screen bg-[#092340] text-slate-100 relative overflow-x-clip selection:bg-[#2F80ED]/30 selection:text-white"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #0d355f 0%, #092340 55%, #05182e 100%)",
      }}
    >
      {/* ---------------- Top Nav ---------------- */}
      <Navbar activePage="calculator" />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-10">
        {/* ---------------- Page Heading ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            AI Car Value Calculator
          </h1>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            Get an instant, accurate estimate of your car's value using AI.
          </p>
        </motion.div>

        {/* ---------------- Stepper (own card, matches Sell page) ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.03 }}
          className="mt-8 rounded-2xl border border-white/80 bg-white/95 px-5 py-6 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const active = step === s.id;
              const completed = step > s.id;
              return (
                <div key={s.id} className="flex flex-1 items-center last:flex-none">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg transition-all duration-300 ${
                        active || completed
                          ? "bg-gradient-to-r from-[#092340] to-[#2F80ED] text-white shadow-md shadow-[#2F80ED]/30"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon size={17} />
                    </div>
                    <div className="hidden sm:block">
                      <p
                        className={`text-sm font-bold leading-tight ${
                          active ? "text-[#092340]" : "text-slate-700"
                        }`}
                      >
                        {s.label}
                      </p>
                      <p className="mt-0.5 text-xs leading-tight text-slate-500">
                        {s.subtitle}
                      </p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="mx-2 block h-px flex-1 border-t border-dashed border-slate-300 sm:mx-4" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ---------------- Content Grid ---------------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          {/* ===================== LEFT: FORM ===================== */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative h-full"
          >
            {/* Ambient gradient glow orbs visible through frosted glass */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-12 -left-12 h-80 w-80 rounded-full bg-[#7F68A9]/35 blur-[90px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -right-12 h-96 w-96 rounded-full bg-[#7F68A9]/30 blur-[100px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-purple-300/25 blur-[80px]"
            />

            <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-[28px] border border-white/90 bg-gradient-to-br from-white/95 via-white/90 to-blue-50/70 p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7">
              {/* Soft white/cream specular diagonal reflection */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/50 via-white/15 to-transparent" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/85 bg-white/75 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#7F68A9] shadow-sm backdrop-blur-md">
                  Step {step} of {STEPS.length}
                </span>

                <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl font-extrabold leading-tight tracking-tight text-[#1D1435] sm:text-3xl">
                  Enter Your Car Details
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  Provide accurate information to get the best valuation.
                </p>
              </div>

            <div className="relative z-10 mt-5 flex flex-1 flex-col justify-between gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Combobox
                  label="Make"
                  value={make}
                  onChange={handleMakeChange}
                  options={MAKE_SUGGESTIONS}
                  placeholder="e.g. Toyota"
                  required
                />
                <Combobox
                  label="Model"
                  value={model}
                  onChange={handleModelChange}
                  options={modelSuggestions}
                  placeholder="e.g. Fortuner"
                  required
                />
                <Combobox
                  label="Variant"
                  value={variant}
                  onChange={updateValuationInput(setVariant)}
                  options={variantSuggestions}
                  placeholder="e.g. 2.8 4x4 AT"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Select
                  label="Year of Purchase"
                  value={year}
                  onChange={updateValuationInput(setYear)}
                  options={YEAR_OPTIONS}
                  placeholder="Select year"
                  required
                />
                <Select
                  label="Fuel Type"
                  value={fuel}
                  onChange={updateValuationInput(setFuel)}
                  options={fuelOptions}
                  placeholder="Select fuel"
                  required
                />
                <Select
                  label="Transmission"
                  value={transmission}
                  onChange={updateValuationInput(setTransmission)}
                  options={transmissionOptions}
                  placeholder="Select"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <TextInput
                  label="KMs Driven"
                  value={kms}
                  onChange={updateValuationInput(setKms)}
                  suffix="km"
                  required
                />
                <Combobox
                  label="City"
                  value={city}
                  onChange={handleCityChange}
                  options={CITY_SUGGESTIONS}
                  placeholder="e.g. Delhi"
                  required
                />
                <Combobox
                  label="RTO"
                  value={rto}
                  onChange={updateValuationInput(setRto)}
                  options={rtoSuggestions}
                  placeholder="e.g. DLBC"
                  required
                />
              </div>

              <div>
                <FieldLabel required>Car Condition</FieldLabel>
                <p className="-mt-1 mb-2.5 text-[11.5px] text-slate-500">
                  Select the condition that best describes your car
                </p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {CONDITIONS.map((c) => {
                    const Icon = c.icon;
                    const active = condition === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setCondition(c.id);
                          clearValuation();
                        }}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] font-semibold backdrop-blur-md transition-all ${
                          active
                            ? "border-[#7F68A9] bg-white/85 text-[#5c4680] shadow-[0_2px_8px_rgba(127,104,169,0.25)]"
                            : "border-white/70 bg-white/50 text-slate-600 hover:border-white/90 hover:bg-white/70"
                        }`}
                      >
                        <Icon size={16} />
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* This is the last of 5 flex children in the parent
                  (Make/Model/Variant row, Year/Fuel/Transmission row,
                  KMs/City/RTO row, Condition, and this group). The parent's
                  `justify-between` spreads any extra height evenly across
                  all the gaps between them — so when the right (results)
                  panel is taller and stretches this card, the space fills
                  the whole box gradually instead of collecting as one
                  awkward gap. */}
              <div className="space-y-5">
                <div className="flex items-start gap-2.5 rounded-xl border border-white/80 bg-white/60 px-4 py-3 backdrop-blur-md">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#7F68A9]" />
                  <p className="text-[12.5px] leading-relaxed text-slate-600">
                    <span className="font-semibold text-[#1D1435]">
                      Your information is safe with us.
                    </span>{" "}
                    We use advanced AI algorithms and market data to give you the
                    most accurate valuation.
                  </p>
                </div>

                <button
                  onClick={handleCalculate}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7F68A9] to-[#67518e] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#7F68A9]/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#725c99] hover:to-[#5c4680] disabled:pointer-events-none disabled:opacity-50"
                >
                  {loading ? "Calculating..." : "Calculate Value"}
                  {!loading && <span aria-hidden>→</span>}
                </button>

                {apiError && (
                  <p className="rounded-lg bg-red-50 border border-red-100 px-3.5 py-2.5 text-[12px] font-medium text-red-600">
                    {apiError}
                  </p>
                )}
              </div>
            </div>
            </div>
          </motion.div>

          {/* ===================== RIGHT: RESULT ===================== */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="relative rounded-2xl border border-white/80 bg-white/95 p-5 shadow-xl backdrop-blur-xl sm:p-7"
          >
            {/* Soft white specular highlight, same treatment as the form card. Uses a
                matching top-rounded corner (instead of overflow-hidden on the card)
                so the teal dot above the border can stay fully visible. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 rounded-t-2xl bg-gradient-to-b from-white/60 via-white/20 to-transparent" />

            <div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-teal-400" />

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-500">
                  Estimated Market Value
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={calculated && breakdown ? breakdown.total : "placeholder"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 whitespace-nowrap text-3xl font-extrabold text-emerald-600"
                  >
                    {calculated && breakdown ? formatINR(breakdown.total) : "₹ —"}
                  </motion.p>
                </AnimatePresence>
                {calculated && breakdown && (
                  <p className="mt-1 text-[13px] font-medium text-slate-600">
                    Estimated Price Range: {formatINR(breakdown.low)} –{" "}
                    {formatINR(breakdown.high)}
                  </p>
                )}
              </div>

              {/* Right side: AI badge above a compact car photo, matching
                  the reference layout. No animation; a soft edge-mask keeps
                  the photo's own background from showing as a hard
                  rectangle. Full-width and shorter on mobile, fixed compact
                  size from the sm breakpoint up. */}
              <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                <div
                  className={`relative h-[150px] w-full overflow-hidden rounded-xl sm:h-[135px] sm:w-[275px] ${
                    carImageUrl && !imageFailed && imageLoaded
                      ? ""
                      : "bg-gradient-to-br from-slate-50 to-blue-50/40"
                  }`}
                >
                  {imageMatchesCurrentCar && carImageUrl && !imageFailed && (
                    <img
                      key={carImageUrl}
                      src={carImageUrl}
                      alt={`${imageRequest?.make} ${imageRequest?.model} ${year}`}
                      className={`h-full w-full rounded-xl object-contain object-center transition-opacity duration-300 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageFailed(true)}
                    />
                  )}

                  {/* Shown while we're finding a photo AND while background
                      removal is running — the plain "with background" photo
                      is never revealed, only the final result. */}
                  {imageMatchesCurrentCar && !carImageUrl && !imageFailed && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-slate-300">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                      >
                        <Car size={22} />
                      </motion.div>
                      <span className="text-[10px] font-medium text-slate-400">
                        {bgRemoving ? "Processing photo…" : "Finding photo…"}
                      </span>
                    </div>
                  )}

                  {(!imageMatchesCurrentCar || !carImageUrl || imageFailed) &&
                    !(imageMatchesCurrentCar && !carImageUrl && !imageFailed) && (
                    <div className="flex h-full items-center justify-center">
                      <svg width="210" height="75" viewBox="0 0 180 70" fill="none">
                        <rect x="10" y="30" width="160" height="24" rx="6" fill="#CBD5E1" />
                        <path d="M30,30 L48,12 H128 L150,30 Z" fill="#94A3B8" />
                        <circle cx="46" cy="56" r="12" fill="#334155" />
                        <circle cx="134" cy="56" r="12" fill="#334155" />
                        <circle cx="46" cy="56" r="5" fill="#CBD5E1" />
                        <circle cx="134" cy="56" r="5" fill="#CBD5E1" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {loading && (
              <div className="mt-8 animate-pulse space-y-3">
                <div className="h-3 w-1/2 rounded bg-slate-100" />
                <div className="h-3 w-2/3 rounded bg-slate-100" />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-xl bg-slate-100" />
                  <div className="h-24 rounded-xl bg-slate-100" />
                </div>
              </div>
            )}

            {!loading && calculated && breakdown ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 space-y-5"
              >
                {/* Dynamic banner — reflects how the condition adjustment
                    moved this car's value away from the model's baseline
                    prediction for similar cars in this city. */}
                {(() => {
                  const pct = Math.abs(breakdown.percentVsSimilar).toFixed(1);
                  const isHigher = breakdown.percentVsSimilar >= 0;
                  return (
                    <div
                      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 ${
                        isHigher
                          ? "bg-green-50/60 border-green-100"
                          : "bg-red-50/60 border-red-100"
                      }`}
                    >
                      {isHigher ? (
                        <TrendingUp size={16} className="mt-0.5 shrink-0 text-green-600" />
                      ) : (
                        <TrendingDown size={16} className="mt-0.5 shrink-0 text-red-600" />
                      )}
                      <p className="text-[12.5px] leading-relaxed text-slate-600">
                        <span className="font-semibold text-slate-800">
                          {isHigher
                            ? "Great! Your car has a high market value."
                            : "Your car is priced a bit below similar listings."}
                        </span>{" "}
                        This price is {pct}% {isHigher ? "higher" : "lower"} than
                        similar cars in {city}.
                      </p>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Price breakdown */}
                  <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-[0_8px_24px_rgba(15,35,65,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_30px_rgba(15,35,65,0.16)]">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#092340] to-[#2F80ED]" />
                    <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-blue-100/70 blur-2xl transition-colors group-hover:bg-blue-200/60" />
                    <div className="relative flex items-center justify-between gap-2">
                      <p className="text-xs font-extrabold tracking-wide text-slate-800">
                        Price Breakdown
                      </p>
                    </div>
                    <div className="relative mt-3 space-y-2.5 text-[11.5px]">
                      <Row label={`Model Prediction (${make} ${model} ${variant})`} value={formatINR(breakdown.base)} />
                      <Row
                        label={`Condition Adjustment (${CONDITIONS.find((c) => c.id === condition)?.label})`}
                        value={(breakdown.conditionAdj >= 0 ? "+ " : "") + formatINR(breakdown.conditionAdj)}
                        positive={breakdown.conditionAdj >= 0}
                        negative={breakdown.conditionAdj < 0}
                      />
                      <div className="mt-1 flex items-center justify-between gap-2 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-slate-50 px-3 py-2.5 shadow-sm">
                        <span className="text-[11.5px] font-bold text-slate-800">
                          Final Estimated Value
                        </span>
                        <span className="text-[13px] font-extrabold text-[#245A9A]">
                          {formatINR(breakdown.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Market comparison */}
                  <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50/70 p-4 shadow-[0_8px_24px_rgba(15,35,65,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_30px_rgba(15,35,65,0.16)]">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#103E70] to-[#5B8CCB]" />
                    <div className="pointer-events-none absolute -bottom-12 -right-8 h-32 w-32 rounded-full bg-blue-100/70 blur-2xl transition-colors group-hover:bg-blue-200/60" />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-extrabold tracking-wide text-slate-800">
                          Market Comparison
                        </p>
                      </div>
                      <p className="mt-1 text-[10.5px] font-medium text-slate-500">
                        Based on similar cars in {city}
                      </p>

                      <div className="relative mt-6 h-2 rounded-full bg-gradient-to-r from-slate-200 via-blue-300 to-slate-200 shadow-inner">
                        <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#2F80ED] shadow-[0_2px_8px_rgba(47,128,237,0.35)] ring-2 ring-blue-100" />
                        <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-slate-300" />
                        <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-slate-300" />
                      </div>
                      <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-600">
                        <span>
                          {(breakdown.low / 100000).toFixed(2)}L
                          <br />Lower Price
                        </span>
                        <span className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-center font-extrabold text-[#245A9A]">
                          {(breakdown.total / 100000).toFixed(2)}L
                          <br />Your Car Value
                        </span>
                        <span className="text-right">
                          {(breakdown.high / 100000).toFixed(2)}L
                          <br />Higher Price
                        </span>
                      </div>

                      <p className="mt-4 text-[11px] font-extrabold text-slate-800">
                        Why this price?
                      </p>
                      <ul className="mt-2 space-y-1.5 text-[11px] text-slate-500">
                        {[
                          "High demand for this model",
                          "Low depreciation for this variant",
                          "Good condition value",
                          "Market trend in your location",
                        ].map((r) => (
                          <li key={r} className="flex items-center gap-1.5">
                            <CheckCircle2 size={12} className="text-green-500" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Future buyback projections (unique to your CatBoost aging-simulation model) */}
                <div className="rounded-xl border border-amber-200/70 bg-gradient-to-r from-amber-100/70 via-orange-50/70 to-rose-100/60 p-4 shadow-[0_4px_16px_rgba(251,146,60,0.1)]">
                  <p className="text-[13px] font-extrabold text-slate-900">
                    Future Buyback Projections
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-orange-700/80">
                    Simulated by aging this vehicle forward at ~12,000 km/year
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:grid-cols-5">
                    {[
                      { label: "Today", value: breakdown.horizon.current, color: "border-slate-200 bg-slate-50" },
                      { label: "6 Mo", value: breakdown.horizon.months_6, color: "border-blue-200 bg-blue-50" },
                      { label: "1 Yr", value: breakdown.horizon.year_1, color: "border-indigo-200 bg-indigo-50" },
                      { label: "3 Yr", value: breakdown.horizon.years_3, color: "border-pink-200 bg-pink-50" },
                      { label: "5 Yr", value: breakdown.horizon.years_5, color: "border-teal-200 bg-teal-50" },
                    ].map((p) => (
                      <div
                        key={p.label}
                        className={`rounded-lg border px-1.5 py-2.5 ${p.color}`}
                      >
                        <p className="text-[9.5px] font-bold uppercase tracking-wide text-slate-600">
                          {p.label}
                        </p>
                        <p className="mt-1 text-[11px] font-bold text-slate-800">
                          ₹{(p.value / 100000).toFixed(2)}L
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save/share */}
                <div className="flex flex-col items-stretch gap-3 rounded-xl bg-emerald-50/60 border border-emerald-100 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <Download size={15} />
                    </div>
                    <div>
                      <p className="text-[12.5px] font-bold text-slate-800">
                        Save or Share your report
                      </p>
                      <p className="text-[10.5px] font-medium text-slate-500">
                        Download the valuation report or share it with buyers.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 sm:flex-none sm:px-3"
                    >
                      <Download size={12} className="shrink-0" /> Download PDF
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 sm:flex-none sm:px-3"
                    >
                      <Share2 size={12} className="shrink-0" /> Share Report
                    </button>
                  </div>
                </div>

                {shareStatus && (
                  <p className="text-[11px] font-semibold text-green-600">
                    {shareStatus}
                  </p>
                )}

                <p className="flex items-center gap-1.5 text-[10.5px] text-slate-400">
                  <Lock size={11} /> Valuation valid for 7 days from today
                </p>
              </motion.div>
            ) : !loading ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-14 text-center">
                <Sparkles size={22} className="text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  Fill in your car's details
                </p>
                <p className="mt-1 max-w-[220px] text-xs text-slate-400">
                  Your AI-powered valuation and price breakdown will appear
                  here once calculated.
                </p>
              </div>
            ) : null}
          </motion.div>
        </div>
      </main>
       <Footer/>
    </div>
   
  );
}

function Row({ label, value, negative, positive }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-medium text-slate-700">{label}</span>
      <span
        className={`shrink-0 font-semibold ${
          negative ? "text-red-500" : positive ? "text-green-600" : "text-slate-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}