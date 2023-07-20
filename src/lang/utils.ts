import ENGLISH from './dictionaries/en.json';
import POLISH from './dictionaries/pl.json';

import { LANGUAGES } from './constants';

export function getMessages(lang: string) {
  switch (lang) {
    case LANGUAGES.ENG: {
      return ENGLISH;
    }
    case LANGUAGES.PL: {
      return POLISH;
    }
    default: {
      return ENGLISH;
    }
  }
}
