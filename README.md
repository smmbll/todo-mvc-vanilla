# Todo MVC in Vanilla JS

This is a quick example of MVC patterning done in nothing more complicated than Vanilla JS.

## Install

Mongo is the DB of choice here, which you can get at (https://www.mongodb.com/download-center?jmp=nav); or, if you use homebrew, it's as easy as

	brew update
	brew install mongodb

Once you've got MongoDB installed, and assuming that you have npm, you can download all assets (npm and bower modules) with

	npm run setup

To start the dev server (localhost:7000), just use

	npm start

When you're ready to try out the production server, build the dist with

	npm run build

and then

	npm run deploy

to run the production server (localhost:3000). That's it!
