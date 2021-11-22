import "./app.scss";
import Card from "./components/Card";
import { Clock, MediaPlayer, NewsFeed, Weather } from "./components/widgets";
import WebOverlay, { OverlayContext } from "./components/Overlay";
import { useState } from "react";
import WebLink from "./components/WebLink";
import config from "./config.json";
interface AppData {
    name: string;
    imgUrl: string;
    url: string;
}

function AppIcon(props: { app: AppData }) {
    return (
        <WebLink className="app-icon" href={props.app.url}>
            <img src={props.app.imgUrl} alt={props.app.name + " logo"} />
        </WebLink>
    );
}

const apps: { [id: string]: AppData } = config.apps;

function App() {
    const [overlayUrl, setOverlayUrl] = useState<string>("");

    return (
        <OverlayContext.Provider value={setOverlayUrl}>
            <div id="app">
                <div id="widget-grid">
                    <Clock />
                    <Weather entityId={config.weather_name} />
                    <MediaPlayer entityId={config.media_player_name} />
                </div>
                <div className="app-bar">
                    <Card className="app-bar-card">
                        {Object.keys(apps).map((appId) => (
                            <AppIcon app={apps[appId]} key={appId} />
                        ))}
                        <div className="spacer" />
                        <NewsFeed url={config.rss_source} />
                    </Card>
                </div>
                <WebOverlay url={overlayUrl} />
            </div>
        </OverlayContext.Provider>
    );
}

export default App;
