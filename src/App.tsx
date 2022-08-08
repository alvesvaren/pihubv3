import "./app.scss";
import Card from "./components/Card";
import { Clock, MediaPlayer, Weather } from "./components/widgets";
import WebOverlay, { OverlayContext } from "./components/Overlay";
import { useState } from "react";
import WebLink from "./components/WebLink";
import config from "./config.json";
import classNames from "classnames";
import { useNetworkState } from "react-use";
import { useDate } from "./utils";
import { HassProvider } from "homeassistant-react-hooks";
import BoilerStatus from "./components/BoilerStatus";
interface AppData {
    name: string;
    imgUrl: string;
    url: string;
}

export interface OverlayData {
    url: string;
    visible: boolean;
}

function AppIcon(props: { app: AppData }) {
    return (
        <WebLink className='app-icon' href={props.app.url}>
            <img src={props.app.imgUrl} alt={props.app.name + " logo"} />
        </WebLink>
    );
}

const useShouldBeDark = () => {
    const [startDark, endDark] = config.dark_mode_interval;
    const date = useDate();

    const hour = date.getHours();
    const minute = date.getMinutes();

    const parseTimeStr = (timeStr: string): [number, number] => {
        const [hours, minutes] = timeStr.split(":").map(x => parseInt(x));
        return [hours, minutes];
    };

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

    // check if the current time is between the given times
    return isBetween(startDark, endDark);
};

const apps: { [id: string]: AppData } = config.apps;

function App() {
    const [overlayData, setOverlayData] = useState<OverlayData>({ url: "", visible: false });
    const { online } = useNetworkState();
    const dark = useShouldBeDark();

    return (
        <OverlayContext.Provider value={setOverlayData}>
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
                            {/* <NewsFeed url={config.rss_source} /> */}
                            <BoilerStatus />
                        </Card>
                    </div>
                    <WebOverlay data={overlayData} />
                </div>
            </HassProvider>
        </OverlayContext.Provider>
    );
}

export default App;
