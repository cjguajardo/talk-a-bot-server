
export const checkKey = (key: string): boolean => {
  // TODO: Implement this function with database lookup
  if (key === process.env.AUTH_KEY) {
    return true
  }
  return false
}
