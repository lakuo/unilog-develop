import moment from 'moment';

moment.locale('zh-tw', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
    '_'
  ),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
    LT: 'Ah點mm分',
    LTS: 'Ah點m分s秒',
    L: 'YYYY-MM-DD',
    LL: 'YYYY年MMMD日',
    LLL: 'YYYY年MMMD日Ah點mm分',
    LLLL: 'YYYY年MMMD日ddddAh點mm分',
    l: 'YYYY-MM-DD',
    ll: 'YYYY年MMMD日',
    lll: 'YYYY年MMMD日Ah點mm分',
    llll: 'YYYY年MMMD日ddddAh點mm分'
  },
  meridiemHour: (hour: number, meridiem: string) => {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === '上午') {
      return hour;
    } else {
      return hour + 12;
    }
  },
  meridiem: (hour, minute) => {
    const hm = hour * 100 + minute;
    if (hm < 1200) {
      return '上午';
    } else {
      return '下午';
    }
  }
});
