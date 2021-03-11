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

date=`date +%Y-%m-%d-%H:%M:%S`

# we're interested in the last 10 minutes activity
hour=`date +"%Y-%m-%d %H"`
(( lastten = `date +%M` - 10 ))

# 11 - 10 = 1 instead of 01 so...
(( lastten < 10 )) && lastten=00

# strip the last digit so we deal with tens of minutes
tens=`echo $hour:$lastten | sed 's/[0-9]$//'`

stationseen=`sed -n '/^Station MAC/,$p' /var/log/stations-01.csv | sed '1d; /^[[:space:]]*$/d'`

stationalive=`echo "$stationseen" | grep "$tens"`

stationcount=`echo "$stationalive" | wc -l`

cat >> /var/log/stations/stations.csv <<EOF9
$date, $stationcount
EOF9

