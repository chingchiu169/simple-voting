const mongoose = require('mongoose');
const User = mongoose.model('users');
const Vote = mongoose.model('votes');
const Campaign = mongoose.model('campaigns');
const Token = require('../utils/token');

module.exports = (app) => {

	// app.get(`/api/vote`, async (req, res) => {
	// 	// Get all votes
	// 	let votes = await Vote.find();
	// 	return res.status(200).send({ error: false, votes });
	// });

	app.use(async function (req, res, next) {
		let parameter = req.body;
		if (Object.keys(parameter).length === 0 && parameter.constructor === Object) {
			return res.status(200).send({
				error: true,
				message: 'Error!'
			});
		}
		let tokenClass = new Token;
		const data = tokenClass.decode(parameter.token);
		let user = await User.findOne({ hkid: data.hkid });
		const verify = tokenClass.verify(parameter.token, user.hash);
		if (verify === "TokenExpiredError") {
			return res.status(200).send({
				error: true,
				message: 'Token is expired.'
			});
		}
		else {
			req.user = data;
			next();
		}
	});

	// Find all votes using hkid
	app.put(`/api/vote`, async (req, res) => {
		let user = req.user;
		let votes = await Vote.find({ hkid: user.hkid });
		return res.status(200).send({ error: false, votes });
	});

	// User vote a campaign
	app.post(`/api/vote`, async (req, res) => {
		let parameter = req.body;
		let user = req.user;
		// Check if user voted same campaign
		let vote = await Vote.findOne({ hkid: user.hkid, campaign: parameter.campaign });
		if (vote) {
			return res.status(200).send({
				error: true,
				message: "You have already voted this campaign",
				vote
			});
		}
		// Get the campaign
		let campaign = await Campaign.findById(parameter.campaign);
		if (!campaign) {
			return res.status(200).send({
				error: true,
				message: "Campaign invalid",
			});
		}
		// Check campaign is started or ended
		let now = new Date().getTime();
		let start = new Date(campaign.start);
		let end = new Date(campaign.end);
		if (start > now) {
			return res.status(200).send({
				error: true,
				message: "Campaign has not started",
			});
		}
		if (now > end) {
			return res.status(200).send({
				error: true,
				message: "Campaign has ended",
			});
		}
		// Create vote record for user
		parameter.hkid = user.hkid;
		let voted = await Vote.create(parameter);
		// Find option index
		let index = campaign.options.findIndex(x => x.option === parameter.for);
		if (index === -1) {
			return res.status(200).send({
				error: true,
				message: "Option invalid",
			});
		}
		// Update campaign option vote count
		campaign = await Campaign.findByIdAndUpdate(parameter.campaign, { $inc: { ['options.' + index + '.voted']: 1 } }, { new: true });
		return res.status(201).send({
			error: false,
			campaign,
			voted
		})
	})

}