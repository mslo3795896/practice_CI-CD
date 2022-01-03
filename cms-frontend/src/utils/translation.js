import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@src/lang/config';
import i18n from '@src/lang';

const Trans = {
  get defaultLanguage() {
    return DEFAULT_LANGUAGE;
  },
  get supportedLanguages() {
    return SUPPORTED_LANGUAGES;
  },
  get currentLanguage() {
    return i18n.locale;
  },
  set currentLanguage(lang) {
    i18n.locale = lang;
  },
  /**
   * 取得使用者對應系統支援的語言
   * @return {String}
   */
  getUserSupportedLang() {
    const userPreferredLang = Trans.getUserLang();

    // Check if user preferred browser lang is supported
    if(Trans.isLangSupported(userPreferredLang.lang)) {
      return userPreferredLang.lang;
    }
    // Check if user preferred lang without the ISO is supported
    if(Trans.isLangSupported(userPreferredLang.langNoISO)) {
      return userPreferredLang.langNoISO;
    }
    return Trans.defaultLanguage;
  },
  /**
   * 取得使用者偏好的語言(localStorage、瀏覽器、電腦系統、系統預設)
   */
  getUserLang() {
    const lang = this.getUrlParameter('language') || window.navigator.language || window.navigator.userLanguage || Trans.defaultLanguage;

    return {
      lang: Trans.getUserLangAlias(lang),
      langNoISO: Trans.getUserLangAlias(lang)
        .split('-')[0]
    };
  },
  /**
   * 取得語言別名
   */
  getUserLangAlias(lang) {
    const langItem = Trans.supportedLanguages.filter(item => {
      return item.code === lang
    });
    return langItem.length > 0
      ? langItem[0].alias
      : lang;
  },
  getUrlParameter(name) {
    let query = name.replace(/[\[]/, '\\[')
      .replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + query + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null
      ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },
  /**
   * 設定語言至不同服務項目（axios, html 語言標籤等)
   * @param {String} lang
   * @return {String} lang
   */
  setI18nLanguageInServices(lang) {
    Trans.currentLanguage = lang;

    // axios.defaults.headers.common['Accept-Language'] = lang
    document.querySelector('html')
      .setAttribute('lang', lang);
    return lang;
  },
  /**
   * 載入新的翻譯字串並在完成後更改語言
   * @param lang
   * @return {Promise<any>}
   */
  changeLanguage(lang) {
    const langAlias = Trans.getUserLangAlias(lang);

    if(!Trans.isLangSupported(langAlias)) {
      return Promise.reject(new Error('Language not supported'));
    }
    if(i18n.locale === langAlias) {
      return Promise.resolve(langAlias);
    } // has been loaded prior
    return Trans.loadLanguageFile(langAlias)
      .then((msgs) => {
        i18n.setLocaleMessage(langAlias, msgs.default || msgs);
        return Trans.setI18nLanguageInServices(langAlias);
      });
  },
  /**
   * 異步加載翻譯檔案
   * @param lang
   * @return {Promise<*>|*}
   */
  loadLanguageFile(lang) {
    const langAlias = Trans.getUserLangAlias(lang);

    return import(`@src/lang/${ langAlias }`);
  },
  /**
   * 檢查語言是否有在 SUPPORTED_LANGUAGES 陣列內
   * @param {String} lang
   * @return {boolean}
   */
  isLangSupported(lang) {
    return Trans.supportedLanguages.map(el => Object.values(el)[0])
      .includes(lang);
  }
};

export { Trans };
