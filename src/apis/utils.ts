export const urlToBlob = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return blob;
};

export const urlToFile = async (url: string, filename: string) => {
  const blob = await urlToBlob(url);
  const file = new File([blob], filename);

  return file;
};
