const dotenv = require('dotenv');
dotenv.config();
const compression = require('compression')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

// Import models
require('./models/Campaign');
require('./models/Vote');
require('./models/User');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/simplevoting`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });

// Set 1 ip only can request api 1000 times in 10 mins
app.set('trust proxy', 1);
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000
});
// Set slown down response if more than 100 request in 10 mins and max delay time is 2s
const apiSpeedLimiter = slowDown({
  windowMs: 10 * 60 * 1000,
  delayAfter: 100,
	delayMs: 10,
	maxDelayMs: 2000,
});
app.use("/api/", apiLimiter);
app.use("/api/", apiSpeedLimiter);
app.use(compression())
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	const path = require('path');
	app.get('*', (req, res, next) => {
		if (req.originalUrl.indexOf('/api') > -1) {
			next();
		}
		else {
			res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
		}
	});
}
else {
	app.get('/', (req, res) => {
		return res.status(200).send({
			error: false,
		});
	});
}


//IMPORT ROUTES
require('./routes/userRoutes')(app);
require('./routes/campaignRoutes')(app);
require('./routes/voteRoutes')(app);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`app running on port ${PORT}`)
});