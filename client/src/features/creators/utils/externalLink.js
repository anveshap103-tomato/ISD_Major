import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

/**
 * Open an external HTTP/HTTPS URL reliably across Web and Capacitor Android.
 * On native Android/iOS, opens in Android Custom Tabs / SFSafariViewController via @capacitor/browser
 * so the user stays inside the app flow with a native Back/Close button.
 * On web, allows standard <a target="_blank" rel="noopener noreferrer"> behavior.
 *
 * @param {string} url - External http(s) URL
 * @param {Event} [event] - Optional click event
 */
export const openExternalUrl = async (url, event = null) => {
  if (!url || !/^https?:\/\//i.test(url)) return;

  if (Capacitor.isNativePlatform()) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    try {
      await Browser.open({ url });
    } catch (err) {
      console.warn('Capacitor Browser.open failed, falling back to window.open:', err?.message);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
};

