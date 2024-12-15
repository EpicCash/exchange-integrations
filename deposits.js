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

// get account id, amount, txid
app.post('epiccash/:id', (req, res) => { //production
//app.post('/',  (req, res) => { //for testing
  var acctid = req.params.id;
  var httpData = '';
  req.on('data', function (prd) {
     httpData += prd;
  })
  .on('end', function () {
    var slate = httpData.toString();
    // find amt & txid in slate
    var start = slate.indexOf("amount") + 10;
    var end = slate.indexOf("fee") - 3;
    var lgth = end - start;
    var amt = slate.substring(start, start + lgth) * .00000001;
    start = slate.indexOf("lock") - 40;
    var txid = slate.substring(start, start + 36);

    // process deposit amount with account id
    var opt = `/home/epic/deposits.php ${acctid} ${amt} ${txid}`;
    var phpCmd = spawn('php',[opt],{ shell: true });
    /*phpCmd.stdout.on('data',
      (data) => {
        console.log(`stdout: ${data}`);
    });
    phpCmd.stderr.on('data',
      (data) => {
        console.error(`stderr: ${data}`);
    });
    phpCmd.on('close',
      (code) => {
        console.log(
            `child process exited with code ${code}`
        );
    });*/
    
    // now send slate on to wallet
    res.redirect(301, 'http://localhost:3415');
  });
});

app.listen(port);


