## Crystal Ball

Dev

- Runs with live-server in dev mode to facilitate reloads and cors issues

## Spellbook

Dev

- runs with nodemon to watch for changes

## Production

Deploys happen via the github action deploy.yml. This copies files to the right folder and runs any commands that are needed for setup. This also restarts the pm2 command to get the backend app going. The FE is served as files on the web server.

certbot is handling certs.
