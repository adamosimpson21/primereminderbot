const {oneMonthOld, checkDatabase, thirtyDaysInMilliseconds, oneHourInMilliseconds, formatChannelName} = require("./index.js");

const oldDate = Date.now() - thirtyDaysInMilliseconds - thirtyDaysInMilliseconds;
const oneMonthAndOneHourAgo = Date.now() - thirtyDaysInMilliseconds + oneHourInMilliseconds;
const oneMonthLessThirtyMinutesAgo = Date.now() - thirtyDaysInMilliseconds - (oneHourInMilliseconds/2);
const oneMonthAgo = Date.now() - thirtyDaysInMilliseconds;
const dateNow = Date.now();
const futureDate = Date.now() + thirtyDaysInMilliseconds + thirtyDaysInMilliseconds;

console.log(oldDate, oneMonthAndOneHourAgo, oneMonthLessThirtyMinutesAgo, oneMonthAgo, dateNow, futureDate)

test('one month old(very old date) === false', () => {
  expect(oneMonthOld(oldDate)).toBe(false)
})

test('one month old(oneMonthAndOneHourAgo) === false', () => {
  expect(oneMonthOld(oneMonthAndOneHourAgo)).toBe(false)
})

test('one month old(oneMonthLessThirtyMinutesAgo) === true', () => {
  expect(oneMonthOld(oneMonthLessThirtyMinutesAgo)).toBe(true)
})

test('one month old(oneMonthAgo) === true', () => {
  expect(oneMonthOld(oneMonthAgo)).toBe(true)
})

test('one month old(dateNow) === false', () => {
  expect(oneMonthOld(dateNow)).toBe(false)
})

test('one month old(futureDate) === false', () => {
  expect(oneMonthOld(futureDate)).toBe(false)
})

test('formatChannelName returns correct name', () => {
  expect(formatChannelName('#bandswithlegends')).toBe('bandswithlegends')
})

test('formatChannelName returns correct name', () => {
  expect(formatChannelName('bandswithlegends')).toBe('bandswithlegends')
})

test('formatChannelName returns correct name', () => {
  expect(formatChannelName('##bandswithlegends')).toBe('#bandswithlegends')
})