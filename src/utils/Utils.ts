export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const parseDate = (dateString: string): Date => {
  const parts = dateString.split("/").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return new Date(NaN);
  }

  let [day, month] = parts;
  const [, , year] = parts;

  // Registros antiguos se guardaron como M/D/AAAA; si el mes no es un
  // valor válido pero el día sí lo sería como mes, se interpretan al revés.
  if (month > 12 && day <= 12) {
    [day, month] = [month, day];
  }

  return new Date(year, month - 1, day);
};

export const getFecha = () => formatDate(new Date());

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const time = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formatDate(date)} ${time}`;
};

export const convertToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const parseTypeTags = (type?: string): string[] =>
  (type ?? "")
    .split(",")
    .map((tag) => tag.trim().toUpperCase())
    .filter(Boolean);

export const isPastDate = (dateString: string): boolean => {
  const date = parseDate(dateString);
  if (Number.isNaN(date.getTime())) return false;
  date.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
};

export const formatDateWithWeekday = (dateString: string): string => {
  const date = parseDate(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
  return `${weekday} - ${dateString}`;
};
