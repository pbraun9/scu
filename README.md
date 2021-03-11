# Station Counting Units

_quick & dirty wifi station tracker_

## Description

This is a little tool I wrote to help visualize how much crowd there is at the gym every week-day and depending on the time, so I can pick-up the right time to have plenty of space there and enjoy playing with the heavy-iron machines in peace.  Some kind of human heat map.

## Install

	cd /root/
	git clone git@github.com:pbraun9/scu.git

## Setup

Enable at boot time

	vi /etc/rc.d/rc.local

	airmon-ng start wlan0
	nohup /root/scu/stationinit.ksh >/dev/null 2>&1 &

Grab metrics at a 10 minutes rate (the script is designed as such, there's no other timing opportunity)

	mkdir /var/log/stations/
	crontab -e

	*/10 * * * * /root/scu/stationcount.ksh

## Alternatives

Airodump CSV Tools v0.6
https://github.com/nem777/airodump-csvtools

