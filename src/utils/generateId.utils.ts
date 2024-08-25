export const generateId = () => {
  const randomPart = Math.random().toString(36).substring(2, 8)
  const timestampPart = Date.now().toString(36).substring(0, 5)

  return `${randomPart}-${timestampPart}`
}
