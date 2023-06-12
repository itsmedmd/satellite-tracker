// Format JS date to "YYYY-MM-DD HH:MM:SS" time in UTC
const getUTCDate = (date) => {
  if (!date || !(date instanceof Date)) {
    return "";
  }

  return date.toISOString().slice(0, 19).replace("T", " ");
};

// Export as CommonJS to enable testing
module.exports = getUTCDate;
