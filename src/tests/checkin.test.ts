import {
    unlockDoor,
    getUpcomingAppointments
} from '../functions/inbound-sms.protected';

describe('jest environment', () => {
    test('date mocking', () => {
        expect(new Date).toEqual(new Date(2022, 2, 1, 9, 30, 0, 0));
        expect(new Date).toEqual(new Date('2022-03-01T15:30:00.000Z'));
    })
})

describe('unlockDoor()', () => {
    it('can unlock the door', async () => {
        const messages = await unlockDoor([], (e) => e)
        expect(messages).toContain('[DOOR UNLOCKED]')
    })
})

describe('getUpcomingAppointments()', () => {
    it('fetches oauth, then uses jwt to list events', async () => {
        const events = await getUpcomingAppointments((e) => e)
    })
})
