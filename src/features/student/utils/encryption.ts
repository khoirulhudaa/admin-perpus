export const simpleEncodes = (data: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(data)));
  } catch (error) {
    console.error('Error encoding data:', error);
    return '';
  }
};

export const simpleDecodes = (encodedData: string): string => {
  try {
    return decodeURIComponent(escape(atob(encodedData)));
  } catch (error) {
    console.error('Error decoding data:', error);
    return '';
  }
};
