import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      option: {
        showOthers: 'Show others',
        forceUnlock: 'Force unlock',
        pathFilter: 'Enter a string to filter the list',
        refresh: 'Refresh',
      },
      list: {
        id: 'ID',
        owner: 'Owner',
        path: 'Path',
        lockedAt: 'Locked At',
        sort: 'Sort',
      },
      toolbar: {
        selected: '{{number}} selected',
        unlock: 'Unlock',
      },
      dialog: {
        error: {
          title: 'Failed to unlock file(s)',
        },
        close: 'Close',
        unlocking: 'Unlocking in progress...',
      },
    },
  },
  ko: {
    translation: {
      option: {
        showOthers: '다른 사람이 잠근 파일 보기',
        forceUnlock: '강제 해제',
        pathFilter: '포함되어야 할 문자',
        refresh: '새로 고침',
      },
      list: {
        id: 'ID',
        owner: '소유자',
        path: '경로',
        lockedAt: '잠근 날짜',
        sort: '정렬',
      },
      toolbar: {
        selected: '{{number}} 항목 선택됨',
        unlock: '잠금 해제',
      },
      dialog: {
        error: {
          title: '잠금 해제 실패',
        },
        close: '닫기',
        unlocking: '잠금 해제 중...',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
