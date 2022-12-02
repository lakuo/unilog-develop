import moment from 'moment';

export function dateTimeToString(dateTime: any) {
  return moment(dateTime).locale('zh-tw').format('YYYY/MM/DD Ahh:mm:ss');
}
