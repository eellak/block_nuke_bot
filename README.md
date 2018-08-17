# Block Nuke Bot

## Description

A node.js command line bot for massively removing spam users and the page they created.

Uses [mwbot](https://github.com/Fannon/mwbot/) framework for Node and [Winston](https://github.com/winstonjs/winston) logging module.

Developed with Node 8.9.4

Dependencies are described in `package.json` and `package-lock.json`

## Usage

1. `git clone` this repository.
2. `cd` to the cloned directory 
3. `npm install` to get dependencies.
4. copy `settings.sample.json` to `settings.json` and fill the settings for your Mediawiki installation.
5. add spam users' usernames in `blacklist` (no quotes, no commas, each on a new line) 
6. run `node app.js`

The application requires a Mediawiki user belonging to the bot and sysop(delete page privilege) user groups
