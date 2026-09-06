import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import SellProgress from "../components/sell/SellProgress";
import CarDetailsForm from "../components/sell/CarDetailsForm";
import SellPriceSidebar from "../components/sell/SellPriceSidebar";
import SellBenefits from "../components/sell/SellBenefits";

const Sell = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleContinue = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-[#0B1F3A]">
      <Navbar />

      <main>
        {/* PAGE HEADER */}
        <section className="mx-auto w-full max-w-[1440px] px-5 pb-5 pt-8 sm:px-8 lg:px-12 lg:pt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl">
                Sell Your Car
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                List your car in minutes and reach thousands of buyers.
              </p>
            </div>

            {/* LOCATION */}
            <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#247CF0]">
                📍
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Your Location
                </p>

                <p className="text-sm font-bold text-[#0B1F3A]">
                  Detecting location...
                </p>
              </div>
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
            <CarDetailsForm onContinue={handleContinue} />

            <SellPriceSidebar />
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