# WIZARD CITY

Express app that uses better-sqlite3 for managing the db.

## Crystal Ball

Frontend, served as static files.

## Spellbook

Backend API

## DB

better-sqlite3 for managing a sqlite3 database. This is saved in the /db folder. On app startup we run a startup sql to make sure that we have the tables we need.

## Deploys

Deploys happen via the github action deploy.yml. This copies files to the right folder on the server and runs any commands that are needed for setup.

This also restarts the pm2 command to get the backend app going.

## Server setup

Deploy script assumes that a pm2 process called wizardcity is running via pm2 from this command running under the nodejs user on the server:

`pm2 start ./index.js --name "wizardcity"`

`pm2 save` should start this back up on reboot.

TODO: not sure if the permissions are getting reset every time this goes out. If so, update the deploy script to handle it.
