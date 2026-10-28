// The landing intro plays on the homepage only, once, then not again on this device for a day.
// Preloader.tsx saves the time it started; layout.tsx reads it before the page is drawn.
export const INTRO_SEEN_KEY = "globus-intro-seen";
export const INTRO_REPLAY_AFTER_MS = 24 * 60 * 60 * 1000; // 24 hours
