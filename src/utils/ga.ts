import { config } from '@/config';

export function initGoogleAnalytics() {
  if (config.googleAnalytics?.id) {
    (function () {
      const windowsWithDataLayer = window as unknown as {
        dataLayer: any[];
      };
      windowsWithDataLayer.dataLayer = windowsWithDataLayer.dataLayer || [];
      const [f] = document.getElementsByTagName('script');
      const j = document.createElement('script');
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.googleAnalytics.id;
      f.parentNode?.insertBefore(j, f);

      function gtag(...args: any[]) {
        windowsWithDataLayer.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', config.googleAnalytics.id);
    })();
  }
}
