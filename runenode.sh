#! /bin/bash

while true
do
  screen -S epic-node -X quit
  sleep 5
  screen -dmS epic-node /home/epic/epic
  sleep 10
  tail -f /dev/null
done

