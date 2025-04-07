import { JSONObject } from 'src/types/json-object.type';

export const normalizeJson = (obj: JSONObject): JSONObject => {
  if (Array.isArray(obj)) {
    return obj.map(normalizeJson) as unknown as JSONObject; //code smeells
  } else if (obj !== null && typeof obj === 'object') {
    const sortedKeys = Object.keys(obj).sort();
    const result: JSONObject = {};
    for (const key of sortedKeys) {
      result[key] = normalizeJson(obj[key] as JSONObject); //code smells
    }
    return result;
  } else {
    return obj;
  }
};
