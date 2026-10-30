import { useState } from "react";
import sellCar from "../../assets/car.png";
import { useUserLocation } from "../../context/LocationContext";

const SellPriceSidebar = ({
  formData,
  valuation,
  valuationLoading = false,
  valuationError = null,
  onEdit,
}) => {
  const { city: userCity } = useUserLocation();
  const [imgError, setImgError] = useState(false);

  // Compute vehicle title
  const vehicleTitle = [
    formData?.make?.name,
    formData?.model?.name,
    formData?.variant?.name,
  ]
    .filter(Boolean)
    .join(" ");

  const hasVehicleSelection = Boolean(formData?.make?.name || formData?.model?.name);

  // Vehicle image fallback
  const vehicleImage = !imgError && formData?.vehicleImage ? formData.vehicleImage : sellCar;

  // Subtitles
  const yearText = formData?.yearOfPurchase || "Year";
  const fuelText = formData?.fuelType || "Fuel";
  const transText = formData?.transmission || "Transmission";

  const mileageText =
    formData?.kilometersDriven !== undefined && formData?.kilometersDriven !== ""
      ? `${Number(formData.kilometersDriven).toLocaleString("en-IN")} km`
      : "- km";

  const cityText = formData?.registrationCity || userCity || "Your Location";

  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-white/80 bg-white/95 p-5 shadow-xl sm:p-6 backdrop-blur-xl">
        {/* Estimated Price Block */}
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-white p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#092340]">
              Estimated Selling Price
            </h3>

            <span className="text-xs text-slate-400" title="Based on real-time market trends and vehicle specifications">
              ?
            </span>
          </div>

          {valuationLoading ? (
            <p className="mt-2 text-lg font-bold text-[#247CF0] animate-pulse">
              Calculating estimated price...
            </p>
          ) : valuationError ? (
            <p className="mt-2 text-sm font-bold text-amber-600">
              {valuationError}
            </p>
          ) : valuation && valuation.formattedRange ? (
            <p className="mt-2 text-2xl font-extrabold text-green-600">
              {valuation.formattedRange}
            </p>
          ) : (
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Enter vehicle details for estimate
            </p>
          )}

          <p className="mt-1 text-xs text-slate-500">
            Expected offers based on your vehicle details
          </p>
        </div>

        {/* Vehicle Image Container */}
        <div className="mt-4 flex h-[170px] items-center justify-center overflow-hidden rounded-xl bg-white">
          <img
            src={vehicleImage}
            alt={vehicleTitle || "Vehicle"}
            onError={() => setImgError(true)}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Vehicle Summary Details */}
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#092340] truncate max-w-[210px]">
              {hasVehicleSelection ? vehicleTitle : "Select your vehicle details"}
            </h4>

            {hasVehicleSelection && (
              <button
                type="button"
                onClick={onEdit}
                className="text-xs font-semibold text-[#2F80ED] hover:underline cursor-pointer"
              >
                Edit →
              </button>
            )}
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {yearText} • {fuelText} • {transText}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {mileageText} • {cityText} • First Owner
          </p>
        </div>

        {/* Tip Box */}
        <div className="mt-4 rounded-xl bg-emerald-50/80 border border-emerald-100 p-3">
          <div className="flex gap-2">
            <span className="text-emerald-600 font-bold">💡</span>

            <div>
              <p className="text-xs font-bold text-[#092340]">
                Tip: Complete your listing
              </p>

              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                Cars with complete details and good photos get better
                responses.
              </p>
            </div>
          </div>
        </div>

        {/* What's Next Box */}
        <div className="mt-4 rounded-xl bg-blue-50/70 border border-blue-100 p-4">
          <h4 className="text-sm font-bold text-[#092340]">
            What's Next?
          </h4>

          <p className="mt-2 text-xs leading-5 text-slate-600">
            Add photos of your car, set your expected price and publish your
            listing.
          </p>

          <div className="mt-4 space-y-3">
            <p className="flex items-center gap-2 text-xs text-[#092340] font-medium">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2F80ED] text-[10px] text-white">✓</span>
              Reach thousands of genuine buyers
            </p>

            <p className="flex items-center gap-2 text-xs text-[#092340] font-medium">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2F80ED] text-[10px] text-white">✓</span>
              Get the best price for your car
            </p>

            <p className="flex items-center gap-2 text-xs text-[#092340] font-medium">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2F80ED] text-[10px] text-white">✓</span>
              Safe & secure transactions
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SellPriceSidebar;
