import {test} from 'node:test'
import assert from 'node:assert/strict'
import {validateRecurringDay, validateRecurringTime, validateTimeZone, validateZoomInviteUrl} from '../schemas/meetingValidation.ts'

test('recurring schedules require a valid day and 24-hour times', () => {
  assert.equal(validateRecurringDay('thursday', 'recurring'), true)
  for (const value of [undefined, 'Thursday', '']) assert.notEqual(validateRecurringDay(value, 'recurring'), true)
  for (const value of [undefined, '', '6 PM', '24:00', '18:60']) assert.notEqual(validateRecurringTime(value, 'recurring'), true)
  assert.equal(validateRecurringTime('18:30', 'recurring'), true)
  assert.equal(validateRecurringTime('20:00', 'recurring', '18:30'), true)
  assert.notEqual(validateRecurringTime('18:30', 'recurring', '18:30'), true)
  assert.notEqual(validateRecurringTime('17:30', 'recurring', '18:30'), true)
  assert.equal(validateRecurringTime(undefined, 'events'), true)
})
test('timezone rejects aliases that the join app would otherwise replace', () => {
  assert.equal(validateTimeZone('America/Los_Angeles'), true)
  assert.notEqual(validateTimeZone('Pacific'), true)
})
test('invite URL must use the configured meeting and a real Zoom host', () => {
  assert.equal(validateZoomInviteUrl('https://us02web.zoom.us/j/1234567890?pwd=encrypted', '123 456 7890'), true)
  for (const url of ['https://evilzoom.us/j/1234567890', 'http://zoom.us/j/1234567890', 'https://zoom.us/j/9999999999']) assert.notEqual(validateZoomInviteUrl(url, '1234567890'), true)
  assert.equal(validateZoomInviteUrl(undefined), true)
})
