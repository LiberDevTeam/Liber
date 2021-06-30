export {};

declare global {
  interface Window {
    gtag: Gtag.Gtag;
    __WB_DISABLE_DEV_LOGS: boolean;
  }
}
