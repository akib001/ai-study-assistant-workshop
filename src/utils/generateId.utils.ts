export const generateId = () => {
  return `${Math.random().toString(8).substring(2, 9)}-${Date.now()}`
}
