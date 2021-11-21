import { getWeek, useDate, useHassDevice, zeroPad } from "../utils";
import Card from "./Card";
import "./widgets.scss";
import config from "../config.json";

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
    const weatherData = useHassDevice("weather." + config.weather_name);

    return <Card className="weather">Temp: {weatherData?.attributes.temperature}</Card>;
}

export function MediaPlayer() {
    const playerData = useHassDevice("media_player." + config.media_player_name);
    console.log(playerData);
    return <Card className="no-padding media-player"></Card>;
}
