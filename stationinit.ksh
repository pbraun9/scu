#!/bin/ksh

# always and only write to stations-01.csv
rm -f /var/log/stations-*

exec airodump-ng --manufacturer --uptime --wps --output-format csv --write-interval 2 --write /var/log/stations wlan0mon

