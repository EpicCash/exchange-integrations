// redirect http://your.domain/epiccash/* to deposits.js listener with nginx

//nginx:
//location /epiccash {
//     return 301 http://localhost:8415
//}
//

//const http = require('http');
const { spawn } = require('child_process');
const express = require('express');
const app = express();
const port = 8415;

var amt = 0;

app.post('epiccash/:id', (req, res) => { //production
  var acctid = req.params.id;
  var httpData = '';
  req.on('data', function (prd) {
     httpData += prd;
  })
  .on('end', function () {
    var slate = JSON.parse(httpData);
    var amt = slate.params[0].amount;
    var txid = slate.params[0].id;

    // process deposit amount with account id
    var opt = `/home/epic/deposits.php ${acctid} ${amt} ${txid}`;
    var phpCmd = spawn('php',[opt],{ shell: true });
    
    // now send slate on to wallet
    res.redirect(301, 'http://localhost:3415');
  });
});

app.listen(port);


