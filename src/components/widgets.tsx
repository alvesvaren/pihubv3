import { getWeek, useDate, useHassDevice, zeroPad } from "../utils";
import Card from "./Card";
import "./widgets.scss";
import config from "../config.json";
import WeatherIcon, { getWindBearing } from "./WeatherIcon";
import { useInterval } from "react-use";
import { useState } from "react";

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

    const { humidity, temperature, wind_speed, wind_bearing, forecast } = weatherData?.attributes ?? {};
    const today = forecast?.[0] ?? {};

    return (
        <Card className="weather">
            <div className="current-weather">
                <WeatherIcon state={weatherData?.state || ""} />
                {temperature}°
            </div>
            <div className="weather-info">
                <div>
                    <span className="title">Högsta:</span>
                    <span className="value">{today.temperature ?? "?"}°C</span>
                </div>
                <div>
                    <span className="title">Lägsta:</span>
                    <span className="value">{today.templow ?? "?"}°C</span>
                </div>
                <div>
                    <span className="title">Luftfuktighet:</span>
                    <span className="value">{humidity ?? "?"}%</span>
                </div>
                <div>
                    <span className="title">Vind:</span>
                    <span className="value">
                        {wind_speed || "?"} km/h {getWindBearing(wind_bearing)}
                    </span>
                </div>
            </div>
        </Card>
    );
}

export function MediaPlayer() {
    const [realPosition, setRealPosition] = useState(0);
    const playerData = useHassDevice("media_player." + config.media_player_name);

    const { state, attributes } = playerData ?? {};
    const { media_title, media_artist, entity_picture, media_duration, media_position, media_channel, media_position_updated_at } = attributes ?? {};
    useInterval(() => {
        const currentRealPosition = media_position + (new Date().getTime() - new Date(media_position_updated_at).getTime()) / 1000;
        setRealPosition(currentRealPosition);
    }, 200);

    const convertTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${zeroPad(seconds)}`;
    };

    const isLive = isNaN(realPosition) && media_duration === 0;

    return (
        <Card className="no-padding media-player">
            <img src={"//" + config.hass_connection.host + entity_picture} alt="" />
            <div className="media-info">
                <header>
                    <p className="title">{media_title || media_channel}</p>
                    <p className="artist">{media_artist}</p>
                </header>

                <footer>
                    <div className="timestamps">
                        {isLive ? (
                            <div className="position">Live</div>
                        ) : (
                            <>
                                <div className="position">{convertTime(Math.round(realPosition))}</div>
                                <div className="duration">{convertTime(media_duration)}</div>
                            </>
                        )}
                    </div>
                    {isLive || (
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${(realPosition / media_duration) * 100}%` }} />
                        </div>
                    )}
                </footer>
            </div>
        </Card>
    );
}
