// import gcpCredentials from '../config/gcp'
// import allowList from '../config/allowList'

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

const gcpCredentials = {
  "type": "service_account",
  "project_id": "grizzlybearllc",
  "private_key_id": "14451938ba076e4914f5bbcf7aba7c3dbb3327a5",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC6yIp/0XfY+JpL\nRLZdtK8R3B2StXn2xyZZyLJN/soWfwL2ORb8fRD3X6aFe661SWrrjU0k94Wr/BvM\nuQGde91I6BoSKsnnDzrqfw5XgXtnCoYS4lZsefd8pC1/v1/pBnL4nBMN3+GJ8+Bi\ne+L8AZT6kHJQN/5P4ZwJel6w8lANX4pHMZg9IS7MCNkowwFn6m4D8uMkj4DfgVfk\nUD0ToVx0Q0ot5LKp9MKyVWNHdBLFm9lgnjHomf7Cu50rejH4f+NA9kF+icd32StS\n1E1AD7E5iiur5fPM63CJtFp/BXa14sKXcvwmDo+KWBrBDcxyAndtsiEwJQuqqs4u\nSrUr96hHAgMBAAECgf8vCm2GSh/yXI8GFPc3KRRMoRWOO5972ApkyDRVpjPg1Ni0\nN6ySVhWReuPGM6NuH76Ka/DZbAP67jKY4113TBkDKJm5IgAjMR6KdwmD8tTeA6AR\nck2wEalCutMLgbtVHRTKDrqH3vWCkukK8g2JT0h5S5bc7fnNnbNrNmZsy6d4jeU2\nnjmM20bhSkvIIW9yyPXF5xkTz8tGuGEkTSPpD5FseHggPjKPlRtWRVqHaPGfOrbY\nnrD71DLug8DWNhVFo4vaFJ0IcBRPwViZj7qkcIzRiJMUa9jxkUf3ygh9+ksDwfsQ\n8rruOzEoOkDRE5YjTxsJmHpqsJyywVjIOPU/VokCgYEA8Yj7EEpHEWJIBsIibxA9\nnTUfDapbFhSQio/2RMvQU7uGQCvV+dBzENN/UEwDK2wvR2L+hhby5KG+0eeipE4G\n6/8Tuf1XWW710iVtukE9hnrg/mJqicR4w5LYawK1zt//ObKme1Ayj4fql7/dgy8A\n+dnRtBG1sXNUX2zVFlkfVS0CgYEAxfgmyidmm9jEuGkc420pNWj46t9KqVitNLH8\n5hg06EloaNCgjzSo1viA/nYBhWuLaweU9/+nAPT8KgAQgUxIKLfErbcejH79yQjH\nR5SdyPZV58UBcz34kzk+kcptI5TnUIqX0Boj0fRumWYSDhrg97V0bRHbEj+zdWYs\nduxrQ8MCgYEA4uSG1FqyQAZPGuorZqGe/5rzPOcXAbr3vPJXqXC8lqvGBWooa7AB\nJ4FGS6vcHmJWV30LE/Ni4JuAobYy9p3FqtPHOCRgdcbibTJzzU+T+ExeJxlUc254\n819ypbO6DkglfZHxCk3f8S0AluTJtX3mMM8JS1qHj9aDH9Egqwm1gVECgYBJHqTF\nGdRuT5wpOLmwzorf7UuzBJJBBj3DLtJn8hzohuSHgjcrbZnG/LY4RkG9k8FE4OIG\nz2hRlCrnIGr4NsKYN3fvaalg3y7BZ/qi16OHrGSCXGNyuzrqtcQEeS3ibIcbWnVE\nKcN9Mrj+85JLn2XkWCMOff/aN6kC/aACtMPRnQKBgQCRy3+HRKVAMK6Je7/5NBQ1\nLHgiOTwm+ylW+XMDZleAaZCCi01qS/P9URFMec2EEyakK5Ex1GeC/WqiH2gAll/q\neTKVhxq7ImobD5uF0D4mp72plcJ2ugJbJMoTDAl3YYk0KOAI68AuTmJGHK9/CnP6\n6VB/JCL/ChrA2bCpIvlCBQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "twilio@grizzlybearllc.iam.gserviceaccount.com",
  "client_id": "111653328846990616220",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/twilio%40grizzlybearllc.iam.gserviceaccount.com"
}


const calendarId = 'owner@grizzlybear.academy';

const allowList = {
  "3145999859": "Jerry",
  "3146817584": "Grizz",
  "3145993130": "Jeff",
  "3145999858": "Michael",
  "6084361026": "Jesse"
}

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
      // maxResults: 10,
      maxResults: 3,
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
