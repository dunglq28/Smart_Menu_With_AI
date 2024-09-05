import { kebabCase, camelCase } from "change-case";

export const convertKeysToKebabCase = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToKebabCase(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const kebabKey = kebabCase(key);
    acc[kebabKey] = convertKeysToKebabCase(obj[key]);
    return acc;
  }, {});
};

export const convertKeysToCamelCase = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = camelCase(key);
    acc[camelKey] = convertKeysToCamelCase(obj[key]);
    return acc;
  }, {});
};

export const convertQueryParamsToKebabCase = (params) => {
  const newParams = {};
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      newParams[kebabCase(key)] = params[key];
    }
  }
  return newParams;
};
