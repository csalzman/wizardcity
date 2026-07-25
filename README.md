# WIZARD CITY

WIZARD! WELCOME TO THE CITY. WHAT MAPS WILL YOU MAKE?

---

Wizard City is a shared map making system of interconnected maps. Every Wizard (user) will have their own map and then will have access to shared maps. They can also make more maps at will.

Maps have cells. Locations are collections of 1 to N cells with a name and a description. Cells themselves can have descriptions and an image. Cells can link to any other cell in any other map.

NPWs (Non-Player Wizards) can be made and placed at a cell. Magic items too!

Perhaps you will use this to make a dungeon, or a multi-story tree fort. Or the astral plane.

NPWs (non-player wizards) can exist on cells. So can magic items and structures and secrets.

## Technomagic

Express app that uses [turso](https://turso.tech) for managing the db and Datastar to manage reactivity between the frontend and backend.

To connect to the db and work with the discord auth you'll to fill in the .env file. Get from another dev or ask @csalzman directly.

### Crystal Ball

Frontend, served as static files. Uses EJS for templates and Datastar to handle reactivity.

### Spellbook

"Backend API".

### DB

libsql for managing a sqlite3 database on turso. On app startup we run a startup sql to make sure that we have the tables we need.

### Deploys to prod

Deploys happen via the github action deploy.yml. This copies files to the right folder on the server and runs any commands that are needed for setup.

Deploy script assumes that a pm2 process called wizardcity is running via pm2 from this command running under the nodejs user on the server:

`pm2 start ./dist/index.js --name "wizardcity"`

pm2 is setup to start it back up on reboot (setup using `pm2 save`).

### Production Notes

Production and dev db is the same right now. As this project moves forward these will become separate. Prod is hosted on a digital ocean droplet and served at wizardcity.fun.

### Authentication

Authentication is performed via Discord and verifies that the user is a member of the RfT Discord. All pages are behind the login requirement, so landing nearly anywhere on the site (except login and some static assets like css files) redirects to login if the user is not authenticated.
