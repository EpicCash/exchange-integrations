// database: epictxs table: txsdata
// id (auto-increment), tranid (integer,unique), slate (varchar(40)), txmsg (varchar(40))
// parse invoice from message0 and match to POS invoice to settle as paid (POS coding needed)
// click 'Get txs' after checkout to see transaction on screen to match invoice and amount
// creates new records in local mariadb/mysql db for easy recall later via php, mysql client, MS/LO Base

const url = 'http://localhost:3420/v2/owner';
const usrpwd = 'epic:owner_api_secret'; // from .epic/main/.owner_api_secret
//const mysql = require('mysql');

//const con = mysql.createConnection({
//  host: 'dbhost',
//  user: 'dbuser',
//  password: 'dbpwd',
//  database: 'epictxs'
//});

//const sql = 'SELECT id, tranid FROM txsdata ORDER BY id DESC LIMIT 1'; // get last transaction id
//con.query(sql, (error, results) => {
//  let txid = -1;
//  if (error) {
//    txid = -1;
//  } else if (results.length > 0) {
//    txid = results[0].tranid;
//  }
//});

  let txid = -1; // get all txs
  let newrec = true;

  const fetchTransactions = () => {
    if (newrec) {
      txid++; // look for wallet txs newer than last local db txs or id=0 if local db empty
      const data = {
        id: '1',
        jsonrpc: '2.0',
        method: 'retrieve_txs',
        params: {
          tx_slate_id: null,
          refresh_from_node: false,
          tx_id: txid
        }
      };
      const qs = JSON.stringify(data);

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(usrpwd).toString('base64')
        },
        body: qs
      };

      fetch(url, options)
        .then(response => response.json())
        .then(output => {
          if (output.result && output.result.Ok && output.result.Ok[1] && output.result.Ok[1][0]) {
            const result = output.result.Ok[1][0];
            const slate = result.tx_slate_id || '';
            const txdata = result.messages && result.messages.messages[0] ? result.messages.messages[0].message || '' : '';
            console.log('id:', txid, 'txid:', slate, 'msg:', txdata);
//            const insertSql = `INSERT INTO txsdata (tranid, txmsg, slate) VALUES (${txid}, '${txdata}', '${slate}')`;
//            con.query(insertSql, (err) => {
//              if (err) throw err;
              fetchTransactions(); // continue fetching
            //});
          } else {
            newrec = false; // no more new wallet txs, end update loop
//            con.end(); // close the connection
          }
        })
        .catch(err => {
          console.error(err);
          newrec = false; // handle error and stop fetching
//          con.end(); // close the connection
        });
    }
  };

  fetchTransactions();



