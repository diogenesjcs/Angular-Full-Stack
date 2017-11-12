import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as bitcoin from 'bitcoinjs-lib';
import * as request from 'request';
import * as btcConvert from 'bitcoin-convert';

import User from '../models/user';
import BaseCtrl from './base';


export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        res.status(200).json({ token: token });
      });
    });
  }

  getNewAddress = (req, res) => {
    const testnet = bitcoin.networks.testnet;
    const keyPair = bitcoin.ECPair.makeRandom({ network: testnet});
    const wif = keyPair.toWIF();
    const address = keyPair.getAddress();
    res.json({address: address, key: wif});
  }

  getBalance = (req, res) => {
    const address = req.params.address;
    const requestURL = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`;
    request
    .get(requestURL, (e, r, body) => {
      res.json(btcConvert(JSON.parse(body).balance, 'Satoshi', 'BTC'));
    });
  }


}
