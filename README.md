# Station Counting Units

_quick & dirty wifi station tracker_

## Description

This is a little tool I wrote to help visualize how much crowd there is at the gym every week-day and depending on the time, so I can pick-up the right time to have plenty of space there and enjoy playing with the heavy-iron machines in peace.  Some kind of human heat map.

## Requirements

- BASH or KSH
- Aircrack-NG

Also make sure your [CMOS clock](https://pub.nethence.com/server/ntp) and timezone are alright.

## Install

	cd /root/
	git clone https://github.com/pbraun9/scu.git
<!--
	git clone git@github.com:pbraun9/scu.git
-->

## Setup

Enable at boot-time

	vi /etc/rc.local

	systemctl stop wpa_supplicant.service
	systemctl disable wpa_supplicant.service

	# self-verbose
	airmon-ng start wlan0

	# produces too much logs
	echo stationinit
	nohup /root/scu/stationinit.ksh > /var/log/scu.log 2>&1 &

Grab metrics every 10 minutes -- the script is designed as such, there's no other timing opportunity

	mkdir /var/log/stations/
	crontab -e

	*/10 * * * * /root/scu/stationcount.ksh

## Alternatives

Airodump CSV Tools v0.6
https://github.com/nem777/airodump-csvtools

