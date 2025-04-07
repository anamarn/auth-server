type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JSONArray = JSONValue[];

export type JSONObject = {
  [key: string]: JSONValue;
};
