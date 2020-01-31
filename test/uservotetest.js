var assert = require('assert');
var axios = require('axios');
var hkid = require('../utils/hkid');
let HKID = hkid.randomHKID();
let token = "";
describe('UserTokenGet', function () {
  it('should return user token', async function () {
    let result = await axios.post('http://localhost:5000/api/user', { hkid: HKID });
    let user = result.data;
    token = user.user.token;
    assert.equal(user.error, false);
  });
});

describe('UserTokenCheck', function () {
  it('should return error=false coz token has not expired', async function () {
    let result = await axios.patch('http://localhost:5000/api/user', { token: token });
    let user = result.data;
    assert.equal(user.error, false);
  });
});

describe('UserTokenUpdate', function () {
  it('should return error=true coz token has not expired', async function () {
    let result = await axios.put('http://localhost:5000/api/user', { hkid: HKID, token: token });
    let user = result.data;
    assert.equal(user.error, true);
  });
});

describe('VoteCandidateGet', function () {
  it('should return all votes with candidate', async function () {
    let result = await axios.put('http://localhost:5000/api/vote', { token: token });
    let votes = result.data;
    assert.equal(votes.error, false);
  });
});

describe('VotePost', function () {
  it('should return vote and campaign', async function () {
    let campaigns_result = await axios.get('http://localhost:5000/api/campaign/start');
    let campaigns = campaigns_result.data.campaigns;
    assert.equal(campaigns_result.data.error, false);
    let vote_result = await axios.post('http://localhost:5000/api/vote', { token: token, campaign: campaigns[0]._id, for: campaigns[0].options[0].option });
    let vote = vote_result.data;
    assert.equal(vote_result.data.error, false);
  });
});
