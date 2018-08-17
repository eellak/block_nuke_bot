const mwbot = require('mwbot')
const winston = require('winston')
const fs = require('fs')


const blacklistPath = __dirname + '/blacklist'
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.splat(),
		winston.format.json()
	),
	transports: [
		new winston.transports.File({filename: 'log/error.log', level: 'error'}),
		new winston.transports.File({filename: 'log/combined.log'})
	]
})

let bot = new mwbot();
let csrfToken
let blockUser
let usersArray =  fs.readFileSync(blacklistPath).toString().split("\n");
usersArray.splice(-1,1)

let settings = JSON.parse(fs.readFileSync(__dirname + '/settings.json', 'utf8'));


bot.loginGetEditToken({
	apiUrl: settings.serverAddress,
	username: settings.botUsername,
	password: settings.botPassword,
})
.then((response) => {

	return mwbot.map(usersArray, (line) => {
		csrfToken = response.csrftoken

		blockUser =  line.trim()
		console.log(blockUser)

		return bot.request({
			action: "query",
			list: "usercontribs",
			ucuser: blockUser,
			uclimit: "500"
		})
		.then((response) => {
			for( var i in response.query.usercontribs){
				if(response.query.usercontribs[i].new === ""){
					let pageID = response.query.usercontribs[i].pageid

					bot.request({
						action: "delete",
						pageid: pageID,
						token: csrfToken
					})
					.then((response) => {
						console.log('delete page spot')
						console.log(response)
						logger.log('info', 'delete page: %d', pageID)
					})
					.catch((err) => {
						console.log(err.info)
						logger.log('error', err.info)
					})
				}
			}
		})
		.then(() => {
					
			bot.request({
				action: 'block',
				token: csrfToken,
				user: blockUser,
				reblock: true,
				reason: 'Spam User / spam attack june 2018'
			})
			.then((response) => {
				console.log('block user spot')
				console.log(response)
			logger.log('info', 'block user: %d - %s', response.block.userID, response.block.user )
			})
			.catch((err) => {
				console.log(err.info)
				logger.log('error', err.info)
			})
		}) 
		.catch((err) => {
			console.log(err.info)
			logger.log('error', err.info)
		})
	}, {concurrency: 1})
})
.catch((err) => {
	console.log(err.info)
	logger.log('error', err.info)
})

