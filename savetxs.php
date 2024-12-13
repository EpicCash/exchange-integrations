<?php session_start(); ?>

// database: epictxs table: txsdata
// id (auto-increment), tranid (integer,unique), slate (varchar(40)), txmsg (varchar(40))
// parse invoice from message0 and match to POS invoice to settle as paid (POS coding needed)
// click 'Get txs' after checkout to see transaction on screen to match invoice and amount
// creates new records in local mariadb/mysql db for easy recall later via php, mysql client, MS/LO Base

if (array_key_exists('txs',$_POST)) {

  $url = 'http://localhost:3420/v2/owner';
  $usrpwd = 'epic:.owner_api_secret'; // from .epic/main/.owner_api_secret
  $con = new mysqli('dbhost', 'dbuser', 'dbpwd', 'epictxs'); // set host, user, pwd
  $sql = 'select id, tranid from txsdata order by id desc limit 1'; //get last transaction id
  $rtn = $con->query($sql);

  if ($rtn) { // check for empty local db if true start at wallet txID 0
    $nr = mysqli_num_rows($rtn);
    if ($nr > 0) { 
      $result = $rtn->fetch_assoc();
      $txid = $result['tranid'];
    } else {
      $txid = -1;
    }
  } else {
    $txid = -1;
  }
  
  $newrec = true;

  while ($newrec) {
    $txid++; // look for wallet txs newer than last local db txs or id=0 if local db empty
    $data = [
      'id' => '1',
      'jsonrpc' => '2.0',
      'method' => 'retrieve_txs',
      'params' => [
        'tx_slate_id' => null,
        'refresh_from_node' => true,
        'tx_id' => $txid
      ],
    ];
    $qs = json_encode($data);
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
      'Content-Type: application/json',
    ]);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_USERPWD, $usrpwd);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $qs);

    $rtn = curl_exec($ch);
    curl_close($ch);

    $output = json_decode($rtn,true);

    //print "<PRE>";
    //print_r($output);
    if (isset($output['result']['Ok']['1']['0']['id'])) {
      if (isset($output['result']['Ok']['1']['0']['tx_slate_id'])) { //check for slate
        $slate = $output['result']['Ok']['1']['0']['tx_slate_id'];
        if ($slate == null) { $slate = ''; }
      } else {
        $slate = '';
      }
      if (isset($output['result']['Ok']['1']['0']['messages']['messages']['0']['message'])) { // check for message0
        $txdata = $output['result']['Ok']['1']['0']['messages']['messages']['0']['message'];
        if ($txdata == null) { $txdata = ''; }
      } else {
        $txdata = '';
      }
      $sql = "INSERT INTO txsdata (tranid, txmsg, slate) VALUES (" . $txid . ", '" . $txdata . "', '" . $slate . "')";
      $rtn = $con->query($sql);
    } else {
      $newrec = false; //no more new wallet txs, end update loop
    }
  }
  $con -> close();
}
?>



