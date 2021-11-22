import { getWeek, t, useDate, useHassDevice, zeroPad } from "../utils";
import Card from "./Card";
import "./widgets.scss";
import config from "../config.json";
import WeatherIcon, { getWindBearing } from "./WeatherIcon";
import { useEffectOnce, useInterval } from "react-use";
import { useState } from "react";
import WebLink from "./WebLink";
import api from "../hassapi";

export function Clock() {
    const date = useDate();

    const weekdays = t("weekdays");
    console.log(weekdays);
    const months = t("months");

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

export function Weather(props: { entityId: string }) {
    const weatherData = useHassDevice("weather." + props.entityId);

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
                    <span className="title">{t("max-temp")}:</span>
                    <span className="value">{today.temperature ?? "?"}°C</span>
                </div>
                <div>
                    <span className="title">{t("min-temp")}:</span>
                    <span className="value">{today.templow ?? "?"}°C</span>
                </div>
                <div>
                    <span className="title">{t("humidity")}:</span>
                    <span className="value">{humidity ?? "?"}%</span>
                </div>
                <div>
                    <span className="title">{t("wind")}:</span>
                    <span className="value">
                        {wind_speed ?? "?"} km/h {getWindBearing(wind_bearing)}
                    </span>
                </div>
            </div>
        </Card>
    );
}

export function MediaPlayer(props: { entityId: string }) {
    const [realPosition, setRealPosition] = useState(0);
    const playerData = useHassDevice("media_player." + props.entityId);

    const { state, attributes } = playerData ?? {};
    const { media_title, media_artist, entity_picture, media_duration, media_position, media_channel, media_position_updated_at } = attributes ?? {};
    useInterval(() => {
        const currentRealPosition =
            media_position +
            ((state === "playing" ? new Date().getTime() : new Date(media_position_updated_at).getTime()) - new Date(media_position_updated_at).getTime()) /
                1000;
        setRealPosition(currentRealPosition);
    }, 200);

    const convertTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${zeroPad(seconds)}`;
    };

    const isLive = isNaN(realPosition) && media_duration === 0;

    return (
        <Card onClick={() => api.send("media_player", "media_play_pause", { entity_id: "media_player." + props.entityId })} className="no-padding media-player">
            <img src={"//" + config.hass_connection.host + entity_picture} alt="" />
            <div className="media-info">
                <header>
                    <p className="title">{media_title || media_channel}</p>
                    <p className="artist">{media_artist}</p>
                </header>

                <footer>
                    <div className="timestamps">
                        {isLive ? (
                            <div className="position">{t("live")}</div>
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

export function NewsFeed(props: { url: string }) {
    const { url } = props;

    const parser = new DOMParser();
    const [news, setNews] = useState<string[][]>([]);
    const fetchNews = async () => {
        const resp = await fetch(url);
        const doc = parser.parseFromString(await resp.text(), "text/xml");
        setNews(
            Array.from(doc.querySelectorAll("item"))
                .map((item) =>
                    [item.querySelector("title")?.textContent || null, item.querySelector("guid")?.textContent || null].filter((item) => item !== null)
                )
                .filter((item) => item.length > 0) as string[][]
        );
    };

    useEffectOnce(() => {
        const timeoutId = window.setInterval(fetchNews, config.feed_change_interval * 1000);
        fetchNews();
        return () => window.clearTimeout(timeoutId);
    });
    const index = Math.floor(Math.random() * news.length);
    const article = news[index];
    if (article) {
        const [title, url] = article;
        return (
            <WebLink href={url}>
                {title}
                <span className="muted"> Expressen {config.feed_short_name}</span>
            </WebLink>
        );
    } else {
        return <div></div>;
    }
}
