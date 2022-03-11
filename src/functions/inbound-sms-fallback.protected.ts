// https://developers.google.com/calendar/api/quickstart/nodejs
const axios = require('axios');
const { google } = require('googleapis');
const moment = require('moment');

const cal = google.calendar({
    version: 'v3',
    auth: 'AIzaSyBT1ZrQF2l6wIJNY3BDxqwL8nBy6B3a8yw'
});
const calendar = 'owner@grizzlybear.academy';

const allowList = {
  '3145999859': 'Jerry',
  '3146817584': 'Grizz',
  '3145993130': 'Jeff',
  '3145999858': 'Michael',
  '6084361026': 'Jesse',
  '2064273176': 'Developer'
}

// Note that the function must be `async` to enable use of the `await` keyword
exports.handler = async function (context, event, callback) {
  // Create a new messaging response object
  const twiml = new Twilio.twiml.MessagingResponse();
  let messages = []

  const enterTime = new Date();
  enterTime.setSeconds(enterTime.getSeconds() - 60);
  let exitTime = new Date();
  exitTime.setSeconds(enterTime.getSeconds() + 60);

  // Allow
  const fromNumber = event.From.replace('+1', '')
  if (allowList[fromNumber]) {
    messages.push(`[DOOR UNLOCKED]`)
    twiml.message(messages.join('\n'))
    return callback(null, twiml);
  }

  const currentEvents = await cal.freebusy.query({
    resource: {
        // Set times to ISO strings as such
        timeMin: enterTime.toISOString(), 
        timeMax: exitTime.toISOString(),
        timeZone: 'US/Central',
        items: [{ id: calendar }]
    }
  }).then((result) => {
      const busy = result.data.calendars[calendar].busy;
      const errors = result.data.calendars[calendar].errors;
      if (errors) {
        throw new Error(errors)
      }
      return busy
  }).catch((e) => {
      console.error(e);
      return callback(e);
  });

  // Use any of the Node.js SDK methods, such as `message`, to compose a response
  // In this case we're also including the doge image as a media attachment
  // Note: access incoming text details such as the from number on `event`

  if (currentEvents.length !== 0) {
    messages.push('[DOOR UNLOCKED]')
    messages.push('Welcome to Grizzly Bear Auditorium! Enjoy your visit.')
    messages.push('Please clean any equipment you use before you leave.')
    messages.push('If you like our place, please leave us a review on Google.')
  } else {
    messages.push('GRIZZLY BEAR:')
    messages.push('We couldn\'t find a current reservation under this phone number, please double check your booking email and verify your checkin time.')
  }

  // Return the TwiML as the second argument to `callback`
  // This will render the response as XML in reply to the webhook request
  twiml.message(messages.join('\n'))
  return callback(null, twiml);
};
