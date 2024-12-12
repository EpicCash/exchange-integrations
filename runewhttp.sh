#! /bin/bash

while true
do
  screen -S ewhttp -X quit
  sleep 5
  screen -dmS ewhttp /home/epic/epic-wallet -t /home/epic/.epic/main -p <wallet-password> listen -m http
  sleep 5
  tail -f /dev/null
done

