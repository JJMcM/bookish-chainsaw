export const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 1000 && Number.isInteger(value)) {
      return value.toLocaleString();
    }

    if (Number.isInteger(value)) {
      return value.toString();
    }

    return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  }

  return String(value);
};
