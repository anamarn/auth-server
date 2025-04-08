import { JSONObject } from 'src/types/json-object.type';

export const normalizeJSON = (obj: JSONObject): JSONObject => {
  if (Array.isArray(obj)) {
    return obj.map(normalizeJSON) as unknown as JSONObject;
  } else if (obj !== null && typeof obj === 'object') {
    const sortedKeys = Object.keys(obj).sort();
    const result: JSONObject = {};
    for (const key of sortedKeys) {
      result[key] = normalizeJSON(obj[key] as JSONObject);
    }
    return result;
  } else {
    return obj;
  }
};
