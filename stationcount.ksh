#!/bin/ksh

# brutal & dirty 10-minutes' station counting
# run in a cron job accordingly

function bomb {
	echo
	echo Error: $@
	echo
	exit 1
}

[[ -z `pgrep airodump-ng` ]] && bomb airodump-ng is not running
[[ ! -d /var/log/stations/ ]] && bomb folder /var/log/stations/ does not exist

day=`date +%Y-%m-%d`

# we're interested in the last 10 minutes activity
lasthour=`date +%H`
(( lastten = `date +%M` - 10 ))

if (( lastten < 0 )); then
	# we need to go backwards an hour
       	lastten=50
	(( lasthour = lasthour - 1 ))
	# 09 - 1 = 8 instead of 08 so...
	(( lasthour < 10 )) && lasthour=0$lasthour
elif (( lastten < 10 )); then
	# 11 - 10 = 1 instead of 01 so...
       	lastten=00
fi

# strip the last digit so we deal with tens of minutes
tens=`echo $lasthour:$lastten | sed 's/[0-9]$//'`

stationseen=`sed -n '/^Station MAC/,$p' /var/log/stations-01.csv | sed '1d; /^[[:space:]]*$/d'`

stationalive=`echo "$stationseen" | grep "$tens"`

stationcount=`echo "$stationalive" | wc -l`

echo $day $lasthour:$lastten, $stationcount >> /var/log/stations/stations.csv

