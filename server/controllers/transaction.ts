import Transaction from '../models/transaction';
import BaseCtrl from './base';

import * as btcConvert from 'bitcoin-convert';
import * as bitcoin from 'bitcoinjs-lib';
import * as request from 'request';
import * as bigi from 'bigi';
import * as buffer from 'buffer';

const testnet = bitcoin.networks.testnet;


export default class TransactionCtrl extends BaseCtrl {
  model = Transaction;

  // New Transaction
  newTransaction = (req, res) => {
    const obj = new this.model(req.body);
    const valueSatoshi = btcConvert(obj.value, 'BTC', 'Satoshi');
    const key = bitcoin.ECPair.fromWIF(req.body.key, testnet);

      const newtx = {
        inputs: [{addresses: [req.body.source]}],
        outputs: [{addresses: [req.body.address], value: valueSatoshi}]
      };
      request.post({
        url:     'https://api.blockcypher.com/v1/btc/test3/txs/new',
        body:    JSON.stringify(newtx),
        timeout: 500000
      }, function(error, response){
        const transactionObj = JSON.parse(response.body);
        transactionObj.pubKeys = [];
        transactionObj.signatures = transactionObj.tosign.map(function(tosign, n) {
          transactionObj.pubKeys.push(key.getPublicKeyBuffer().toString('hex'));
          return key.sign(new buffer.Buffer(tosign, 'hex')).toDER().toString('hex');
        });
        request.post({
          url:     'https://api.blockcypher.com/v1/btc/test3/txs/send',
          body:    JSON.stringify(transactionObj),
          timeout: 500000
        }, function(err, resp){
          const finalInfo = JSON.parse(resp.body);
          obj.id =  finalInfo;
          obj.save((er, item) => {
            // 11000 is the code for duplicate key error
            if (err && err.code === 11000) {
              res.sendStatus(400);
            }
            if (err) {
              return console.error(err);
            }
            res.status(200).json(item);
          });
        });

      });

    // });
  }

}
