import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, ChevronDown, Loader2 } from "lucide-react";
import { useUserLocation } from "../context/LocationContext";
import LocationPermission from "../components/common/LocationPermission";

import SellProgress from "../components/sell/SellProgress";
import CarDetailsForm from "../components/sell/CarDetailsForm";
import SellPriceSidebar from "../components/sell/SellPriceSidebar";
import SellBenefits from "../components/sell/SellBenefits";
import useSellCarForm from "../hooks/useSellCarForm";

const Sell = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const { city, isLocating } = useUserLocation();

  const handleStepAdvance = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const {
    formData,
    formErrors,
    makes,
    loadingMakes,
    makesError,
    models,
    loadingModels,
    modelsError,
    variants,
    loadingVariants,
    variantsError,
    valuation,
    valuationLoading,
    valuationError,
    saveStatus,
    setMake,
    setModel,
    setVariant,
    updateField,
    searchMakes,
    searchModels,
    handleSaveAndContinue,
    handleSaveAndExit,
  } = useSellCarForm(handleStepAdvance);

  return (
    <div
      className="min-h-screen bg-[#092340] text-slate-100 relative overflow-hidden selection:bg-[#2F80ED]/30 selection:text-white"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #0d355f 0%, #092340 55%, #05182e 100%)",
      }}
    >
      <Navbar activePage="sell" />

      <main>
        {/* PAGE HEADER */}
        <section className="mx-auto w-full max-w-[1440px] px-5 pb-5 pt-8 sm:px-8 lg:px-12 lg:pt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Sell Your Car
              </h1>

              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                List your car in minutes and reach thousands of buyers.
              </p>
            </div>

            {/* LOCATION BADGE / MODAL TRIGGER */}
            <div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="group flex w-fit items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 shadow-sm transition hover:border-[#2F80ED] hover:bg-white/15 backdrop-blur-md cursor-pointer text-left"
                title="Click to view and change your location"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-[#38BDF8] group-hover:bg-blue-500/30 transition-colors">
                  {isLocating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-[120px]">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                    Your Location
                  </p>

                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-white truncate max-w-[130px]">
                      {isLocating ? "Detecting..." : city || "Select City"}
                    </p>
                    <ChevronDown
                      size={14}
                      className="text-slate-300 group-hover:text-[#38BDF8] transition-colors"
                    />
                  </div>
                </div>
              </button>

              {/* Location Permission & City Selector Modal */}
              <LocationPermission
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
              />
            </div>
          </div>
        </section>

        {/* PROGRESS */}
        <section className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SellProgress currentStep={currentStep} />
        </section>

        {/* MAIN CONTENT */}
        <section className="mx-auto w-full max-w-[1440px] px-5 py-5 sm:px-8 lg:px-12 lg:py-6">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2.15fr)_minmax(340px,0.95fr)]">
            {currentStep === 1 ? (
              <CarDetailsForm
                formData={formData}
                formErrors={formErrors}
                makes={makes}
                loadingMakes={loadingMakes}
                makesError={makesError}
                models={models}
                loadingModels={loadingModels}
                modelsError={modelsError}
                variants={variants}
                loadingVariants={loadingVariants}
                variantsError={variantsError}
                saveStatus={saveStatus}
                setMake={setMake}
                setModel={setModel}
                setVariant={setVariant}
                updateField={updateField}
                searchMakes={searchMakes}
                searchModels={searchModels}
                onSaveContinue={handleSaveAndContinue}
                onSaveExit={handleSaveAndExit}
              />
            ) : (
              <div className="rounded-2xl border border-white/80 bg-white/95 p-8 shadow-xl backdrop-blur-xl flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="h-16 w-16 rounded-full bg-blue-50 text-[#247CF0] flex items-center justify-center text-2xl font-bold mb-4">
                  {currentStep}
                </div>
                <h3 className="text-xl font-bold text-[#092340]">
                  {currentStep === 2 && "Step 2: Upload Photos"}
                  {currentStep === 3 && "Step 3: Pricing & Valuation"}
                  {currentStep === 4 && "Step 4: Contact Details"}
                  {currentStep === 5 && "Step 5: Review & Publish"}
                </h3>
                <p className="mt-2 text-sm text-slate-600 max-w-md">
                  Vehicle details for{" "}
                  <span className="font-semibold text-slate-700">
                    {[formData?.make?.name, formData?.model?.name, formData?.variant?.name]
                      .filter(Boolean)
                      .join(" ") || "your car"}
                  </span>{" "}
                  have been saved in your draft.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    ← Back to Car Details
                  </button>
                  {currentStep < 5 && (
                    <button
                      type="button"
                      onClick={handleStepAdvance}
                      className="rounded-xl bg-gradient-to-r from-[#092340] via-[#103E70] to-[#2F80ED] px-5 py-2.5 text-sm font-semibold text-white hover:from-[#0B2E54] hover:to-[#256DD6] shadow-md transition cursor-pointer"
                    >
                      Next Step →
                    </button>
                  )}
                </div>
              </div>
            )}

            <SellPriceSidebar
              formData={formData}
              valuation={valuation}
              valuationLoading={valuationLoading}
              valuationError={valuationError}
              onEdit={() => {
                setCurrentStep(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </section>

        {/* BENEFITS */}
        <section className="mx-auto w-full max-w-[1440px] px-5 pb-10 sm:px-8 lg:px-12">
          <SellBenefits />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;