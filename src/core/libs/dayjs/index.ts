import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";

dayjs.extend(updateLocale);

dayjs.locale("id", {
  months: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
  relativeTime: {
    future: "dalam %s",
    past: "%s yang lalu",
    s: "beberapa detik",
    m: "semenit",
    mm: "%d menit",
    h: "sejam",
    hh: "%d jam",
    d: "sehari",
    dd: "%d hari",
    M: "sebulan",
    MM: "%d bulan",
    y: "setahun",
    yy: "%d tahun",
  },
});

dayjs.extend(relativeTime);

export { dayjs };

export const backdateDisabled = (date: Date) => {
  if (dayjs(date).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")) {
    return false;
  }

  return date < new Date();
};

export const forwardDateDisabled = (date: Date) => {
  if (dayjs(date).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")) {
    return false;
  }

  return date < new Date();
};
