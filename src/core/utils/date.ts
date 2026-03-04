import { dayjs } from "../libs";

export function subtractDays(dateString: string, days: number) {
  return dayjs(dateString).subtract(days, "day").format("YYYY-MM-DD");
}
