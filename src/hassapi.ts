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
    }

    _convertStateArrayToMap(stateArray: HassEntity[]) {
        const newState: { [entityId: string]: HassEntity } = {};
        stateArray.forEach((state) => {
            newState[state.entity_id] = state;
        });

        return newState;
    }

    async _createClient() {
        this.hassClient = await hass({ token, ...config.hass_connection } as any);

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

    // async getStates() {

    //     return await (await this.hassClient).getStates();
    // }
}

const api = new Hass();

export default api;
