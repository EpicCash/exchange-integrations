// redirect http://your.domain/epiccash/* to deposits.js listener with nginx:
// location /epiccash {
//     proxy_pass http://127.0.0.1:8415
// }

const { spawn } = require('child_process');
const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 8415;

var amt = 0;

app.post('/home/epic/:id', (req, res) => {
  var acctid = req.params.id;
  var httpData = '';
  req.on('data', function (prd) {
     httpData += prd;
  })
  .on('end', function () {
    var slate = JSON.parse(httpData);
    var txamt = slate.params[0].amount;
    var txid = slate.params[0].id;

    // process deposit amount with account id using php
    //var opt = `/home/epic/deposits.php ${acctid} ${amt} ${txid}`;
    //var phpCmd = spawn('php',[opt],{ shell: true });
    
    const conn = mysql.createConnection({
      host: 'dbhost',
      user: 'dbuser',
      password: 'dbpwd',
      database: 'db'
    });

    conn.connect();

    const sqlSelect = `SELECT epicbal FROM users WHERE acctid = ?`;
    conn.query(sqlSelect, [acctid], (error, results) => {
      if (error) throw error;

      const epic = results[0].epicbal + parseFloat(txamt*.00000001);

    });

    // update account epic balance
    const sqlUpdate = `UPDATE users SET epicbal = ? WHERE acctid = ?`;
    conn.query(sqlUpdate, [epic, acctid], (error) => {
      if (error) throw error;
    });

    // add transaction to history
    const sqlInsert = `INSERT INTO epictxs (acctid, txamt, txid, txdate) VALUES (?, ?, ?, ?)`;
    const txdate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    conn.query(sqlInsert, [acctid, txamt, txid, txdate], (error) => {
      if (error) throw error;
    });
    conn.end();

    // now send slate on to wallet
    res.redirect(301, 'http://localhost:3415');

  });
});

app.listen(port);


