import sellCar from "../../assets/car.png";

const SellPriceSidebar = () => {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-white p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#0B1F3A]">
              Estimated Selling Price
            </h3>

            <span className="text-xs text-slate-400">ⓘ</span>
          </div>

          <p className="mt-2 text-2xl font-extrabold text-green-600">
            ₹7,85,000 - ₹8,65,000
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Expected offers based on your vehicle details
          </p>
        </div>

        <div className="mt-4 flex h-[170px] items-center justify-center overflow-hidden rounded-xl bg-white">
          <img
            src={sellCar}
            alt="Vehicle"
            className="h-full w-full object-contain"
          />
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#0B1F3A]">
              Hyundai i20 Asta (O)
            </h4>

            <button className="text-xs font-semibold text-green-600 hover:underline">
              Edit ✎
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            2021 • Petrol • Automatic
          </p>

          <p className="mt-1 text-xs text-slate-500">
            20,000 km • Your Location • First Owner
          </p>
        </div>

        <div className="mt-4 rounded-xl bg-green-50 p-3">
          <div className="flex gap-2">
            <span className="text-green-600">↗</span>

            <div>
              <p className="text-xs font-bold text-[#0B1F3A]">
                Tip: Complete your listing
              </p>

              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                Cars with complete details and good photos get better
                responses.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-blue-50 p-4">
          <h4 className="text-sm font-bold text-[#0B1F3A]">
            What's Next?
          </h4>

          <p className="mt-2 text-xs leading-5 text-slate-600">
            Add photos of your car, set your expected price and publish your
            listing.
          </p>

          <div className="mt-4 space-y-3">
            <p className="flex gap-2 text-xs text-[#0B1F3A]">
              <span className="text-[#247CF0]">✓</span>
              Reach thousands of genuine buyers
            </p>

            <p className="flex gap-2 text-xs text-[#0B1F3A]">
              <span className="text-[#247CF0]">✓</span>
              Get the best price for your car
            </p>

            <p className="flex gap-2 text-xs text-[#0B1F3A]">
              <span className="text-[#247CF0]">✓</span>
              Safe & secure transactions
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SellPriceSidebar;