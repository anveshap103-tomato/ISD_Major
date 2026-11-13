import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

/**
 * Open an external HTTP(S) URL in a native browser surface on mobile and use
 * the anchor's normal target behavior on the web.
 */
export const openExternalUrl = async (url, event = null) => {
  if (!url || !/^https?:\/\//i.test(url)) return;

  if (Capacitor.isNativePlatform()) {
    event?.preventDefault?.();
    try {
      await Browser.open({ url });
    } catch (error) {
      console.warn('Capacitor Browser.open failed:', error?.message);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
};
