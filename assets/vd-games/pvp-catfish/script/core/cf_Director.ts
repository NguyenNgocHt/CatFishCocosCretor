import { log, pingPong } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { VDEventListener } from '../../../../vd-framework/common/VDEventListener';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { best_list, mock_config, money_for_player, seachingModel_fake } from '../../../../vd-mock/mock_config';
import { CONNECT_STATE, END_GAME_STATE, END_STAGE_STATE, ON_OFF_STATE, RECONNECT_RELOADING_PLAYSCREEN, RECONNECT_STATE, cf_Path, cf_Text } from '../common/cf_Define';
import { cf_BetInfoModel } from '../model/cf_BetInfoModel';
import { bets_data_inputSever, call_to_sever_update_money, end_game_leaveGame_inputSever, Ping_inputSever, play_ready_inputSever, playing_leave_game_inputSever, playing_tap_inputSever, recconnect_inputSever, stopMaching_inputSever } from '../model/cf_data_Input_model';
import { cf_endGame_data_model, cf_reconnect_data_Info_short, cf_reconnect_data_model } from '../model/cf_endGame_data_model';
import { cf_PlayerInfoModel, cf_PlayerInfoShort } from '../model/cf_PlayerModel';
import { cf_end_stage_data_model, cf_fish_to_client_data_info_short, cf_fish_to_client_data_model, cf_nex_stage_data_Info_short, cf_nex_stage_data_model, cf_player_outGame, cf_playing_tap_data_info_short, cf_playing_tap_data_model } from '../model/cf_playing_datafull_model';
import { cf_noMoney_data, cf_searching_data_Info_shot, cf_searching_data_model } from '../model/cf_searching_Model';
import { cf_CommandID_OP, cf_GAME_STATE_EVENT, cf_LOCAL_STORAGE, cf_NETWORK_STATE_EVENT } from '../network/cf_NetworkDefine';
import { cf_WebSocket } from '../network/cf_WebSocket';
import { cf_PopupNotify } from '../popups/cf_PopupNotify';
import { cf_HomeScreen } from '../screens/cf_HomeScreen';
import { cf_LoadingScreen } from '../screens/cf_LoadingScreen';
import { cf_PlayingScreen } from '../screens/cf_PlayingScreen';
import { cf_PlayScreen } from '../screens/cf_PlayScreen';
import { cf_SearchScreen } from '../screens/cf_SearchScreen';
import { cf_BuildModel } from '../model/cf_BuildModel';
import { tween } from 'cc';
import { cf_ResultScreen } from '../screens/cf_ResultScreen';
import { sys } from 'cc';

import { WEBSOCKET_GAME_STATE } from '../../../../vd-framework/network/VDWebSocketClient';
import { cf_WaitingProgress } from '../popups/cf_WaitingProgress';
import { Vec3 } from 'cc';
import { cf_button_left_right_for_cat } from '../model/cf_saveDataInComp';

import { assetManager } from 'cc';
import { Texture2D } from 'cc';
import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';
import { resources } from 'cc';
import { JSB } from 'cc/env';
import { RenderTexture } from 'cc';
import { ImageAsset } from 'cc';
import { cf_GameListener } from '../network/cf_GameListener';


const { ccclass, property } = _decorator;
enum reconectState {
    nostate,
    normalConnect,
    reconnect,
}
enum searching_comeBack_state {
    nostate,
    normalSearching,
    searching_comeBack,
}
enum connectState {
    nostate,
    success,
    false,
}
export enum LOGIN_STATE {
    NO_LOGIN = 0,
    LOGINNING = 1,
    LOGIN_SUCCESS = 2,
    LOGIN_FAIL = 3,
}

export enum GAME_STATE_FE {
    LOADING_SCREEN = 'LOADING_SCREEN',
    HOME_SCREEN = 'HOME_SCREEN',
    SEARCHING_OPP_SCREEN = 'SEARCHING_OPP_SCREEN',
    PLAYING_SCREEN = 'PLAYING_SCREEN',
    RESULT_SCREEN = 'RESULT_SCREEN'
}
@ccclass('cf_Director')
export class cf_Director extends Component {

    private logClassTag: string = "@ [cf_Director] -- ";

    private static _instance: cf_Director = null!;

    public static get instance(): cf_Director {
        if (this._instance == null) {
            this._instance = new cf_Director();
        }

        return this._instance;
    }

    //############################################################################################################

    //---------------- [Properties] --- Data -----------------------------
    public cf_PlayerInfoModel_fake: cf_PlayerInfoModel = null;
    public cf_competitorInfoModel_fake: cf_PlayerInfoModel = null;
    public bets_data: number = 0;
    public result_game_state: boolean = false;
    public bonus: number = 0;
    public reconnect_state: RECONNECT_STATE = RECONNECT_STATE.NORMAL_CONNECT;
    public searching_comeback_state: searching_comeBack_state = searching_comeBack_state.nostate;
    //data output from sever
    public OP_PlayerInfoModel_show_home: cf_PlayerInfoModel = null;
    public OP_betsInfoModel_show_home: cf_BetInfoModel = null;
    public OP_searchingDataModel: cf_searching_data_model = null;
    public OP_playingTapDataModel: cf_playing_tap_data_model = null;
    public OP_nexStageDataModel: cf_nex_stage_data_model = null;
    public OP_fishToClientDataModel: cf_fish_to_client_data_model = null;
    public OP_endGameDataModel: cf_endGame_data_model = null;
    public OP_reconnectDataModel: cf_reconnect_data_model = null;
    public OP_endStageDataModel: cf_end_stage_data_model = null;
    public OP_NoMoney_data: cf_noMoney_data = null;
    //data returned to the sever
    public IP_bets_data: bets_data_inputSever = null;
    public IP_playReady_data: play_ready_inputSever = null;
    public IP_tap_fish: playing_tap_inputSever = null;
    public IP_pl_leaveGame: playing_leave_game_inputSever = null;
    public IP_stopMaching: stopMaching_inputSever = null;
    public IP_eg_leavegame: end_game_leaveGame_inputSever = null;
    public IP_reconnect: recconnect_inputSever = null;
    public IP_Ping: Ping_inputSever = null;
    //data output from sever fake
    public cf_BetInfoModels: cf_BetInfoModel[] = [];
    public bets_number_list: number[];

    //---------------- [Properties] --- WebSocket --------------------------
    public wsGameClient: cf_WebSocket = null;
    public wsGameState: WEBSOCKET_GAME_STATE = WEBSOCKET_GAME_STATE.NOT_CONNECTED;
    public connect_state: connectState = connectState.nostate;

    //---------------- [Properties] --- Screen -----------------------------
    playScreen: cf_PlayScreen | null = null;
    homeScreen: cf_HomeScreen | null = null;
    playingScreen: cf_PlayingScreen | null = null;
    searchScreen: cf_SearchScreen | null = null;
    LoadingScreen: cf_LoadingScreen | null = null;
    resultScreen: cf_ResultScreen | null = null;

    private _gameStateFE: GAME_STATE_FE = GAME_STATE_FE.LOADING_SCREEN;

    //---------------- [Properties] --- Callback -----------------------------
    callbackLoginSuccess: any = null;
    callbackLoginFail: any = null;

    //---------------- [Properties] --- Others -----------------------------

    private _popupDisplay: VDBasePopup = null!;
    public loadingSuccess: boolean = false;
    public arr_button: Vec3[];
    public button_left_right_position_data: cf_button_left_right_for_cat = null;
    public userID: number = 0;
    //*********************** [setting variable]****************************/
    public sfx_on_off_state: ON_OFF_STATE = ON_OFF_STATE.ON;
    public music_on_off_state: ON_OFF_STATE = ON_OFF_STATE.ON;
    public music_button_on_off_state: ON_OFF_STATE = ON_OFF_STATE.ON;
    public sfx_button_on_off_state: ON_OFF_STATE = ON_OFF_STATE.ON;
    public count_music_button_press: number = 0;
    public count_sfx_button_press: number = 0;
    //avatar player
    public avatar_for_player: SpriteFrame = null;
    public avatar_for_opp: SpriteFrame = null;

    private _loginState: LOGIN_STATE = LOGIN_STATE.NO_LOGIN;

    //---------------- [Reconnect] -----------------------------
    public _isSendingBetData: boolean = false;
    public connect_player: CONNECT_STATE = CONNECT_STATE.NO_STATE;
    public connect_opp: CONNECT_STATE = CONNECT_STATE.NO_STATE;
    public reconnect_playscreen: boolean = false;
    public reconnect_reload_playscreen: RECONNECT_RELOADING_PLAYSCREEN = RECONNECT_RELOADING_PLAYSCREEN.NO_STATE;
    public ready_playingTap: boolean = false;
    //****************[OUT GAME variable]********************* */
    public outGame_state: boolean = false;

    //---------------- [Properties] --- End ---------------------------------
    public end_game_state: END_GAME_STATE = END_GAME_STATE.NO_STATE;
    public end_stage_state: END_STAGE_STATE = END_STAGE_STATE.NO_STATE;

    //############################################################################################################
    //-----------------[fake function]-----------------------------------

    //############################################################################################################

    //---------------- [Functions] --- Game State --------------------------
    public set gameStateFE(gameState: GAME_STATE_FE) {
        this._gameStateFE = gameState;
    }

    public get gameStateFE(): GAME_STATE_FE {
        return this._gameStateFE;
    }

    //---------------- [Functions] --- Network --------------------------
    login(callbackSuccess: any, callbackFail?: any) {
        this.callbackLoginSuccess = callbackSuccess;
        this.callbackLoginFail = callbackFail;
        this.registerEvents();
    }

    getLoginState() {
        return this._loginState;
    }

    connectToGameServer(token: number, userID: number) {
        this.userID = userID;
        if (!this.wsGameClient) {
            this.wsGameClient = new cf_WebSocket();
        }
        this._loginState = LOGIN_STATE.LOGINNING;
        this.wsGameClient.connectToServer(token, userID, () => {
            this.connect_state = connectState.success;
            this.connect_player = CONNECT_STATE.CONNECT;
        });
    }

    closeWebSocket() {
        this.wsGameClient = null;
    }

    //---------------- [Functions] --- Register Event --------------------------

    registerEvents() {
        VDEventListener.on(cf_NETWORK_STATE_EVENT.ERROR, this.handleNetworkError.bind(this));
        VDEventListener.on(cf_NETWORK_STATE_EVENT.DISCONNECT, this.handleNetworkDisconnect.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.SEARCHING_OPP_DATA_MODEL, this.get_searchingOpp_dataModel.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.PLAYING_TAP_DATA_MODEL, this.get_playingTap_dataModel.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.NEXT_STAGE_DATA_MODEL, this.get_nextStage_dataModel.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.FISH_TO_CLIENT_DATA_MODEL, this.get_fishToclient_dataModel.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.END_GAME_DATA_MODEL, this.get_endGame_dataModel.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.RECONNECT_DATA_MODEL, this.get_reconnect_dataModel.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.LOGIN_SUCCESS, this.handlePlayerInfo.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.DELETE_FISH, this.set_delete_fish.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.END_STAGE_DATA_MODEL, this.get_endStage_dataModel.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.DISCONNECT_OPP, this.set_disconnect_opp_state.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.NO_MONEY_DATA, this.set_noMoney_data_inSearchingScreen.bind(this));
        VDEventListener.on(cf_GAME_STATE_EVENT.PLAYER_OUT_GAME, this.set_player_outGame.bind(this));
    }

    offEvents() {
        VDEventListener.off(cf_NETWORK_STATE_EVENT.ERROR, this.handleNetworkError.bind(this));
        VDEventListener.off(cf_NETWORK_STATE_EVENT.DISCONNECT, this.handleNetworkDisconnect.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.LOGIN_SUCCESS, this.handlePlayerInfo.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.SEARCHING_OPP_DATA_MODEL, this.get_searchingOpp_dataModel.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.PLAYING_TAP_DATA_MODEL, this.get_playingTap_dataModel.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.NEXT_STAGE_DATA_MODEL, this.get_nextStage_dataModel.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.FISH_TO_CLIENT_DATA_MODEL, this.get_fishToclient_dataModel.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.END_GAME_DATA_MODEL, this.get_endGame_dataModel.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.RECONNECT_DATA_MODEL, this.get_reconnect_dataModel.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.END_STAGE_DATA_MODEL, this.get_endStage_dataModel.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.DISCONNECT_OPP, this.set_disconnect_opp_state.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.NO_MONEY_DATA, this.set_noMoney_data_inSearchingScreen.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.DELETE_FISH, this.set_delete_fish.bind(this));
        VDEventListener.off(cf_GAME_STATE_EVENT.PLAYER_OUT_GAME, this.set_player_outGame.bind(this));
    }

    //---------------- [Functions] --- Handle Network --------------------------

    public handleNetworkError() {
        this.handleNetworkDisconnect();
    }

    public handleNetworkDisconnect() {
        log(this.logClassTag + 'handleNetworkDisconnect');
        if (this._loginState == LOGIN_STATE.LOGINNING) {
            this._loginState = LOGIN_STATE.LOGIN_FAIL;
            this.callbackLoginFail && this.callbackLoginFail();
        }
        // this.closeIfNeed();
        if (this._popupDisplay != null) return;
        VDScreenManager.instance.showPopupFromPrefabName(cf_Path.NOTIFY_POPUP, (popup: VDBasePopup) => {
            this._popupDisplay = popup;
            let popupDisplay = popup as cf_PopupNotify;
            let callbacks = [() => {
                VDScreenManager.instance.hidePopup(true);
                this._popupDisplay = null;
                if (this.wsGameClient) {
                    cf_WaitingProgress.instance.show();
                    this.wsGameClient.reconnect();
                }
            }];
            popupDisplay.setupPopup(cf_Text.DISCONNECT, callbacks);
        }, false, true, true);
    }
    closeIfNeed() {
        if (this._popupDisplay != null) {
            VDScreenManager.instance.hidePopup(true);
            this._popupDisplay = null;
        }
    }

    handleAfterReconnected() {
        if (this.gameStateFE == GAME_STATE_FE.SEARCHING_OPP_SCREEN) {
            log('@ Reconnect for SEARCHING_OPP_SCREEN...');
            if (this._isSendingBetData) {
                this.reSend_betsData();
            } else {
                this.searchScreen.get_searchingDataModel(this.OP_searchingDataModel);
            }
        }
        if (this.gameStateFE == GAME_STATE_FE.PLAYING_SCREEN) {
            this.reconnect_playscreen = true;
            this.reconnect_reload_playscreen = RECONNECT_RELOADING_PLAYSCREEN.PLAYSCREEN;
        }
    }
    set_reconnect_playScreen() {
        this.playingScreen.init_reconnect_data();
        this.playingScreen.update_playGame_state();
    }
    //---------------- [Functions] --- Handle Data --------------------------
    public set_player_outGame(player_outGame: cf_player_outGame) {
        this.outGame_state = true;
    }
    public set_noMoney_data_inSearchingScreen(no_money_data: cf_noMoney_data) {
        this.OP_NoMoney_data = no_money_data;
        this.searchScreen.set_noMoney_data();
    }
    public set_disconnect_opp_state(dataJson: any) {
        if (dataJson) {
            this.connect_opp = CONNECT_STATE.DISCONNECT;
        }
    }
    public set_delete_fish(dataJson: any) {
        if (this.playingScreen) {
            if (dataJson) {
                this.playingScreen.delete_fish();
            }
        }
    }
    public handlePlayerInfo(playerInfoModel: cf_PlayerInfoModel, betsInfoModel: cf_BetInfoModel) {

        if (this.gameStateFE == GAME_STATE_FE.HOME_SCREEN) {
            this.OP_PlayerInfoModel_show_home = playerInfoModel;
            this.OP_betsInfoModel_show_home = betsInfoModel;
            this.homeScreen.set_money_for_player(this.OP_PlayerInfoModel_show_home.money);
            this.get_images_player_from_URL();
        } else {
            this.OP_PlayerInfoModel_show_home = playerInfoModel;
            this.OP_betsInfoModel_show_home = betsInfoModel;
            if (this._loginState == LOGIN_STATE.LOGINNING) {
                this._loginState = LOGIN_STATE.LOGIN_SUCCESS;
                this.callbackLoginSuccess && this.callbackLoginSuccess();
            }
            sys.localStorage.setItem(cf_LOCAL_STORAGE.PLAYER_DATA_MODEL, JSON.stringify(this.OP_PlayerInfoModel_show_home));
            this.get_images_player_from_URL();
        }
    }
    public get_searchingOpp_dataModel(seachingModel: cf_searching_data_model) {
        this._isSendingBetData = false;
        if (this.searchScreen) {
            this.OP_searchingDataModel = seachingModel;
            this.get_images_opp_from_URL();
            this.searchScreen.get_searchingDataModel(this.OP_searchingDataModel);
        } else {
            this.OP_searchingDataModel = seachingModel;
            this.get_images_opp_from_URL();
        }
    }
    public get_nextStage_dataModel(nextStageModel: cf_nex_stage_data_model) {
        if (this.playingScreen) {
            this.OP_nexStageDataModel = nextStageModel;
            this.playingScreen.update_nexStage(this.OP_nexStageDataModel);
            sys.localStorage.setItem(cf_LOCAL_STORAGE.NEXT_STAGE_DATA_MODEL, JSON.stringify(this.OP_nexStageDataModel));
        }
    }
    public get_playingTap_dataModel(playingTapModel: cf_playing_tap_data_model) {
        this.OP_playingTapDataModel = playingTapModel;
        if (this.playingScreen) {
            if (this.ready_playingTap) {
                this.end_stage_state = END_STAGE_STATE.PLAYING;
                this.playingScreen.update_playingTap_data(this.OP_playingTapDataModel);
            }
        }
    }
    public get_fishToclient_dataModel(fishToClientDataModel: cf_fish_to_client_data_model) {
        if (this.playingScreen) {
            this.OP_fishToClientDataModel = fishToClientDataModel;
            this.playingScreen.update_fish_state(this.OP_fishToClientDataModel);
        }
    }
    public get_endGame_dataModel(endGameModel: cf_endGame_data_model) {
        this.OP_endGameDataModel = endGameModel;
        this.end_game_state = END_GAME_STATE.ENDGAME;
        this.bonus = this.OP_endGameDataModel.money_win;
        if (this.bonus > 0) {
            this.result_game_state = true;
        } else {
            this.result_game_state = false;
        }
        if (this.outGame_state) {
            this.playingScreen.disconnect_endGame(this.result_game_state);
        }
    }
    public get_reconnect_dataModel(reconnectModel: cf_reconnect_data_model) {
        this.ready_playingTap = false;
        this.OP_reconnectDataModel = reconnectModel;
        this.reconnect_state = RECONNECT_STATE.RECONNECT;
        if (this.reconnect_playscreen) {
            this.set_reconnect_playScreen();
        }
        //khi nao thay doi data output thi xoa di (data fake)
        this.OP_PlayerInfoModel_show_home = JSON.parse(sys.localStorage.getItem(cf_LOCAL_STORAGE.PLAYER_DATA_MODEL));
        this.OP_nexStageDataModel = JSON.parse(sys.localStorage.getItem(cf_LOCAL_STORAGE.NEXT_STAGE_DATA_MODEL));

    }
    public get_endStage_dataModel(endStage_dataModel: cf_end_stage_data_model) {
        this.end_stage_state = END_STAGE_STATE.ENDSTAGE;
        this.OP_endStageDataModel = endStage_dataModel;
        if (this.playingScreen) {
            this.playingScreen.update_endStage(this.OP_endStageDataModel);
        }
    }
    public send_betsData(betsData: bets_data_inputSever) {
        this.IP_bets_data = betsData;
        this._isSendingBetData = true;
        this.wsGameClient.send_BetsData(this.IP_bets_data);
    }
    public send_play_ready_Data(playReady: play_ready_inputSever) {
        this.IP_playReady_data = playReady;
        this.wsGameClient.send_playReadyData(this.IP_playReady_data);
    }
    public send_tapfist_Data(tapFish: playing_tap_inputSever) {
        this.IP_tap_fish = tapFish;
        this.wsGameClient.send_TapFishData(this.IP_tap_fish);
    }
    public send_playingLeave_GameData(playingLeave: playing_leave_game_inputSever) {
        this.IP_pl_leaveGame = playingLeave;
        this.wsGameClient.send_playingLeaveGameData(this.IP_pl_leaveGame);
    }
    public send_stopMaching_Data(stopMaching: stopMaching_inputSever) {
        this.IP_stopMaching = stopMaching;
        this.wsGameClient.send_stopMachingData(this.IP_stopMaching);
    }
    public send_endgame_leaveGameData(eg_leavegame: end_game_leaveGame_inputSever) {
        this.IP_eg_leavegame = eg_leavegame;
        this.wsGameClient.send_end_game_leaveGameData(this.IP_eg_leavegame);
    }
    public send_reconnectData(reconnect: recconnect_inputSever) {
        this.IP_reconnect = reconnect;
        this.wsGameClient.send_reconnect_data(this.IP_reconnect);
    }

    public send_update_money(update_money: call_to_sever_update_money) {
        this.wsGameClient.send_update_money(update_money);
    }
    //************************data fake******************************

    //------------- resend Data for Reconnect -------------
    public reSend_betsData() {
        this.wsGameClient.send_BetsData(this.IP_bets_data);
    }

    //************************save data in computer******************************
    saveData_button_position(left_button: Vec3, right_button: Vec3) {
        if (!this.arr_button) {
            this.arr_button = [];
        }
        this.arr_button = [left_button, right_button];
        this.button_left_right_position_data = {
            dataID: this.userID,
            arr_button_pos: this.arr_button,
        };
        sys.localStorage.setItem(cf_LOCAL_STORAGE.ARR_BUTTON_LEFT_RIGHT, JSON.stringify(this.button_left_right_position_data));
    }
    get_images_player_from_URL() {
        const imagesDir = "res/images/avatar_loading_from_URL/";
        const imageName = 'player_avatar.png';
        var imageURL = this.OP_PlayerInfoModel_show_home.avatarId;
        //load images
        assetManager.loadRemote<ImageAsset>(imageURL, (err, ImageAsset) => {
            if (err) {
                console.error("Failed to load image:", err);
                return;
            }
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = ImageAsset;
            spriteFrame.texture = texture;
            this.avatar_for_player = spriteFrame;
        })
    }
    get_images_opp_from_URL() {
        const imagesDir = "res/images/avatar_loading_from_URL/";
        const imageName = 'player_avatar.png';
        var imageURL = this.OP_searchingDataModel.opp_avatar;
        //load images
        assetManager.loadRemote<ImageAsset>(imageURL, (err, ImageAsset) => {
            if (err) {
                console.error("Failed to load image:", err);
                return;
            }
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = ImageAsset;
            spriteFrame.texture = texture;
            this.avatar_for_opp = spriteFrame;
        })
    }
}


