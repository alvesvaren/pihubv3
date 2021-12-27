import { getWeek, t, useDate, zeroPad } from "../utils";
import Card from "./Card";
import "./widgets.scss";
import config from "../config.json";
import WeatherIcon, { getWindBearing } from "./WeatherIcon";
import { useInterval, useMount, useNetworkState } from "react-use";
import { useState } from "react";
import WebLink from "./WebLink";
import classNames from "classnames";
import { useMediaPlayer, useWeather } from "homeassistant-react-hooks";

export function Clock() {
    const date = useDate();

    const weekdays = t("weekdays");
    const months = t("months");

    const [hours, minutes, seconds, weekday, day, month, year, week] = [
        zeroPad(date.getHours()),
        zeroPad(date.getMinutes()),
        zeroPad(date.getSeconds()),
        weekdays[date.getDay()],
        date.getDate(),
        months[date.getMonth()].toLowerCase(),
        date.getFullYear().toString(),
        getWeek(date),
    ];

    return (
        <div className='clock'>
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
    const { humidity, temperature, today, wind_bearing, wind_speed, state } = useWeather(props.entityId);

    return (
        <Card className='weather'>
            <div className='current-weather'>
                <WeatherIcon state={state || ""} />
                {temperature}°
            </div>
            <div className='weather-info'>
                <div>
                    <span className='title'>{t("max-temp")}:</span>
                    <span className='value'>{today.temperature ?? "?"}°C</span>
                </div>
                <div>
                    <span className='title'>{t("min-temp")}:</span>
                    <span className='value'>{today.templow ?? "?"}°C</span>
                </div>
                <div>
                    <span className='title'>{t("humidity")}:</span>
                    <span className='value'>{humidity ?? "?"}%</span>
                </div>
                <div>
                    <span className='title'>{t("wind")}:</span>
                    <span className='value'>
                        {wind_speed ?? "?"} km/h {getWindBearing(wind_bearing)}
                    </span>
                </div>
            </div>
        </Card>
    );
}

export function MediaPlayer(props: { entityId: string }) {
    const { isPlaying, imgUrl, togglePause, isLive, hasSong, artist, channel, duration, title, position } = useMediaPlayer(props.entityId);

    const convertTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${zeroPad(seconds)}`;
    };

    return (
        <Card onClick={togglePause} className='no-padding media-player'>
            {imgUrl && <img src={imgUrl} alt='' />}
            <div className='media-info'>
                <header>
                    <p className='title'>{title || channel || t("not-playing")}</p>
                    <p className='artist'>{artist}</p>
                </header>

                {hasSong && (
                    <footer>
                        <div className='timestamps'>
                            {isLive ? (
                                <div className='position'>{t("live")}</div>
                            ) : (
                                <>
                                    <div className='position'>{convertTime(Math.round(position || 0))}</div>
                                    <div className='duration'>{convertTime(duration || 0)}</div>
                                </>
                            )}
                        </div>

                        {isLive || (
                            <div className='progress-container'>
                                <div className='progress-bar' style={{ width: `${(position / duration) * 100}%` }} />
                            </div>
                        )}
                    </footer>
                )}

                {hasSong && (
                    <div className={classNames("pause-overlay", { hidden: isPlaying })}>
                        <div className='rect' />
                        <div className='rect' />
                    </div>
                )}
            </div>
        </Card>
    );
}

export function NewsFeed(props: { url: string }) {
    const { url } = props;
    const { online } = useNetworkState();
    const [newsIndex, setNewsIndex] = useState(0);
    const [news, setNews] = useState<[string, string][]>([]);

    const parser = new DOMParser();

    const fetchNews = async () => {
        const resp = await fetch(url);
        const doc = parser.parseFromString(await resp.text(), "text/xml");
        setNews(
            Array.from(doc.querySelectorAll("item"))
                .map(item => [item.querySelector("title")?.textContent || null, item.querySelector("guid")?.textContent || null].filter(item => item !== null))
                .filter(item => item.length > 0) as [string, string][]
        );
    };

    useInterval(async () => {
        await fetchNews();
        setNewsIndex(Math.floor(Math.random() * news.length));
    }, config.feed_change_interval * 1000);

    useMount(() => {
        fetchNews();
    });

    const article = news[newsIndex];
    if (article) {
        const [title, url] = article;
        return (
            <WebLink href={url}>
                {online ? (
                    <>
                        {title}
                        <span className='no-wrap muted'> {config.feed_short_name}</span>
                    </>
                ) : (
                    "Offline"
                )}
            </WebLink>
        );
    } else {
        return <div></div>;
    }
}
