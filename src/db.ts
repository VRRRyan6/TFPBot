//import path = require('node:path');
//import fs = require('node:fs');
import { Sequelize } from 'sequelize-typescript';

const db = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
	hooks: {
		beforeConnect(config) {
			config.host = process.env.DB_HOST!
		}
	},
	dialect: 'mariadb',
	models: [__dirname + '/models'],
	logging: false
})

db.sync()

export default db;