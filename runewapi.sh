#! /bin/bash

while true
do
  screen -S ewapi -X quit
  sleep 5
  screen -dmS ewapi /home/epic/epic-wallet -t /home/epic/.epic/main -p <wallet-password> owner_api
  sleep 5
  tail -f /dev/null
done

