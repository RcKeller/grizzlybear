import {
    unlockDoor,
    getUpcomingAppointments
} from './inbound-sms.protected';

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
    const mockAuthRes = {
        access_token: 'example-access-token',
        token_type: 'Bearer',
        expiry_date: 1647038356000,
        id_token: undefined,
        refresh_token: 'jwt-placeholder'
    }
    const mockEvents = [
        {
            summary: 'Rental: John Doe - Rental - 2 Hours',
            description: ' \n\n\nPhone: +12064273176\n\n\nPowered by Appointo',
            start: {
            dateTime: '2022-03-11T15:55:00-06:00',
            timeZone: 'America/Chicago'
            },
            end: {
            dateTime: '2022-03-11T16:00:00-06:00',
            timeZone: 'America/Chicago'
            }
        }
    ]
    const mockCalRes = {
        config: {
            url: 'https://www.googleapis.com/calendar/v3/calendars/owner%40grizzlybear.academy/events?timeMin=2022-03-11T21%3A51%3A23.614Z&timeMax=2022-03-12T06%3A00%3A00.000Z&timeZone=US%2FCentral&maxResults=3&singleEvents=true&orderBy=startTime&fields=items%28summary%2Cdescription%2Cstart%2Cend%29',
            method: 'GET',
            userAgentDirectives: [{}],
            paramsSerializer: [Function],
            headers: {
            'x-goog-api-client': 'gdcl/5.1.0 gl-node/12.22.10 auth/7.14.0',
            'Accept-Encoding': 'gzip',
            'User-Agent': 'google-api-nodejs-client/5.1.0 (gzip)',
            Authorization: 'Bearer ya29.c.b0AXv0zTMc-1II-V6VVP1i7snequCBrOgg77HTULnewIls8GMpE3TlA1k_oQueg22lH36U3qEAse4MELpyhgxZ0njoHRR5yu-rP5QZNPwf7wwQoE1YuoUXXQ__PE8NHqxiYW2LwFmcKiow6T1ZzeYEklMFmDQHPyDDfRV-1pM32WvEuhcnUCsxiLWI-t8ldzpQGvEDpt2AYAmdZDfMi4jcqlo2vStGnnu8.......................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................',
            Accept: 'application/json'
            },
            params: {
            timeMin: '2022-03-11T21:51:23.614Z',
            timeMax: '2022-03-12T06:00:00.000Z',
            timeZone: 'US/Central',
            maxResults: 3,
            singleEvents: true,
            orderBy: 'startTime',
            fields: 'items(summary,description,start,end)'
            },
            validateStatus: [Function],
            retry: true,
            responseType: 'json'
        },
        data: { items: mockEvents },
        headers: {
            'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000,h3-Q050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"',
            'cache-control': 'private, max-age=0, must-revalidate, no-transform',
            connection: 'close',
            'content-encoding': 'gzip',
            'content-type': 'application/json; charset=UTF-8',
            date: 'Fri, 11 Mar 2022 21:51:24 GMT',
            expires: 'Fri, 11 Mar 2022 21:51:24 GMT',
            server: 'ESF',
            'transfer-encoding': 'chunked',
            vary: 'Origin, X-Origin, Referer',
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'SAMEORIGIN',
            'x-xss-protection': '0'
        },
        status: 200,
        statusText: 'OK',
        request: {
            responseURL: 'https://www.googleapis.com/calendar/v3/calendars/owner%40grizzlybear.academy/events?timeMin=2022-03-11T21%3A51%3A23.614Z&timeMax=2022-03-12T06%3A00%3A00.000Z&timeZone=US%2FCentral&maxResults=3&singleEvents=true&orderBy=startTime&fields=items%28summary%2Cdescription%2Cstart%2Cend%29'
        }
    }

    // beforeEach(() => {

    // })
    it('fetches oauth, then uses jwt to list events', async () => {
        const events = await getUpcomingAppointments((e) => e)
    })
})
