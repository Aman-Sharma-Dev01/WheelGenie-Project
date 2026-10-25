/**
 * Listing Service (Frontend Draft Boundary)
 * 
 * Manages the client-side draft persistence for the Sell Car workflow.
 * This serves as the integration boundary where the backend team can connect
 * their dedicated API endpoint (e.g., POST /api/v1/listings/draft) without
 * changing any UI components.
 */

const STORAGE_KEY = 'wg_sell_car_draft';

/**
 * Saves a listing draft to localStorage (and prepares it for the backend API).
 * @param {Object} payload
 * @returns {Promise<{ success: boolean, draft: Object, message: string }>}
 */
export async function saveListingDraft(payload) {
  try {
    const draftData = {
      ...payload,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));

    // NOTE FOR BACKEND TEAM:
    // When your microservice is ready, connect your endpoint here:
    // await api.post('/listings/draft', draftData);

    return {
      success: true,
      draft: draftData,
      message: 'Draft saved successfully.',
    };
  } catch (err) {
    console.error('saveListingDraft error:', err);
    return {
      success: false,
      draft: payload,
      message: 'Failed to save draft to local storage.',
    };
  }
}

/**
 * Retrieves the saved listing draft from local storage.
 * @returns {Object|null}
 */
export function getListingDraft() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('getListingDraft error:', err);
    return null;
  }
}

/**
 * Clears the saved listing draft.
 */
export function clearListingDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('clearListingDraft error:', err);
  }
}

export default {
  saveListingDraft,
  getListingDraft,
  clearListingDraft,
};
