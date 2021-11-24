import hass, { HassApi } from "homeassistant-ws";
import config from "./config.json";
import { EventEmitter } from "events";

const token = config.hass_token;

export interface HassEntity {
    attributes: {
        [key: string]: any;
        friendly_name?: string;
    };
    context: {
        id: string;
        user_id: string;
        parent_id: string;
    };
    entity_id: string;
    last_changed: string;
    last_updated: string;
    state: string;
}

class Hass {
    emitter: EventEmitter;
    hassClient: HassApi | null = null;
    state: { [entityId: string]: HassEntity } = {};

    constructor() {
        this.emitter = new EventEmitter();
        this._createClient();

        setInterval(async () => {
            if (this.hassClient?.rawClient.ws.readyState > 1) {
                await this._createClient();
            }
        }, 1000 * 10);
    }

    _convertStateArrayToMap(stateArray: HassEntity[]) {
        const newState: { [entityId: string]: HassEntity } = {};
        stateArray.forEach((state) => {
            newState[state.entity_id] = state;
        });

        return newState;
    }

    async _createClient() {
        try {
            this.hassClient = await hass({ token, ...config.hass_connection as any });
        } catch {
            console.error("Could not create client!");
            return;
        }

        const initialState: HassEntity[] = await this.hassClient.getStates();
        this.state = this._convertStateArrayToMap(initialState);
        initialState.forEach((state) => {
            this.emitter.emit("state_changed#" + state.entity_id, state);
        });

        this.hassClient.on("state_changed", (event) => {
            this.state[event.data.entity_id] = event.data.new_state;
            this.emitter.emit("state_changed#" + event.data.entity_id, event.data.new_state);
        });
    }

    async send(domain: string, action: string, data: any = {}) {
        return await this.hassClient?.callService(domain, action, data);
    }

    // async getStates() {

    //     return await (await this.hassClient).getStates();
    // }
}

const api = new Hass();

(window as any).api = api;

export default api;
