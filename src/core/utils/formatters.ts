export const readOvertimeType = (type?: string) => {
  switch (String(type)?.toLowerCase()) {
    case "weekend":
      return "Lembur di hari libur";
    case "weekday pagi":
      return "Lembur sebelum jam kerja";
    case "weekday sore":
      return "Lembur sesudah jam kerja";
    default:
      return type;
  }
};

export const formatGender = (s?: string) => {
  switch (s?.toLowerCase()) {
    case "male":
      return "Laki-laki";
    case "female":
      return "Perempuan";
    default:
      return s;
  }
};
