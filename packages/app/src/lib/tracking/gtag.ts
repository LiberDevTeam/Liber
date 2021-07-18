export default class GtagWrapper {
  private measurementId: string;
  private gtag: Gtag.Gtag;
  private beforePath = '';

  constructor(measurementId: string) {
    this.measurementId = measurementId;
    if (window?.gtag) {
      this.gtag = window.gtag;
    } else {
      // gtag.jsが未設置の場合はログのみを吐く関数をセット
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.gtag = (command: any, param1: any, param2?: any) => {
        console.info(
          'gtag.js is not found and cannot send event',
          `Command:${command}`,
          `Param1:${param1}`,
          `Param2:${param2}`
        );
      };
      console.error('gtag.js is not found');
    }
  }

  private isDeplicatedPath = (path: string) => path === this.beforePath;

  public viewPage = (pagePath: string): void => {
    if (this.isDeplicatedPath(pagePath)) return;
    this.beforePath = pagePath;
    this.gtag('config', this.measurementId, { page_path: pagePath });
  };

  // イベント送信
  public sendEvent = (
    eventName: string,
    eventParams?: Gtag.ControlParams | Gtag.EventParams | Gtag.CustomParams
  ): void => {
    this.gtag('event', eventName, eventParams);
  };

  // setコマンド後にイベント送信
  public sendEventBeforeSet = (
    params: Gtag.CustomParams,
    eventName: string,
    eventParams?: Gtag.ControlParams | Gtag.EventParams | Gtag.CustomParams
  ): void => {
    this.gtag('set', params);
    this.sendEvent(eventName, eventParams);
  };
}
