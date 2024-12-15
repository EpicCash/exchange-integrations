<?php
//called from deposits.js

$acctid = $argv[1];
$txamt = $argv[2];
$txid = $argv[3];

$con = new mysqli('dbhost', 'dbuser', 'dbpwd', 'db'); // set host, user, pwd, db - tables: users & epictxs
$sql = 'SELECT epicbal from users WHERE acctid = ' . $acctid;
$rtn = $con->query($sql);

$result = $rtn->fetch_assoc();
$epic = $result['epicbal'];
$epic = $epic + (float)$txamt;

// update account epic balance
$sql = "UPDATE users SET epicbal = " . $epic . " WHERE acctid = '" . $acctid . "'";
$rtn = $con->query($sql);

// add transaction to history
$sql = "INSERT INTO epictxs (acctid, txamt, txid, txdate) VALUES ('" . $acctid . "', " . $txamt;
$sql .= ", '" . $txid . "', '" . date('Y-m-d H:i:s') . "'";
$rtn = $con->query($sql);

$con -> close();
?>



