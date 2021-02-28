import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import GtagWrapper from '~/lib/tracking/gtag';
import { selectMe } from '~/state/ducks/me/meSlice';

type GenerateFromStrProps = {
  __html: string; // 埋め込むHTML文字列
  callback?: () => void; // 埋め込んだDOMが変更された時のCallback関数
};

const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || '';

const GaDomStr = `
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  </script>
`;

// DOM化後にscriptも発火させる細工をするコンポーネント
// 参考: https://zenn.dev/akira_miyake/articles/0f5a00b035f9fe2d93e2
const GenerateFromStr: React.FC<GenerateFromStrProps> = ({
  __html,
  callback,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    (async () => {
      if (!ref?.current || !document || !__html) return;

      // 文字列内のscriptタグとその中身を取得
      const scriptStrings =
        __html.match(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi) ||
        [];
      let updatedHtmlString = __html;

      await scriptStrings.reduce(async (accm, scriptString) => {
        await accm;

        // innerHTMLではXSS対策でscriptタグが実行されないので、createContextualFragmentを用いる
        // ここで生成したscriptElementはelement.srcの確認と該当HTMLのheadタグ移設にのみ使用
        const scriptFragment = document
          .createRange()
          .createContextualFragment(scriptString);
        const scriptElement = scriptFragment.querySelector('script');

        if (!scriptElement || scriptElement.src === '') {
          // 外部srcなscriptタグではない場合はそのままresolveする
          return Promise.resolve();
        } else {
          // 外部srcなscriptタグはheadタグに移動して、既存のタグからは撤去
          updatedHtmlString = updatedHtmlString.replace(scriptString, '');

          // 既に吐かれたDOMの中のscriptタグと同じsrcがある場合はresolveする(重複読み込み防止)
          if (
            Array.from(document.querySelectorAll('script')).some(
              (element) => element.src === scriptElement.src
            )
          ) {
            return Promise.resolve();
          }

          // scriptタグのsrc読み込みが終わったらresolveするイベントを付けて、headタグに埋め込むPromiseを返す
          return new Promise((resolve) => {
            scriptElement.addEventListener('load', () => resolve());
            document.head.appendChild(scriptElement);
          });
        }
      }, Promise.resolve());

      // innerHTMLではXSS対策でscriptタグが実行されないので、createContextualFragmentを用いる
      const fragment = document
        .createRange()
        .createContextualFragment(updatedHtmlString);

      ref.current.appendChild(fragment);
      if (callback) callback();
    })();
  }, [__html, callback]);

  return <div ref={ref} />;
};

type TrackerContextState = {
  tracker: GtagWrapper | null;
};

const initialContextState: TrackerContextState = {
  tracker: null,
};

const TrackerContext = createContext<TrackerContextState>(initialContextState);

export const TrackerProvider: React.FC = ({ children }) => {
  const [tracker, setTracker] = useState<GtagWrapper | null>(null);
  const [isFirstView, setIsFirstView] = useState<boolean>(true);
  const location = useLocation();
  const me = useSelector(selectMe);

  const isIsolation = useMemo(() => me.settings.isIsolation, [
    me.settings.isIsolation,
  ]);

  const handleMounted = useCallback(
    () => setTracker(new GtagWrapper(GA_MEASUREMENT_ID)),
    []
  );

  const TrackingTags = useMemo<JSX.Element>(
    () => (
      <GenerateFromStr
        __html={isIsolation ? '' : GaDomStr}
        callback={handleMounted}
      />
    ),
    [isIsolation, handleMounted]
  );

  // trackerオブジェクト初期化完了後、ページ遷移時にページ遷移イベントを送信するイベントを組み込み
  useEffect(() => {
    if (!tracker) return;
    tracker.viewPage(location.pathname);
    setIsFirstView(false);
  }, [tracker, location.pathname, isFirstView]);

  return (
    <TrackerContext.Provider
      value={{
        tracker,
      }}
    >
      {TrackingTags}
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = (): TrackerContextState => useContext(TrackerContext);
