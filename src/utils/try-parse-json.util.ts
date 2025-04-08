export const tryParseJSON = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};
