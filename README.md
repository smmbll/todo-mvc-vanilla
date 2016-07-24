# Todo MVC in Vanilla JS

This is a quick example of MVC architecture done in Vanilla JS.

## Install

The app comes with two types of storage: static and dynamic. In order to use the dynamic version, you’ll need to have MongoDB installed (https://www.mongodb.com/download-center?jmp=nav).
Assuming you have homebrew installed:

	brew update
	brew install mongodb

Then:

	npm install

From here, everything can be managed through Gulp. Running

	gulp setup

downloads bower modules. Then to start the dev server, just use

	gulp

In src/index.html, you’ll notice that among the scripts included before the </body> tag are two stores: store-dynamic.js and store-static.js. In order to use the dev server, you’ll have to uncomment store-static.js and comment out store-dynamic. If you want to run the production server, comment out store-static and reinclude store-dynamic. Then run

	gulp build

to build the application assets, followed by

	gulp start-app

to run MongoDB and the server. That’s it!