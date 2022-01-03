// https://date-fns.org/docs/parse
import parseDate from 'date-fns/parseISO'
import format from 'date-fns/format'


export default function formatDate(date, pattern = 'date') {
  if(!date) {
    return;
  }
  if(typeof date === 'string') {
    date = parseDate(date);
  }

  const patterMap = {
    date: 'yyyy/MM/dd', // '2019/06/13'
    dateTime: 'yyyy-MM-dd HH:mm', // 2019-01-01 00:00
    dateTimeSecond: 'yyyy-MM-dd HH:mm:ss', // 2019-01-01 00:00:00
    dateWeekDay: 'yyyy/MM/dd EEE', // '2019/06/13 週三'
    dateTimeWeekDay: 'yyyy/MM/dd EEE HH:mm', // '2019/6/13 週三 00:00',
    time: 'HH:mm', // '13:30',
    day: 'd', // '6',
  };
  const formatPattern = patterMap[pattern] || pattern;

  return format(date, formatPattern)
}

