const lodash = globalThis._;

import { VDGameListener } from "../../../../vd-framework/network/VDGameListener";
import * as cc from 'cc';
import { cf_Director } from "../core/cf_Director";
import { log } from "cc";
import { cf_PlayerInfoShort } from "../model/cf_PlayerModel";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { cf_CommandID, cf_CommandID_OP, cf_GAME_STATE_EVENT, cf_NETWORK_STATE_EVENT } from "./cf_NetworkDefine";
import { cf_BuildModel } from "../model/cf_BuildModel";
import { cf_BetInfoData } from "../model/cf_BetInfoModel";
import { cf_home_data_full } from "../model/cf_home_data_full";
import { cf_noMoney_data, cf_searching_data_Info_shot } from "../model/cf_searching_Model";
import { cf_disconnect_opp, cf_end_stage_data_info_short, cf_fish_to_client_data_info_short, cf_nex_stage_data_Info_short, cf_player_outGame, cf_playing_tap_data_info_short } from "../model/cf_playing_datafull_model";
import { cf_endGame_data_Info_short, cf_reconnect_data_Info_short } from "../model/cf_endGame_data_model";
import { Contact2DType } from "cc";
import { WEBSOCKET_GAME_STATE } from "../../../../vd-framework/network/VDWebSocketClient";
import { cf_WaitingProgress } from "../popups/cf_WaitingProgress";
import { CONNECT_STATE } from "../common/cf_Define";
import VDBaseDirector from "../../../../vd-framework/common/VDBaseDirector";

export class cf_GameListener implements VDGameListener {
    _waitingJoinGame: boolean = false;

    _connectedCallback: any = null;

    setConnectedCallback(connectedCallback?: any) {
        connectedCallback && (this._connectedCallback = connectedCallback);
    }

    onSocketOpen() {
        cc.log("@ [cf_GameListener] onSocketOpen");
        cf_WaitingProgress.instance.hide();
        this._connectedCallback && this._connectedCallback();
    }

    onSocketReconnect() {
        cc.log("@ [cf_GameListener] onSocketReconnect");
        cf_WaitingProgress.instance.hide();
        cf_Director.instance.handleAfterReconnected();
        cf_Director.instance.connect_player = CONNECT_STATE.CONNECT;
    }

    onSocketMessage(cmd, data) {
        cc.log("@ [cf_GameListener] onSocketMessage data = " + data);
        var dataJson = JSON.parse(data);
        var commandId = dataJson.id;
        switch (commandId) {
            case cf_CommandID_OP.DELETE_FISH:
                this.sendToDerector(dataJson);
                break;
            case cf_CommandID_OP.LOGIN_RETURN_OP:
                this.transformPlayerInfo(dataJson);
                break;
            case cf_CommandID_OP.SEARCHING_DATA_OP:
                this.transform_Searching_Info(dataJson);
                break;
            case cf_CommandID_OP.TAP_OP:
                this.transform_Tap_Info(dataJson);
                break;
            case cf_CommandID_OP.NEX_STAGE_OP:
                this.transform_nexStage_Info(dataJson);
                break;
            case cf_CommandID_OP.FISH_TO_CLIENT_OP:
                this.transform_fishToClient_Info(dataJson);
                break;
            case cf_CommandID_OP.END_GAME_OP:
                this.transform_endGame_Info(dataJson);
                break;
            case cf_CommandID_OP.RECONNECT_OP:
                this.transform_reconnect_Info(dataJson);
                break;
            case cf_CommandID_OP.ENDSTAGE_OP:
                this.transform_endStage_Info(dataJson);
                break;
            case cf_CommandID_OP.DISCONNECT_OPP:
                this.send_disconnect_opp_director(dataJson);
                break;
            case cf_CommandID_OP.NO_MONEY_OP:
                this.send_noMoney_data_to_cf_director(dataJson);
                break;
            case cf_CommandID_OP.PLAYER_OUT_GAME:
                this.send_player_outGame_to_cf_director(dataJson);
                break;
        }
    }

    onSocketError() {
        cc.log("@ [cf_GameListener] onSocketError");
        this._waitingJoinGame = false;
        // cf_Director.instance.closeWebSocket();
        cf_WaitingProgress.instance.hide();
        VDEventListener.dispatchEvent(cf_NETWORK_STATE_EVENT.ERROR);
    }

    onSocketClose() {
        cc.log("@ [cf_GameListener] onSocketClose");
        this._waitingJoinGame = false;
        cf_WaitingProgress.instance.show();

        // cf_Director.instance.closeWebSocket();
        // VDEventListener.dispatchEvent(cf_NETWORK_STATE_EVENT.DISCONNECT);
    }
    onSocketDisconnect() {
        cc.log("@ [cf_GameListener] onSocketDisconnect");
        this._waitingJoinGame = false;
        // cf_Director.instance.closeWebSocket();
        cf_Director.instance.connect_player = CONNECT_STATE.DISCONNECT;
        cf_WaitingProgress.instance.hide();
        VDEventListener.dispatchEvent(cf_NETWORK_STATE_EVENT.ERROR);
    }

    // --------------------- TRANSFORM DATA: SHORT -> CLEAR ---------------------
    send_player_outGame_to_cf_director(player_outGame: cf_player_outGame) {
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.PLAYER_OUT_GAME, player_outGame);
    }
    send_noMoney_data_to_cf_director(noMoney_data: cf_noMoney_data) {
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.NO_MONEY_DATA, noMoney_data);
    }
    send_disconnect_opp_director(disconnect_opp: cf_disconnect_opp) {
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.DISCONNECT_OPP, disconnect_opp);
    }
    sendToDerector(dataJson: any) {
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.DELETE_FISH, dataJson);
    }
    transformPlayerInfo(homedata_full: cf_home_data_full) {
        let playerInfoModel = cf_BuildModel.buildPlayerModel(homedata_full);
        let betsStringinfoShort = homedata_full.b;
        let betsInfoModel = cf_BuildModel.builBetsModel(homedata_full);
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.LOGIN_SUCCESS, playerInfoModel, betsInfoModel);
    }
    transform_Searching_Info(searching_data_info_short: cf_searching_data_Info_shot) {
        let searchingInfoModel = cf_BuildModel.build_SearchingDataModel(searching_data_info_short);
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.SEARCHING_OPP_DATA_MODEL, searchingInfoModel);
    }
    transform_Tap_Info(playing_tap_info_short: cf_playing_tap_data_info_short) {
        let playingTapInfoModel = cf_BuildModel.build_PlayingTap_DataModel(playing_tap_info_short);
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.PLAYING_TAP_DATA_MODEL, playingTapInfoModel);

    }
    transform_nexStage_Info(nexStage_data_info_short: cf_nex_stage_data_Info_short) {
        let nexStageInfoModel = cf_BuildModel.build_nexStage_dataModel(nexStage_data_info_short);
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.NEXT_STAGE_DATA_MODEL, nexStageInfoModel);
    }
    transform_fishToClient_Info(fishToClient_dataInfoShort: cf_fish_to_client_data_info_short) {
        let fishDataModel = cf_BuildModel.build_fishDataModel(fishToClient_dataInfoShort);
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.FISH_TO_CLIENT_DATA_MODEL, fishDataModel);
    }
    transform_endGame_Info(endGame_dataInfoShort: cf_endGame_data_Info_short) {
        let endGameDataModel = cf_BuildModel.build_endGame_dataModel(endGame_dataInfoShort);
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.END_GAME_DATA_MODEL, endGameDataModel);
    }
    transform_reconnect_Info(reconnect_dataInfoShort: cf_reconnect_data_Info_short) {
        let reconnectDataModel = cf_BuildModel.build_reconnect_dataModel(reconnect_dataInfoShort);
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.RECONNECT_DATA_MODEL, reconnectDataModel);

    }
    transform_endStage_Info(endStage_dataInfoShort: cf_end_stage_data_info_short) {
        let endStageDataModel = cf_BuildModel.build_endStage_dataModel(endStage_dataInfoShort);
        VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.END_STAGE_DATA_MODEL, endStageDataModel);
    }
    // --------------------- END: TRANSFORM DATA --------------------
}

