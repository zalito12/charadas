# Charadas

Sample application to play charades simultaneously!

Created with Angular, Angular Material, Google Firebase Tools and AngularFire.

See [demo](https://charadas-game.web.app/play)

## Development server

You will need an ``.env.ts`` file under ``environments`` folder with your firebase configuration.

````
npm install
cd functions
npm run build
cd ..
npm run build
firebase emulator:start
````

## Deploy

You will need an ``.env.prod.ts`` file under ``environments`` folder with your firebase configuration.

````
cd functions
npm run build
cd ..
npm run deploy
firebase deploy
````
