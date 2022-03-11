import gcpCredentials from '../../config/gcp.json'
import allowList from '../../config/allowList.json'

// Imports global types
import '@twilio-labs/serverless-runtime-types';
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types';

import { google } from 'googleapis';
import moment from 'moment-timezone'

moment.tz.setDefault("America/Chicago");

const calendarId = 'owner@grizzlybear.academy';

export const FOOBAR = () => { return null }

export const handler: ServerlessFunctionSignature = async function(
  context: Context,
  event: Record<string, any>,
  callback: ServerlessCallback
) {
  // Create a new messaging response object
  const twiml = new Twilio.twiml.MessagingResponse();
  const fromNumber = event.From.replace('+1', '')
  let messages = []

  const enterTime = new Date();
  enterTime.setSeconds(enterTime.getSeconds() - 60);
  let exitTime = new Date();
  exitTime.setSeconds(enterTime.getSeconds() + 60);
  let endTime = new Date()
  endTime.setHours(24,0,0,0); // next midnight

  async function unlockDoor() {
    try {
      console.log('TODO: Brivo API call')
      messages.push(`[DOOR UNLOCKED]`)
    } catch(err) {
      messages.push('GRIZZLY BEAR:')
      messages.push('Our security system is down, please contact the owner directly at (206)-427-3176 to let you in. Sorry!')
      twiml.message(messages.join('\n'))
      return callback(null, twiml);
    }
  }

  // BYPASS - allow list numbers get an immediate unlock, no API call
  if (allowList[fromNumber]) {
    unlockDoor()
    messages.push(`Keller: Welcome home, ${allowList[fromNumber]}!`)
    twiml.message(messages.join('\n'))
    return callback(null, twiml);
  }

  // GOOGLE AUTH
  const jwtClient = new google.auth.JWT(
    gcpCredentials.client_email,
    null,
    gcpCredentials.private_key,
    [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events.readonly'
    ]
  );
  const jwtCreds = await jwtClient.authorize()
    .then(tokens => tokens)
    .catch(err => {
      console.error(err);
      return callback(err);
    });
  
  const cal = google.calendar({version: 'v3', auth: jwtClient});
  const events = await cal.events.list({
      calendarId,
      timeMin: enterTime.toISOString(),
      timeMax: endTime.toISOString(),
      timeZone: 'US/Central',
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
      fields: 'items(summary,description,start,end)'
    })
    .then(res => res.data.items)
    .then(events => events.filter(e => !!e.description))
    .catch((err) => {
      console.error(err);
      return callback(err);
    });

  const currentEvent = Array.isArray(events) && events[0] ? events[0] : null

  console.log(events)

  // NO UPCOMING EVENTS
  if (!Array.isArray(events) || events.length === 0 || !events[0]) {
    messages.push('GRIZZLY BEAR:')
    messages.push('You don\'t have any reservations today, please make a booking through our site:')
    messages.push('https://grizzlybear.academy')
  // NEXT EVENT ISN'T THEIRS
  } else if (!currentEvent.description.includes(fromNumber)) {
    const primaryBookingNumber = events[0].description.match(/[\+]?\d{11}/)
    messages.push('GRIZZLY BEAR:')
    messages.push(`We couldn\'t verify your identity with this number ending in ${fromNumber.slice(6, 10)}`)
    // CONTACT THEM INSTEAD
    if (primaryBookingNumber && primaryBookingNumber[0]) {
      messages.push(`Our next booking is at ${moment(events[0].start.dateTime).format('LT')} with a number ending with ${primaryBookingNumber[0].slice(8, 12)}.`)
      messages.push('Please have them escort you into the building, or contact the owner at (206) 427-3176')
    // CONTACT OWNER BECAUSE NO NUMBER ON FILE
    } else {
      messages.push('Please contact the owner at (206) 427-3176 if you have an appointment, or book one through our site:')
      messages.push('https://grizzlybear.academy')
    }
  // TOO EARLY TO CHECK IN
  } else if (moment(enterTime).isBefore(events[0].start.dateTime)) {
    messages.push('GRIZZLY BEAR:')
    messages.push('It\'s almost time, but not quite!')
    messages.push(`Text us again at ${moment(events[0].start.dateTime).format('LT')}`)
  // READY TO CHECK IN
  } else {
    unlockDoor()
    messages.push(`Welcome to Grizzly Bear! The facility is yours until ${moment(events[0].end.dateTime).format('LT')}`)
    messages.push('Please clean any equipment you use before you leave.')
    // IMPORTANT: please send us a photo of the facility 
  }

  // Use any of the Node.js SDK methods, such as `message`, to compose a response
  // In this case we're also including the doge image as a media attachment
  // Note: access incoming text details such as the from number on `event`

  // Return the TwiML as the second argument to `callback`
  // This will render the response as XML in reply to the webhook request
  twiml.message(messages.join('\n'))
  return callback(null, twiml);
};
