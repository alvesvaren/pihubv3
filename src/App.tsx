import "./app.scss";
import Card from "./components/Card";
import { Clock, MediaPlayer, Weather } from "./components/widgets";
import MatlistanLogo from "./img/logos/matlistan_icon.png";
import GrafanaLogo from "./img/logos/grafana_icon.png";
import HomeAssistantLogo from "./img/logos/home_assistant_icon.svg";
interface AppData {
    name: string;
    imgUrl: string;
    url: string;
}

function AppIcon(props: { app: AppData }) {
    return <img className="app-icon" src={props.app.imgUrl} alt={props.app.name + " logo"} />;
}

const apps: { [id: string]: AppData } = {
    matlistan: { name: "Matlistan", imgUrl: MatlistanLogo, url: "https://www.matlistan.se/recipes" },
    grafana: { name: "Grafana", imgUrl: GrafanaLogo, url: "https://grafana.svaren.dev" },
    homeassistant: { name: "Home Assistant", imgUrl: HomeAssistantLogo, url: "https://ha.svaren.dev" },
};

function App() {
    return (
        <div id="app">
            <div id="widget-grid">
                <Clock />
                <Weather />
                <MediaPlayer />
            </div>
            <div className="app-bar">
                <Card className="app-bar-card">
                    <AppIcon app={apps.matlistan} />
                    <AppIcon app={apps.grafana} />
                    <AppIcon app={apps.homeassistant} />
                </Card>
            </div>
        </div>
    );
}

export default App;
