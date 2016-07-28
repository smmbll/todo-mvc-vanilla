# Todo MVC in Vanilla JS

This is a quick example of MVC architecture done in Vanilla JS.

## Install

The app comes with two types of storage: static and dynamic. In order to use the dynamic version, you’ll need to have MongoDB installed (https://www.mongodb.com/download-center?jmp=nav). If you use homebrew, this is as easy as

	brew update
	brew install mongodb

Once you've got MongoDB installed, you can download all assets (npm and bower modules) with

	npm run setup

To start the dev server, just use

	npm start

When you're ready to try out the production server, build the dist with

	npm run build

and then

	npm run deploy

to run MongoDB and the server. That’s it!
