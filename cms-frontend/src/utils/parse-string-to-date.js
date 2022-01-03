// https://date-fns.org/docs/parse
import parseDate from 'date-fns/parse'
import store from '@store'
import { zhTW, enUS } from 'date-fns/locale'

const langList = {
  'zh-Hant': zhTW,
  en: enUS,
}

export default function parseStringToDate(string, format = 'yyyy-MM-dd') {
  return parseDate(string, format, new Date(), {
    locale: langList[store.state.global.cachedLanguage],
  })
}

export function parseStringToDateTime(string) {
  return parseDate(string, 'yyyy-MM-dd HH:mm:ss', new Date())
}
