const filteredURLParams = (params, newParams) => {
    Object.entries(newParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            if (value.length > 0) {
                params.set(key, value.join(","));
            } else {
                params.delete(key);
            }
        } else if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
    });
    return params;
};
const getQueryParams = (url) => {
  const params = new URL(url).searchParams;
  const queryObject = {};

  for (const [key, value] of params.entries()) {
    queryObject[key] = value;
  }

  return queryObject;
};

export {
    filteredURLParams,
    getQueryParams
}