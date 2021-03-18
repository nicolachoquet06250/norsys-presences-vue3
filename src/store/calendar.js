import { ref, computed } from 'vue';

const current_date = ref(new Date());
const calendar = ref({});
const calendar_date = ref({ year: new Date().getFullYear(), month: new Date().getMonth(), full_current_date: new Date() });
const nb_days = ref({ previous: null, current: null });
const bank_holidays = ref({});

function useCalendar() {
    const range = (a, b) => [...Array(b - a).keys()].map(i => i + a);
    function nextDate() {
        let next_date;
  
        if (current_date.value.getMonth() + 1 === 12) {
            next_date = new Date(current_date.value.getFullYear() + 1, 0);
        } else {
            next_date = new Date(current_date.value.getFullYear(), current_date.value.getMonth() + 1);
        }

        setCalendarDate(next_date.getFullYear(), next_date.getMonth() + 1);

        current_date.value = next_date;
    }
    function previousDate() {
        let previous_date;
  
        if (current_date.value.getMonth() + 1 === 1) {
            previous_date = new Date(current_date.value.getFullYear() - 1, 11);
        } else {
            previous_date = new Date(current_date.value.getFullYear(), current_date.value.getMonth() - 1);
        }

        setCalendarDate(previous_date.getFullYear(), previous_date.getMonth() + 1);

        current_date.value = previous_date;
    }
    function setCalendar(_calendar) {
        calendar.value = _calendar;
    }
    function setCalendarDate(year, month) {
        calendar_date.value = { full_current_date: calendar_date.value.full_current_date, year, month };
    }
    function setNbDays(previous, current) {
        nb_days.value = { previous, current };
    }
    function isBankHoliday(date) {
        date = new Date(date);
        date = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;

        return Object.keys(bank_holidays.value).reduce((r, c) => {
            if (c === date) r = c;
            return r;
        }, false);
    }
    function getBankHolidayLabel(date) {
        return isBankHoliday(date) ? bank_holidays.value[date] : '';
    }
    function registerBankHoliday() {
        fetch(`https://calendrier.api.gouv.fr/jours-feries/metropole/${calendar_date.value.year}.json`)
            .then(r => r.json())
            .then(json => {
                bank_holidays.value = json;
            });
    }

    if (calendar_date.value.year !== null) {
        registerBankHoliday();
    }

    return {
        current_date: computed(() => current_date.value),
        calendar: computed(() => {
            const _calendar = calendar.value;

            let previous_month_nb_days = nb_days.value.previous;

            // get all week numbers to integer format for keep order
            const calendar_keys = calendar_date.value.month === 1 
            ? Object.keys(_calendar) : Object.keys(_calendar).map(n => parseInt(n)).sort((x, y) => x - y);

            let i = 0;

            for (let key of calendar_keys) {
            const week_nb_str = typeof key === 'number' ? `${key < 10 ? '0' : ''}${key}` : key;
            _calendar[week_nb_str] = _calendar[week_nb_str]
                .reduce((reducer, curr) => {
                if (curr.day < 6) reducer.push(curr);
                return reducer;
                }, []);
            
            const week = _calendar[week_nb_str];

            // calcul of external previous month days
            if (i === 0) {
                if (week.length < 5) {
                let nb_days_to_first_day = 0;
                const first_week_day_number = week[0] ? week[0].day : 1;
                for (let n = 0; n < first_week_day_number - 1; n++) nb_days_to_first_day++;
                previous_month_nb_days -= nb_days_to_first_day;
                
                let first_days_of_month = [];
                for (let j in range(1, nb_days_to_first_day + 1)) {
                    const date = new Date();
                    date.setYear(parseInt(calendar_date.value.month) === 12 ? parseInt(calendar_date.value.year) + 1 : calendar_date.value.year);
                    date.setMonth(parseInt(calendar_date.value.month) === 12 ? 1 : calendar_date.value.month + 1);
                    date.setDate(previous_month_nb_days);

                    first_days_of_month.push({
                    date: `${date.getFullYear()}-${date.getMonth() < 10 ? '0' : ''}${date.getMonth()}-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`,
                    day: j,
                    presences: [],
                    reservations: [],
                    external_day: true
                    });
                    
                    previous_month_nb_days ++;
                }
                _calendar[week_nb_str] = [...first_days_of_month, ...week];
                }
            }

            // calcul of external next month days
            if (i === calendar_keys.length - 1) {
                if (week.length < 5) {
                const difference = 5 - week.length;

                let last_day = week[week.length - 1].day;

                for (let j = 1; j <= difference; j++) {
                    _calendar[week_nb_str].push({
                    date: `--${j}`,
                    day: last_day,
                    presences: [],
                    reservations: [],
                    external_day: true
                    });

                    last_day++;
                }
                }
            }

            i++;
            }

            return _calendar;
        }),
        calendar_date: computed(() => calendar_date.value),
        nb_days: computed(() => nb_days.value),
        bank_holidays: computed(() => bank_holidays.value),
        
        nextDate,
        previousDate,
        setCalendar,
        setCalendarDate,
        setNbDays,
        registerBankHoliday,
        isBankHoliday,
        getBankHolidayLabel
    }
}

export default useCalendar;