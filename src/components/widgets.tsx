import { getWeek, useDate, zeroPad } from "../utils";
import Card from "./Card";
import "./widgets.scss";

export function Clock() {
    const date = useDate();

    const weekdays = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];
    const months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

    const [hours, minutes, seconds, weekday, day, month, year, week] = [
        date.getHours(),
        zeroPad(date.getMinutes()),
        zeroPad(date.getSeconds()),
        weekdays[date.getDay()],
        date.getDate(),
        months[date.getMonth()].toLowerCase(),
        date.getFullYear().toString(),
        getWeek(date),
    ];

    return (
        <div className="clock">
            <h1>
                {hours}:{minutes}:{seconds}
            </h1>
            <h2>
                {weekday} {day} {month} {year} v{week}
            </h2>
        </div>
    );
}

export function Weather() {
    return <Card className="weather"></Card>;
}

export function MediaPlayer() {
    return <Card className="no-padding media-player"></Card>;
}
