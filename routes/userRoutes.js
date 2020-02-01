"use strict";
const mongoose = require('mongoose');
const User = mongoose.model('users');
const utils = require('../utils/utils');
const hkid = require('../utils/hkid');
const Token = require('../utils/token');

module.exports = (app) => {

  // Make new user token
  app.post(`/api/user`, async (req, res) => {
    let parameter = req.body;
    // Check is HKID or not
    let valid_hkid = hkid.isHKID(parameter.hkid);
    if (!valid_hkid) {
      return res.status(200).send({
        error: true,
        message: "HKID is invalid",
      });
    }
    // Find user is exist or not
    let user = await User.findOne({ hkid: parameter.hkid });
    if (user) {
      return res.status(200).send({
        error: true,
        message: "HKID is already registered."
      });
    }
    // Make token
    let tokenClass = new Token();
    const authtimeout = '1h';
    const hash = utils.makestring(6);
    const token = tokenClass.sign(parameter.hkid, hash, authtimeout);
    user = new User;
    user.hkid = parameter.hkid;
    user.hash = hash;
    user.token = token;
    user.save();
    return res.status(201).send({
      error: false,
      user
    });
  });

  // Update user token
  app.put(`/api/user`, async (req, res) => {
    let parameter = req.body;
    let user = await User.findOne({ hkid: parameter.hkid });
    if (!user) {
      return res.status(201).send({
        error: true,
        message: "HKID is invalid."
      });
    }
    let tokenClass = new Token();
    if (parameter.force) {
      const authtimeout = '1h';
      const hash = utils.makestring(6);
      const token = tokenClass.sign(user.hkid, hash, authtimeout);
      user.token = token;
      user.hash = hash;
      user.save();
      return res.status(200).send({
        error: false,
        user
      });
    }
    let verification = tokenClass.verify(parameter.token, user.hash);
    if (verification === "TokenExpiredError") {
      const authtimeout = '1h';
      const hash = utils.makestring(6);
      const token = tokenClass.sign(user.hkid, hash, authtimeout);
      user.token = token;
      user.hash = hash;
      user.save();
      return res.status(200).send({
        error: false,
        user
      });
    }
    else if (verification === true) {
      return res.status(200).send({
        error: true,
        message: 'Your token has not expired.'
      });
    }
    else {
      return res.status(200).send({
        error: true,
        message: 'Token error.'
      });
    }
  });

  // Check user token
  app.patch(`/api/user`, async (req, res) => {
    let parameter = req.body;
    let tokenClass = new Token();
    let data = tokenClass.decode(parameter.token);
    if (parameter.hkid !== data.hkid) {
      return res.status(201).send({
        error: true,
        message: "HKID and Token do not match."
      });
    }
    let user = await User.findOne({ hkid: data.hkid });
    if (!user) {
      return res.status(201).send({
        error: true,
        message: "HKID is invalid."
      });
    }
    let verification = tokenClass.verify(parameter.token, user.hash);
    if (verification === "TokenExpiredError") {
      return res.status(200).send({
        error: true,
        message: 'Your token has expired.'
      });
    }
    else if (verification === true) {
      return res.status(200).send({
        error: false,
        message: 'Your token has not expired.'
      });
    }
    else {
      return res.status(200).send({
        error: true,
        message: 'Token error.'
      });
    }
  });

}