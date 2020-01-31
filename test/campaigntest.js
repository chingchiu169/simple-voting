var assert = require('assert');
var axios = require('axios');
var utils = require('../utils/utils');
describe('CampaignGet', function () {
  it('should return all campaigns', async function () {
    let result = await axios.get('http://localhost:5000/api/campaign');
    let campaigns = result.data;
    assert.equal(campaigns.error, false);
  });
});

describe('CampaignStartGet', function () {
  it('should return all started campaigns', async function () {
    let result = await axios.get('http://localhost:5000/api/campaign/start');
    let campaigns = result.data;
    assert.equal(campaigns.error, false);
  });
});

describe('CampaignEndGet', function () {
  it('should return all ended campaigns', async function () {
    let result = await axios.get('http://localhost:5000/api/campaign/end');
    let campaigns = result.data;
    assert.equal(campaigns.error, false);
  });
});

describe('CampaignAdd', function () {
  it('should return no error and new campaign', async function () {
    let options = [];
    for (var i = 0; i < 4; i++) {
      options.push({ option: utils.makestring(6), voted: 0 });
    }
    let startdate = new Date();
    let start = startdate.setDate(startdate.getDate() - 7);
    let enddate = new Date();
    let end = enddate.setDate(enddate.getDate() + 7);
    let result = await axios.post('http://localhost:5000/api/campaign', { title: utils.makestring(6), description: utils.makestring(10), start: start, end: end, options: options });
    let campaigns = result.data;
    assert.equal(campaigns.error, false);
  });
});