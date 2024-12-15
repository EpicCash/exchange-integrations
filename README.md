# Exchange Integrations
Epic Cash Integrations For Exchanges

Integration Guide and support files for integrating Epic Cash into your Exchange

Deposits and Withdrawals using single wallet

Binaries run in screen session launched as service

Download zip - contains all repo files

savetxs.php - example to maintain separate mysql db of txs

deposits.js - example app to process account id from URL and get tx amount from slate then redirect to wallet

Contributions of API code to process transactions and update user's Account are encouraged and welcome

Documentation here: https://devdocs.epiccash.com/integrations/exchanges/

nginx to redirect incoming deposit http to listening preprocess javascript app:

location /epiccash {

     return 301 http://localhost:8415
     
}
