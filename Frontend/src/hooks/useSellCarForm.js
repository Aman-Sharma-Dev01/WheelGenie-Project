import { useState, useEffect, useRef, useCallback } from "react";
import { getMakes, getModels, getVariants } from "../services/vehicleApi";
import { getValuation } from "../services/valuationApi";
import { saveListingDraft, getListingDraft } from "../services/listingService";
import { useUserLocation } from "../context/LocationContext";

const INITIAL_FORM_DATA = {
  make: null, // { id, name, logo }
  model: null, // { id, name, imageUrl }
  variant: null, // { id, name, fuelType, transmission, imageUrl }
  yearOfPurchase: "",
  fuelType: "",
  transmission: "",
  kilometersDriven: "",
  registrationCity: "",
  registrationYear: "",
  condition: "Excellent",
  vehicleImage: null,
};

const getInitialState = (userCity) => {
  const draft = getListingDraft();
  if (draft) {
    return {
      formData: {
        make: draft.vehicle?.makeName
          ? { id: draft.vehicle.makeId, name: draft.vehicle.makeName }
          : null,
        model: draft.vehicle?.modelName
          ? { id: draft.vehicle.modelId, name: draft.vehicle.modelName }
          : null,
        variant: draft.vehicle?.variantName
          ? { id: draft.vehicle.variantId, name: draft.vehicle.variantName }
          : null,
        yearOfPurchase: draft.details?.yearOfPurchase
          ? String(draft.details.yearOfPurchase)
          : "",
        fuelType: draft.details?.fuelType || "",
        transmission: draft.details?.transmission || "",
        kilometersDriven:
          draft.details?.kilometersDriven !== undefined &&
          draft.details?.kilometersDriven !== null
            ? String(draft.details.kilometersDriven)
            : "",
        registrationCity: draft.details?.registrationCity || userCity || "",
        registrationYear: draft.details?.registrationYear
          ? String(draft.details.registrationYear)
          : "",
        condition: draft.details?.condition || "Excellent",
        vehicleImage: draft.vehicle?.imageUrl || null,
      },
      valuation: draft.valuation || null,
    };
  }
  return {
    formData: {
      ...INITIAL_FORM_DATA,
      registrationCity: userCity || "",
    },
    valuation: null,
  };
};

export function useSellCarForm(onStepAdvance) {
  const { city: userCity } = useUserLocation();

  const [initialState] = useState(() => getInitialState(userCity));
  const [formData, setFormData] = useState(initialState.formData);
  const [formErrors, setFormErrors] = useState({});

  // Dynamic API options
  const [makes, setMakes] = useState([]);
  const [loadingMakes, setLoadingMakes] = useState(true);
  const [makesError, setMakesError] = useState(null);

  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState(null);

  const [variants, setVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [variantsError, setVariantsError] = useState(null);

  // Valuation state
  const [valuation, setValuation] = useState(initialState.valuation);
  const [valuationLoading, setValuationLoading] = useState(false);
  const [valuationError, setValuationError] = useState(null);

  // Save feedback state
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // 1. Initial Data Load & Option Hydration
  useEffect(() => {
    let isMounted = true;

    getMakes().then((res) => {
      if (!isMounted) return;
      setLoadingMakes(false);
      if (res.success) {
        setMakes(res.data);
      } else {
        setMakesError(res.error || "Unable to load vehicle makes.");
      }
    });

    // Rehydrate models and variants if draft contained make and model
    if (formData.make?.name) {
      getModels(formData.make.name).then((mRes) => {
        if (isMounted && mRes.success) setModels(mRes.data);
      });
    }
    if (formData.make?.name && formData.model?.name) {
      getVariants(formData.make.name, formData.model.name).then((vRes) => {
        if (isMounted && vRes.success) setVariants(vRes.data);
      });
    }

    return () => {
      isMounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Synchronize userCity with form if city not manually selected
  useEffect(() => {
    if (!userCity) return;
    const timer = setTimeout(() => {
      setFormData((prev) =>
        prev.registrationCity ? prev : { ...prev, registrationCity: userCity }
      );
    }, 0);
    return () => clearTimeout(timer);
  }, [userCity]);

  // 2. Dependent Dropdown Handlers
  const handleMakeChange = useCallback(async (selectedMake) => {
    if (!selectedMake) return;

    // Reset Model, Variant, and valuation
    setFormData((prev) => ({
      ...prev,
      make: selectedMake,
      model: null,
      variant: null,
      vehicleImage: selectedMake.logo || null,
    }));
    setFormErrors((prev) => ({ ...prev, make: null, model: null, variant: null }));
    setValuation(null);
    setValuationError(null);

    // Fetch models for newly selected make
    setLoadingModels(true);
    setModelsError(null);
    setModels([]);
    setVariants([]);

    const res = await getModels(selectedMake.name);
    setLoadingModels(false);
    if (res.success) {
      setModels(res.data);
    } else {
      setModelsError(res.error || "Unable to load models for this make.");
    }
  }, []);

  const handleModelChange = useCallback(
    async (selectedModel) => {
      if (!selectedModel || !formData.make) return;

      // Reset Variant and clear previous valuation
      setFormData((prev) => ({
        ...prev,
        model: selectedModel,
        variant: null,
        vehicleImage: selectedModel.imageUrl || prev.vehicleImage,
        fuelType: selectedModel.fuelType || prev.fuelType,
        transmission: selectedModel.transmission || prev.transmission,
      }));
      setFormErrors((prev) => ({ ...prev, model: null, variant: null }));
      setValuation(null);
      setValuationError(null);

      // Fetch variants for make + model
      setLoadingVariants(true);
      setVariantsError(null);
      setVariants([]);

      const res = await getVariants(formData.make.name, selectedModel.name);
      setLoadingVariants(false);
      if (res.success) {
        setVariants(res.data);
      } else {
        setVariantsError(res.error || "Unable to load variants for this model.");
      }
    },
    [formData.make]
  );

  const handleVariantChange = useCallback((selectedVariant) => {
    if (!selectedVariant) return;

    setFormData((prev) => ({
      ...prev,
      variant: selectedVariant,
      fuelType: selectedVariant.fuelType || prev.fuelType,
      transmission: selectedVariant.transmission || prev.transmission,
      vehicleImage: selectedVariant.imageUrl || prev.vehicleImage,
    }));
    setFormErrors((prev) => ({ ...prev, variant: null }));
    setValuation(null);
  }, []);

  // Update generic field with validation
  const updateField = useCallback((field, value) => {
    setFormData((prev) => {
      let cleaned = value;

      // Validation for Kilometers: numeric only, no negative numbers
      if (field === "kilometersDriven") {
        const numOnly = String(value).replace(/[^0-9]/g, "");
        cleaned = numOnly ? Math.max(0, parseInt(numOnly, 10)) : "";
      }

      return { ...prev, [field]: cleaned };
    });

    // Clear error for that field
    setFormErrors((prev) => ({ ...prev, [field]: null }));
    setSaveStatus(null);
  }, []);

  // Search makes on typing
  const searchMakes = useCallback(async (query) => {
    setLoadingMakes(true);
    setMakesError(null);
    const res = await getMakes(query);
    setLoadingMakes(false);
    if (res.success) {
      setMakes(res.data);
    } else {
      setMakesError(res.error || "Unable to search vehicle makes.");
    }
  }, []);

  // Search models on typing
  const searchModels = useCallback(
    async (query) => {
      if (!formData.make) return;
      setLoadingModels(true);
      setModelsError(null);
      const res = await getModels(formData.make.name, query);
      setLoadingModels(false);
      if (res.success) {
        setModels(res.data);
      } else {
        setModelsError(res.error || "Unable to search models.");
      }
    },
    [formData.make]
  );

  // 3. Debounced Valuation Calculation
  const valuationTimerRef = useRef(null);

  useEffect(() => {
    // Check if enough information exists for valuation
    const hasEnoughInfo =
      formData.make?.name &&
      formData.model?.name &&
      formData.variant?.name &&
      formData.yearOfPurchase &&
      formData.kilometersDriven &&
      formData.fuelType &&
      formData.transmission &&
      formData.registrationCity &&
      formData.registrationYear &&
      formData.condition;

    if (!hasEnoughInfo) {
      return;
    }

    if (valuationTimerRef.current) {
      clearTimeout(valuationTimerRef.current);
    }

    valuationTimerRef.current = setTimeout(async () => {
      setValuationLoading(true);
      setValuationError(null);

      const res = await getValuation({
        make: formData.make.name,
        model: formData.model.name,
        variant: formData.variant.name,
        year: formData.yearOfPurchase,
        mileage: formData.kilometersDriven,
        condition: formData.condition,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        city: formData.registrationCity,
      });

      setValuationLoading(false);
      if (res.success) {
        setValuation(res.data);
      } else {
        setValuation(null);
        setValuationError(res.error || "Unable to calculate estimate");
      }
    }, 500);

    return () => {
      if (valuationTimerRef.current) {
        clearTimeout(valuationTimerRef.current);
      }
    };
  }, [
    formData.make,
    formData.model,
    formData.variant,
    formData.yearOfPurchase,
    formData.kilometersDriven,
    formData.fuelType,
    formData.transmission,
    formData.registrationCity,
    formData.registrationYear,
    formData.condition,
  ]);

  // 4. Save & Continue Handler
  const handleSaveAndContinue = useCallback(() => {
    const errors = {};

    if (!formData.make?.name) errors.make = "Please select Make";
    if (!formData.model?.name) errors.model = "Please select Model";
    if (!formData.variant?.name) errors.variant = "Please select Variant";
    if (!formData.yearOfPurchase) errors.yearOfPurchase = "Please select Year of Purchase";
    if (!formData.fuelType) errors.fuelType = "Please select Fuel Type";
    if (!formData.transmission) errors.transmission = "Please select Transmission";
    if (!formData.kilometersDriven && formData.kilometersDriven !== 0) {
      errors.kilometersDriven = "Please enter Kilometers";
    }
    if (!formData.registrationCity) errors.registrationCity = "Please select Registration City";
    if (!formData.registrationYear) errors.registrationYear = "Please select Registration Year";
    if (!formData.condition) errors.condition = "Please select Car Condition";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSaveStatus({
        type: "error",
        message: "Please fill in all required fields before continuing.",
      });
      return false;
    }

    // Build backend-ready payload
    const payload = {
      vehicle: {
        makeId: formData.make.id,
        makeName: formData.make.name,
        modelId: formData.model.id,
        modelName: formData.model.name,
        variantId: formData.variant.id,
        variantName: formData.variant.name,
        imageUrl: formData.vehicleImage,
      },
      details: {
        yearOfPurchase: Number(formData.yearOfPurchase),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        kilometersDriven: Number(formData.kilometersDriven),
        registrationCity: formData.registrationCity,
        registrationYear: Number(formData.registrationYear),
        condition: formData.condition,
      },
      valuation: valuation
        ? {
            minPrice: valuation.minPrice,
            maxPrice: valuation.maxPrice,
            marketValue: valuation.marketValue,
            currency: valuation.currency,
          }
        : null,
    };

    // Save draft for backend boundary
    saveListingDraft(payload);

    setFormErrors({});
    if (onStepAdvance) onStepAdvance(payload);
    return true;
  }, [formData, valuation, onStepAdvance]);

  // 5. Save & Exit Handler
  const handleSaveAndExit = useCallback(async () => {
    const payload = {
      vehicle: {
        makeId: formData.make?.id || null,
        makeName: formData.make?.name || null,
        modelId: formData.model?.id || null,
        modelName: formData.model?.name || null,
        variantId: formData.variant?.id || null,
        variantName: formData.variant?.name || null,
        imageUrl: formData.vehicleImage || null,
      },
      details: {
        yearOfPurchase: formData.yearOfPurchase ? Number(formData.yearOfPurchase) : null,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        kilometersDriven: formData.kilometersDriven !== "" ? Number(formData.kilometersDriven) : null,
        registrationCity: formData.registrationCity,
        registrationYear: formData.registrationYear ? Number(formData.registrationYear) : null,
        condition: formData.condition,
      },
      valuation: valuation || null,
    };

    const res = await saveListingDraft(payload);
    if (res.success) {
      setSaveStatus({
        type: "success",
        message: "Your progress has been saved! You can safely leave and return at any time.",
      });
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus({
        type: "error",
        message: "Failed to save draft locally.",
      });
    }
  }, [formData, valuation]);

  return {
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
    setMake: handleMakeChange,
    setModel: handleModelChange,
    setVariant: handleVariantChange,
    updateField,
    searchMakes,
    searchModels,
    handleSaveAndContinue,
    handleSaveAndExit,
  };
}

export default useSellCarForm;
