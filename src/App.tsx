import "./app.scss";
import Card from "./components/Card";
import { Clock, MediaPlayer, NewsFeed, Weather } from "./components/widgets";
import WebOverlay, { OverlayContext } from "./components/Overlay";
import { useState } from "react";
import WebLink from "./components/WebLink";
import config from "./config.json";
import classNames from "classnames";
import { useNetworkState } from "react-use";
import { useDate } from "./utils";
import { HassProvider } from "homeassistant-react-hooks";
interface AppData {
    name: string;
    imgUrl: string;
    url: string;
}

function AppIcon(props: { app: AppData }) {
    return (
        <WebLink className='app-icon' href={props.app.url}>
            <img src={props.app.imgUrl} alt={props.app.name + " logo"} />
        </WebLink>
    );
}

const apps: { [id: string]: AppData } = config.apps;

function App() {
    const [overlayUrl, setOverlayUrl] = useState<string>("");
    const { online } = useNetworkState();

    const date = useDate();
    // console.log(date);
    const hour = date.getHours();
    const minute = date.getMinutes();

    const parseTimeStr = (timeStr: string): [number, number] => {
        const [hours, minutes] = timeStr.split(":").map(x => parseInt(x));
        return [hours, minutes];
    };

    // check if the current time is between the given times
    const isBetween = (timeStr1: string, timeStr2: string): boolean => {
        const [time1, time2] = [timeStr1, timeStr2].map(parseTimeStr);

        const oneDay = 24 * 60;
        const start = time1[0] * 60 + time1[1];
        let end = time2[0] * 60 + time2[1];
        let current = hour * 60 + minute;

        if (end < start) {
            end += oneDay;

            if (current < start) {
                current += oneDay;
            }
        }

        return current > start && current < end;
    };

    const [startDark, endDark] = config.dark_mode_interval;
    const dark = isBetween(startDark, endDark);

    return (
        <OverlayContext.Provider value={setOverlayUrl}>
            <HassProvider token={config.hass_token} connectionOptions={config.hass_connection as any}>
                <div id='app' className={classNames({ offline: !online, dark })}>
                    <div id='widget-grid'>
                        <Clock />
                        <Weather entityId={config.weather_name} />
                        <MediaPlayer entityId={config.media_player_name} />
                    </div>
                    <div className='app-bar'>
                        <Card className='app-bar-card'>
                            {Object.keys(apps).map(appId => (
                                <AppIcon app={apps[appId]} key={appId} />
                            ))}
                            <div className='spacer' />
                            <NewsFeed url={config.rss_source} />
                        </Card>
                    </div>
                    <WebOverlay url={overlayUrl} />
                </div>
            </HassProvider>
        </OverlayContext.Provider>
    );
}

export default App;
