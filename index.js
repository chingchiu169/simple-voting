const dotenv = require('dotenv');
dotenv.config();
const compression = require('compression')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// IMPORT MODELS
require('./models/Campaign');
require('./models/Vote');
require('./models/User');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/simplevoting`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });

app.use(compression())
app.use(bodyParser.json());

app.get('/', (req, res) => {
	return res.status(200).send({
		error: false,
	});
});

//IMPORT ROUTES
require('./routes/userRoutes')(app);
require('./routes/campaignRoutes')(app);
require('./routes/voteRoutes')(app);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`app running on port ${PORT}`)
});