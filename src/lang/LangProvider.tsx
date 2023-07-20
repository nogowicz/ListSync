import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IntlProvider } from 'react-intl';
import * as RNLocalize from 'react-native-localize';

import { getMessages } from './utils';
import { LANGUAGES, LangContextName } from './constants';
import { getItem, setItem } from '../utils/asyncStorage';

type LangContextType = [string, (newLang: string) => void];

export const LangContext = createContext<LangContextType>([
  LANGUAGES.ENG,
  () => { },
]);
LangContext.displayName = LangContextName;

const lc_lang_key = 'preferences:lang';

export function LangModeProvider(props: { children: ReactNode }) {
  const [lang, setLang] = useState(LANGUAGES.ENG);

  useEffect(() => {
    (async function getLanguage() {
      const lcLang = await getItem(lc_lang_key);
      const bestLanguage = RNLocalize.findBestAvailableLanguage(
        Object.values(LANGUAGES),
      );

      if (lcLang) {
        setLang(lcLang);
      } else if (bestLanguage) {
        setLang(bestLanguage.languageTag);
      } else {
        setLang('English');
      }
    })();
  }, [lang]);

  async function switchLang(newLang: string) {
    await setItem(lc_lang_key, newLang);
    setLang(newLang);
  }

  const value: LangContextType = [lang, switchLang];
  return <LangContext.Provider value={value} {...props} />;
}

type LangWrapperProps = {
  children: ReactNode;
};

export default function LangWrapper({ children }: LangWrapperProps) {
  const [lang] = useContext(LangContext);
  return (
    <IntlProvider
      locale={lang}
      defaultLocale={LANGUAGES.ENG}
      messages={getMessages(lang)}>
      {children}
    </IntlProvider>
  );
}
