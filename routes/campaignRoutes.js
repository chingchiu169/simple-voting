const mongoose = require('mongoose');
const Campaign = mongoose.model('campaigns');

module.exports = (app) => {

	app.get(`/api/campaign`, async (req, res) => {
		// Get all campaign
		let campaigns = await Campaign.find().sort([['time', -1]]);
		return res.status(200).send({
			error: false,
			campaigns
		});
	});

	app.post(`/api/campaign`, async (req, res) => {
		// Create new campaign
		let campaign = req.body;
		campaign.time = new Date();
		await Campaign.create(campaign);
		return res.status(201).send({
			error: false,
			campaign
		})
	});

	app.get(`/api/campaign/start`, async (req, res) => {
		// Find all ended campaign
		let campaigns = await Campaign.find({ start: { $lt: new Date().getTime() }, end: { $gt: new Date().getTime() } });
		return res.status(200).send({
			error: false,
			campaigns
		})
	});

	app.get(`/api/campaign/end`, async (req, res) => {
		// Find all ended campaign
		let campaigns = await Campaign.find({ end: { $lt: new Date().getTime() } });
		return res.status(200).send({
			error: false,
			campaigns
		})
	});

}