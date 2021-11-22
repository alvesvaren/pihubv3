#!/bin/bash
sleep 5
yarn serve &
PIHUB_PID=$!
sleep 5
startx $(which chromium-browser) --window-size=801,481 --window-position=0,0 --disable-web-security --user-data-dir=$HOME/.pihub_browser --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --disable-site-isolation-trials --kiosk http://localhost:3000 -- -nocursor
# Kill pihub server process after browser closes
kill -9 $PIHUB_PID
