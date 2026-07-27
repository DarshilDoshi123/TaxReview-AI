import api from '../services/api';

let isTrackedInThisLoad = false;

/**
 * Tracks website visit once per full browser page load.
 * Prevents re-tracking during React Router client-side page navigation.
 */
export const trackVisitOnLoad = () => {
  if (!isTrackedInThisLoad) {
    isTrackedInThisLoad = true;
    api.visits.track().catch((err) => {
      console.warn('Website visit tracking error:', err.message);
    });
  }
};
