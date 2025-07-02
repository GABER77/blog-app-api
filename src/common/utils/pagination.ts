export function getPaginationParams(limit = 10, page = 1) {
  // Prevent users from requesting too many items in one page
  const maxLimit = 20;
  const cappedLimit = Math.min(limit, maxLimit);

  const skip = (page - 1) * limit;

  return { cappedLimit, skip };
}
