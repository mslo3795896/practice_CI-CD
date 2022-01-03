import { createI18n } from 'vue-i18n'

// 引入 language 預設數值
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from '@src/lang/config'

// 引入自定義翻譯檔
import enLocale from './en/'
import zhHantLocale from './zh-Hant/'

// 合併 Element-UI 與自定義翻譯檔
const messages = {
  en: enLocale,
  'zh-Hant': zhHantLocale,
};

const i18n = createI18n({
  locale: DEFAULT_LANGUAGE, // set locale
  fallbackLocale: FALLBACK_LANGUAGE,
  messages, // set locale messages
});

export default i18n
