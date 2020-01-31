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

app.get(`/`, async (req, res) => {
    return res.status(200).send({ error: false });
});
//IMPORT ROUTES
require('./routes/userRoutes')(app);
require('./routes/campaignRoutes')(app);
require('./routes/voteRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
});