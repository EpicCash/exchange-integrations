// redirect http://your.domain/epiccash/* to deposits.js listener with nginx

//nginx:
//location /epiccash {
//     return 301 http://localhost:8415
//}
//

const http = require('http');
const express = require('express');
const app = express();
const port = 8415;

// get account id, amount
app.post('/epiccash/:id', (req, res) => {
  const acctid = req.params.id;
  const httpData = '';
  req.on('data', function (prd) {
     httpData += prd;
  })
  .on('end', function () {
    const slate = httpData.toString();
    // find amt in slate
    const start = slate.indexOf("amount") + 10;
    const end = slate.indexOf("fee") - 3;
    const lgth = end - start;
    const amt = slate.substring(start, start + lgth) * .00000001;
    //console.log('start: ', start, ' end: ', end, 'lgth: ', lgth, ' amt:', amt);
    //res.end('\n');

    // process deposit amount with account id

    // now send slate on to wallet
    res.redirect(301, 'http://localhost:3415');
  });
});

app.listen(port);


