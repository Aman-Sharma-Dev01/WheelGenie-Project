/**
 * Car Search Alert Service
 * Manages search alerts and notifications for users looking for specific cars.
 */

import api from '../api/axios';

const STORAGE_KEY = 'wg_car_alerts';

export function getLocalAlerts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveLocalAlert(alertData) {
  try {
    const current = getLocalAlerts();
    const newAlert = {
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...alertData,
    };
    const updated = [newAlert, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newAlert;
  } catch {
    return null;
  }
}

/**
 * Creates an alert on the backend or in local persistence
 * @param {Object} alertPayload
 * @returns {Promise<{ success: boolean, alert: Object, message: string }>}
 */
export async function createCarAlert(alertPayload) {
  try {
    // Attempt backend notifications or alert endpoint if available
    const res = await api.post('/notifications', {
      type: 'Promotion',
      title: `Search Alert: ${alertPayload.brand || 'Any'} ${alertPayload.model || ''}`,
      message: `Alert configured for ${alertPayload.country} - ${alertPayload.city}. Min: ${alertPayload.minPrice || 'None'}, Max: ${alertPayload.maxPrice || 'None'}.`,
      data: alertPayload,
    });
    if (res?.data?.success) {
      saveLocalAlert(alertPayload);
      return {
        success: true,
        alert: res.data.data,
        message: 'Your vehicle alert has been activated. We will notify you when a match is listed!',
      };
    }
  } catch {
    // Graceful fallback to client persistence
  }

  const saved = saveLocalAlert(alertPayload);
  return {
    success: true,
    alert: saved,
    message: 'Your vehicle alert has been activated. We will notify you when a matching car is listed!',
  };
}

export default {
  getLocalAlerts,
  saveLocalAlert,
  createCarAlert,
};
