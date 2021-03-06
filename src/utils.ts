import config from "./config.json";
import React from "react";
import { useInterval } from "react-use";
import svTranslation from "./translations/sv.json";
import enTranslation from "./translations/en.json";

const translations: { [lang: string]: { [key: string]: any } } = {
    sv: svTranslation,
    en: enTranslation,
};

export function useDate() {
    const [date, setDate] = React.useState(new Date());
    useInterval(() => {
        setTimeout(() => {
            setDate(new Date());
        }, 1001 - new Date().getMilliseconds());
    }, 1000);
    return date;
}

export function zeroPad(num: number) {
    return (num < 10 ? "0" : "") + num;
}

export function getWeek(date: Date) {
    var _date = new Date(date.getTime());
    _date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    _date.setDate(_date.getDate() + 3 - ((_date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    var week1 = new Date(_date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((_date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

export function t(key: string) {
    return translations[config.lang][key];
}
