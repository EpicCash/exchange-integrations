#! /bin/bash

while true
do
  screen -S ewebox -X quit
  sleep 5
  screen -dmS ewebox /home/epic/epic-wallet -t /home/epic/.epic/main -p <wallet-password> listen -m epicbox
  sleep 5
  tail -f /dev/null
done

