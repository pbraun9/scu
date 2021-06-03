    function ready() {
        const list = [
            new TimeAndClicks(new Date(), 100),
            new TimeAndClicks(new Date(), 200),
            new TimeAndClicks(new Date(), 300),
            new TimeAndClicks(new Date(), 400),
            new TimeAndClicks(new Date(), 500),
        ];
        const collapser = new WeekDayCollapser(list);
        console.log(collapser.collapse());
    }


    const groupBy = function(xs, keyFn) {
        groupedBy = {};
        xs.map((item) => {
            const key = keyFn(item);
            if (groupedBy[key] == undefined) {
                groupedBy[key] = [];
            } 
            groupedBy[key].push(item);
        });
        return groupedBy
    };


    class TimeAndClicksCollapser {
        constructor(timeAndClicks) {
            this.timeAndClicks = timeAndClicks;
        }

        collapse() {
            [].reduce
            const grouped = groupBy(this.timeAndClicks, this.collapseKey);
            Object.keys(grouped)
                .map((key, value) => grouped[key] = grouped[key].reduce((acc, current) => acc + current.clicks, 0));
            return grouped;
        }
        collapseKey(item) { return undefined; }
    }

    class WeekDayCollapser extends TimeAndClicksCollapser {
        constructor(timeAndClicks) {
            super(timeAndClicks)
        }
        collapseKey(item) {
            return item.time.getDay();
        }
    }

    class MonthDayCollapser extends TimeAndClicksCollapser {
        constructor(timeAndClicks) {
            super(timeAndClicks)
        }
        collapseKey(item) {
            return item.time.getDate();
        }
    }

    class TimeAndClicks {
        constructor(time, clicks) {
            this.time = time;
            this.clicks = clicks;
        }
    }
