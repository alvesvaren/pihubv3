import "./app.scss";
import Card from "./components/Card";
import { Clock, MediaPlayer, NewsFeed, Weather } from "./components/widgets";
import MatlistanLogo from "./img/logos/matlistan_icon.png";
import GrafanaLogo from "./img/logos/grafana_icon.png";
import HomeAssistantLogo from "./img/logos/home_assistant_icon.svg";
import WebOverlay, { OverlayContext } from "./components/Overlay";
import { useState } from "react";
import WebLink from "./components/WebLink";
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

const apps: { [id: string]: AppData } = {
    matlistan: { name: "Matlistan", imgUrl: MatlistanLogo, url: "https://www.matlistan.se/recipes" },
    grafana: { name: "Grafana", imgUrl: GrafanaLogo, url: "https://grafana.svaren.dev" },
    homeassistant: { name: "Home Assistant", imgUrl: HomeAssistantLogo, url: "https://ha.svaren.dev" },
};

function App() {
    const [overlayUrl, setOverlayUrl] = useState<string>("");

    return (
        <OverlayContext.Provider value={setOverlayUrl}>
            <div id="app">
                <div id="widget-grid">
                    <Clock />
                    <Weather />
                    <MediaPlayer />
                </div>
                <div className="app-bar">
                    <Card className="app-bar-card">
                        {Object.keys(apps).map((appId) => (
                            <AppIcon app={apps[appId]} key={appId} />
                        ))}
                        <div className="spacer" />
                        <NewsFeed url="https://cors.svaren.dev/https://feeds.expressen.se/nyheter/" />
                    </Card>
                </div>
                <WebOverlay url={overlayUrl} />
            </div>
        </OverlayContext.Provider>
    );
}

export default App;
