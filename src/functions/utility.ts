export const stringToDate = (date: string): string => {
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Singapore' };
  return new Date(date).toLocaleString('sg-SG', options)
}