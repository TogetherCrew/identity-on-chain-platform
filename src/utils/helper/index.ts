export const getTokenForProvider = (jwtProvider: string) => {
  const tokens =
    JSON.parse(localStorage.getItem('OCI_PROVIDER_TOKENS') || '') || [];
  const tokenObject = tokens.find(
    (token: { provider: string }) =>
      token.provider.toLowerCase() === jwtProvider.toLowerCase()
  );
  return tokenObject ? tokenObject.token : null;
};

export const convertStringsToBigInts = (obj: unknown): unknown => {
  if (typeof obj === 'string' && /^[0-9]+$/.test(obj)) {
    return BigInt(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(convertStringsToBigInts);
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, convertStringsToBigInts(v)])
    );
  }
  return obj;
};
