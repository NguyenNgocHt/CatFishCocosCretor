import VDWebSocketClient, { WEBSOCKET_GAME_STATE } from "../../../../vd-framework/network/VDWebSocketClient";
import { cf_GameListener } from "./cf_GameListener";
import { cf_Config } from "../common/cf_Config";
import { cf_Director } from "../core/cf_Director";
import { bets_data_inputSever, call_to_sever_update_money, end_game_leaveGame_inputSever, Ping_inputSever, play_ready_inputSever, playing_leave_game_inputSever, playing_tap_inputSever, recconnect_inputSever, stopMaching_inputSever } from "../model/cf_data_Input_model";
import { JsonAsset } from "cc";
import { RenderFlow } from "cc";
import { log } from "cc";

export class cf_WebSocket extends VDWebSocketClient {
    _isInit: boolean = false;

    constructor() {
        super();
    }

    connectToServer(token: number, userID: number, connectSuccessCallback?: any) {
        log(window.location.href);
        this._isInit = true;

        var ip = cf_Config.host_url;
        var port = cf_Config.port;
        var isHttps = cf_Config.isHttps;
        var user_ID = userID;

        var listener = new cf_GameListener();
        listener.setConnectedCallback(connectSuccessCallback);
        cf_Director.instance.wsGameState = WEBSOCKET_GAME_STATE.CONNECTING;
        this.connect(ip, port, isHttps, user_ID, listener, token);
    }

    sendLogin() {
        let msgStr = JSON.stringify({
            userName: 'user_1',
            money: 1000,
            level: 11
        });
        this.send(msgStr);
    }

    startPlay() {
        let msgStr = JSON.stringify({
            action: 'play',
            hand: 'right'
        });
        this.send(msgStr);
    }
    send_BetsData(bets_data: bets_data_inputSever) {
        let msgStr = JSON.stringify(bets_data);
        this.send(msgStr);
    }
    send_playReadyData(playReadyData: play_ready_inputSever) {
        let msgStr = JSON.stringify(playReadyData);
        this.send(msgStr);
    }
    send_TapFishData(tap_fish: playing_tap_inputSever) {
        let msgStr = JSON.stringify(tap_fish);
        this.send(msgStr);
    }

    send_playingLeaveGameData(pl_leaveGame: playing_leave_game_inputSever) {
        let msgStr = JSON.stringify(pl_leaveGame);
        this.send(msgStr);
    }

    send_stopMachingData(stopMaching: stopMaching_inputSever) {
        let msgStr = JSON.stringify(stopMaching);
        this.send(msgStr);
    }

    send_end_game_leaveGameData(eg_leavegame: end_game_leaveGame_inputSever) {
        let msgStr = JSON.stringify(eg_leavegame);
        this.send(msgStr);
    }

    send_reconnect_data(reconnect: recconnect_inputSever) {
        let msgStr = JSON.stringify(reconnect);
        this.send(msgStr);
    }
    send_update_money(update_money: call_to_sever_update_money) {
        let msgStr = JSON.stringify(update_money);
        this.send(msgStr);
    }
}

