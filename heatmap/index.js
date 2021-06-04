let currentDate = new Date();
const numberOfDays = 31;
const timeFrom = 8;
const timeTo = 22;
const step = 60;
const currentYear = 2021;
const currentMonth = 4;
const fileName = '2021-03-11-sample.csv';

class HeatMap {
    constructor(numberOfDays, timeFrom, timeTo, step) {
        this._numberOfDays = numberOfDays;
        this._timeFrom = timeFrom;
        this._timeTo = timeTo;
        this._step = step;
    }

    generateHeatMapTemplate() {
        const heatmap = document.getElementById('heatmap');

        //Generate line of days for month mode
        for (let i = 0; i < this._numberOfDays; i++) {
            heatmap.querySelector('div.month div.row').insertAdjacentHTML('beforeend', `<div class="day"><p>${i + 1}</p></div>`);
        }

        //Generate line of days for week mode
        let hour = this._timeFrom;
        let minutes = 0;
        let timeCount = 0;
        while (hour <= this._timeTo) {
            if (minutes <= 10) {
                heatmap.querySelector('div.week div.row').insertAdjacentHTML('beforeend', `<div class="day"><p>${hour + ':0' + minutes}</p></div>`);
            } else {
                heatmap.querySelector('div.week div.row').insertAdjacentHTML('beforeend', `<div class="day"><p>${hour + ':' + minutes}</p></div>`);
            }
            minutes += this._step;
            if (minutes >= 60) {
                hour++;
                minutes -= 60;
            }
            timeCount++;
        }
        //Boxes for month mode
        let htmlBoxesMonth = '';
        for (let j = 0; j < this._numberOfDays; j++) {
            htmlBoxesMonth += '<div class="box"></div>';
        }

        let htmlBoxesWeek = '';
        for (let j = 0; j <= timeCount - 1; j++) {
            htmlBoxesWeek += '<div class="box"></div>';
        }

        let currentTime = new Date();
        currentTime.setHours(this._timeFrom, 0);

        hour = this._timeFrom;
        minutes = 0;
        while (hour <= this._timeTo) {
            currentTime.setHours(hour, minutes);
            heatmap.querySelector('#heatmap div.month').insertAdjacentHTML('beforeend', `<div class="row"><p>${currentTime.toLocaleTimeString(['en-GB'],
                { hour: '2-digit', minute: '2-digit' })}</p>${htmlBoxesMonth}</div>`);

            minutes += this._step;
            if (minutes >= 60) {
                minutes -= 60;
                hour++;
            }
        }

        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 0; i < days.length; i++) {
            heatmap.querySelector('#heatmap div.week').insertAdjacentHTML('beforeend', `<div class="row"><p>${days[i]}</p>${htmlBoxesWeek}</div>`);
        }

    }

    boxDataProcessing_Month(data, year, month) {
        const heatmap_rows = document.querySelector('#heatmap div.month').querySelectorAll('div.row');
        const days_in_month = 32 - new Date(year, month, 32).getDate();
        const finishTime = new Date(year, month, days_in_month, this._timeTo, 0);
        let day = 1;
        let row = 1;

        let hour = this._timeFrom;
        let minutes = 0;
        while (true) {
            let initiailTime = new Date(year, month, day, hour, minutes);

            let endTime = new Date(year, month, day, hour, minutes + this._step);

            let filteredDates = data.filter((date) => { if (date.Date >= initiailTime && date.Date < endTime) return date; });
            if (filteredDates.length > 0) {

                let totalUsers = 0;
                filteredDates.forEach(date => totalUsers += date.Users);

                this.boxColoring(row, day - 1, totalUsers, heatmap_rows);
            }

            if (day >= days_in_month) {
                if (initiailTime.getTime() === finishTime.getTime()) break;
                minutes += this._step;
                day = 1;
                row++;
                continue;
            }

            day++;
        }
    }

    boxDataProcessing_Week(data, year, month) {
        const heatmap_rows = document.querySelector('#heatmap div.week').querySelectorAll('div.row');

        let day = 0;
        let row = 1;
        let hour = this._timeFrom;
        let minutes = 0;
        let boxNumber = 0;
        while (true) {
            let filteredDates = data.filter((date) => {
                let initialDate = new Date(year, month, date.Date.getDate(), hour, minutes);
                let endDate = new Date(year, month, date.Date.getDate(), hour, minutes + this._step);

                if (date.Date.getDay() == day && date.Date.getMonth() == month
                    && date.Date >= initialDate && date.Date < endDate)
                    return date;
            });

            let currentTime = new Date(year, month, day, hour, minutes);

            if (filteredDates.length > 0) {
                let totalUsers = 0;
                filteredDates.forEach(date => totalUsers += date.Users);
                this.boxColoring(row, boxNumber, totalUsers, heatmap_rows);
            }

            if (currentTime.getHours() >= this._timeTo) {
                if (row >= 7) break;
                day++;
                row++;
                boxNumber = 0;
                minutes = 0;
                hour = this._timeFrom;
                continue;
            }
            boxNumber++;
            minutes += this._step;
        }
    }


    boxColoring(row, boxNumber, total_users, heatmap_rows) {
        let boxMonth = heatmap_rows[row].querySelectorAll('div.box')[boxNumber];
        console.log(boxMonth)

        if (total_users <= this.color_llb) {
            boxMonth.style.cssText = 'background-color: #d9f0ff;'; // light light blue
            return;
        }
        if (total_users <= this.color_lb) {
            boxMonth.style.cssText = 'background-color: #8fd4ff;'; // light blue
            return;
        }
        if (total_users <= this.color_b) {
            boxMonth.style.cssText = 'background-color: #2eafff;'; // blue
            return;
        }
        if (total_users <= this.color_v) {
            boxMonth.style.cssText = 'background-color: #dd45ff;'; // violet
            return;
        } else if (total_users > this.color_r) {
            boxMonth.style.cssText = 'background-color: #ff006a;'; // Red
            return;
        }
    }

    setColors(data) {
        let users = [];
        data.forEach((date) => {
            users.push(date.Users);
        });

        users.sort((a, b) => { return a - b; });

        let coef = this._step / 10;
        let colorStep = users.length / 6;
        this.color_llb = users[parseInt(colorStep)] * coef;
        this.color_lb = users[parseInt(colorStep * 2)] * coef;
        this.color_b = users[parseInt(colorStep * 3)] * coef;
        this.color_v = users[parseInt(colorStep * 4)] * coef;
        this.color_r = users[parseInt(colorStep * 5)] * coef;
    }

    clearBoxes() {
        const heatmap_rows = document.getElementById('heatmap').querySelectorAll('div.row');

        heatmap_rows.forEach((row) => {
            let boxes = row.querySelectorAll('div.box');
            for (let i = 0; i < boxes.length; i++) {
                boxes[i].style.cssText = 'background-color: #dedede;';
            }
        });
    }
}

async function ready() {
    const heatMap = new HeatMap(numberOfDays, timeFrom, timeTo, step);
    heatMap.generateHeatMapTemplate();
    let data = parseFile(await readFile('csv/'+ fileName));
    heatMap.setColors(data);
    heatMap.boxDataProcessing_Month(data, currentYear, currentMonth);
    heatMap.boxDataProcessing_Week(data, currentYear, currentMonth);

    const menuItems = document.querySelectorAll('div.menu-item');
    const heatmapMonth = document.querySelector('#heatmap div.month');
    const heatmapWeek = document.querySelector('#heatmap div.week');
    // menuItems.forEach(item => {
    //     item.addEventListener('click', () => {
    //         for (let i = 0; i < menuItems.length; i++) {
    //             if (menuItems[i].classList.contains('active')) {
    //                 menuItems[i].classList.remove('active');
    //                 if (item.classList.contains('menu-month')) {
    //                     if (heatmapWeek.classList.contains('active')) {
    //                         heatmapWeek.classList.remove('active');
    //                     }
    //                     if (!heatmapMonth.classList.contains('active')) {
    //                         heatmapMonth.classList.add('active');
    //                     }
    //                 } else {
    //                     heatmapMonth.classList.remove('active');
    //                     heatmapWeek.classList.add('active');
    //                 }
    //             }

    //             item.classList.add('active');
    //         }
    //     });
    // });

    // const buttonShow = document.getElementById('btn-show');
    // buttonShow.addEventListener('click', () => {
    //     heatMap.clearBoxes();
    //     heatMap.boxDataProcessing_Week(data);
    //     heatMap.boxDataProcessing_Month(data);
    // });
}

document.addEventListener("DOMContentLoaded", ready);

function readFile(file) {
    return new Promise((resolve, reject) => {
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    resolve(rawFile.responseText);
                }
            }
        }
        rawFile.send(null);
    });
}

function parseFile(data) {
    data = $.csv.toObjects(data);

    dates = [];

    data.forEach((element) => {
        let tokens = element.Date.split(' ');
        let usersNumber = parseInt(element.Users);

        let record = new Date(tokens[0] + 'T' + tokens[1]);
        dates.push(
            {
                "Date": record,
                "Users": usersNumber
            });
    });

    return dates;
}

function getWeekDay(date) {
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[date.getDay()];
}