# WIZARD CITY

Express app that uses [turso](https://turso.tech) for managing the db. To connect to the db you'll need the url and auth token. Get from another dev or set up a db at turso to start from scratch.

## Crystal Ball

Frontend, served as static files.

## Spellbook

Backend API

## DB

libsql for managing a sqlite3 database on turso. On app startup we run a startup sql to make sure that we have the tables we need.

## Deploys

Deploys happen via the github action deploy.yml. This copies files to the right folder on the server and runs any commands that are needed for setup.

This also restarts the pm2 command to get the backend app going.

## Server setup

Deploy script assumes that a pm2 process called wizardcity is running via pm2 from this command running under the nodejs user on the server:

`pm2 start ./index.js --name "wizardcity"`

pm2 is setup to start it back up on reboot (setup using `pm2 save`).

TODO: not sure if the permissions are getting reset every time this goes out. If so, update the deploy script to handle it.

## Production Notes

Production and dev db is the same right now. As this project moves forward these will become separate.
