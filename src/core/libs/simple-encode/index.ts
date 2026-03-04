export const simpleEncode = (s: string) => {
  try {
    return window.btoa(s);
  } catch (e) {
    console.error('cannot encoded the value', s, e);
    return s;
  }
};

export const simpleDecode = (s: string) => {
  try {
    return window.atob(s);
  } catch (e) {
    console.error('cannot decoded the encoded value', s, e);
    return s;
  }
};
