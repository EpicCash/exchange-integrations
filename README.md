# Exchange Integrations
Epic Cash Integrations For Exchanges - sample non-production example code to get you started.

Integration Guide and support files for integrating Epic Cash into your Exchange

Deposits and Withdrawals using single wallet

Binaries run in screen session launched as service

Download zip - contains all repo files

savetxs.php - example to maintain separate mysql db of txs

deposits.js - example app to process account id from URL, get tx amount & tx id from slate, update account database, then redirect to wallet

deposits.php - called from deposits.js to update account balance and add transaction to history using php

Contributions of API code to process transactions and update user's Account are encouraged and welcome

Documentation here: https://devdocs.epiccash.com/integrations/exchanges/
```
// nginx to redirect incoming deposit http to listening javascript app:
location /epiccash {
    proxy_pass http://127.0.0.1:8415;
}
```
