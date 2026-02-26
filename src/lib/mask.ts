export function maskPhone(phone: string | null | undefined) {
  if (!phone) return ''
  if (phone.length < 4) return '***'
  const lastTwo = phone.slice(-2)
  return `***-***-${lastTwo}`
}

export function maskEmail(email: string | null | undefined) {
  if (!email) return ''
  const [name] = email.split('@')
  if (!name || name.length < 1) return '***@***'
  return `${name[0]}***@***`
}
