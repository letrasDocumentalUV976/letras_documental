export const getFecha = () => {
  const fecha = new Date();
  return fecha.toLocaleDateString();
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
