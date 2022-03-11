# Grizzly Bear API

This is a webhook based API build with Twilio Serverless
Docs: https://www.twilio.com/docs/labs/serverless-toolkit/developing#

## Quick Start

```
cp .env.example .env # copy file and fill out details
yarn install
yarn run start          # runs function on local server, exposed via ngrok
echo "Copy NGROK url into Twilio number as a webhook"
echo "Inspect requests to NGROK via http://127.0.0.1:4040"
yarn run deploy:staging # deploy to staging number
yarn run deploy         # deploy to prod
```
