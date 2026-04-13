const STORAGE_KEY = 'kb-year-pwa-install-toast-snooze-until';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function shouldShowPwaInstallToast() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return true;
  const until = parseInt(raw, 10);
  if (Number.isNaN(until)) return true;
  return Date.now() >= until;
}

export function snoozePwaInstallToastOneDay() {
  localStorage.setItem(STORAGE_KEY, String(Date.now() + ONE_DAY_MS));
}
