export const getEmoji = (label: string): string | null => {
  switch (label) {
    case "Kehadiran":
    case "Presence":
      return "🤩";
    case "Alpa":
    case "Absentee":
      return "😔";
    case "Sakit":
    case "Sickness":
      return "🤒";
    case "Dispensasi":
    case "Dispensation":
      return "📝";
    default:
      return null;
  }
};