import { _decorator, Component, Node, SpriteFrame, tween, Sprite, spriteAssembler, SpriteAtlas } from 'cc';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { fish_lis, game_win_lose, mock_config, random_number, round_list, seachingModel_fake } from '../../../../vd-mock/mock_config';
import { cf_PlayScreen } from './cf_PlayScreen';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import { cf_playing_show_fish } from '../playing/cf_playing_show_fish';
import { cf_playing_show_round } from '../playing/cf_playing_show_round';
import { cf_playing_show_point_opp } from '../playing/cf_playing_show_point_opp';
import { cf_playing_hand_moving_opp } from '../playing/cf_playing_hand_moving_opp';
import { cf_playing_hand_moving_starting } from '../playing/cf_playing_hand_moving_starting';
import { cf_playing_3_2_1_start } from '../playing/cf_playing_3_2_1_start';
import { cf_playing_anim_win_lose_game } from '../playing/cf_playing_anim_win_lose_game';
import { GAME_STATE_FE, cf_Director } from '../core/cf_Director';
import { cf_searching_data_model } from '../model/cf_searching_Model';
import { cf_PlayerInfoModel } from '../model/cf_PlayerModel';
import { Ping_inputSever, play_ready_inputSever, playing_tap_inputSever } from '../model/cf_data_Input_model';
import { cf_CommandID_IP, cf_GAME_STATE_EVENT } from '../network/cf_NetworkDefine';
import { cf_end_stage_data_model, cf_fish_to_client_data_model, cf_nex_stage_data_model, cf_playing_tap_data_model } from '../model/cf_playing_datafull_model';
import { director } from 'cc';
import { CONNECT_STATE, END_GAME_STATE, END_STAGE_STATE, LOCK_HAND_BUTTON, RECONNECT_RELOADING_PLAYSCREEN, RECONNECT_STATE, cf_Path } from '../common/cf_Define';
import { Prefab } from 'cc';
import { cf_ResultScreen } from './cf_ResultScreen';
import { VDEventListener } from '../../../../vd-framework/common/VDEventListener';
import { Tween, sys } from 'cc';
import { cf_reconnect_data_model } from '../model/cf_endGame_data_model';
import { cf_BetInfoModel } from '../model/cf_BetInfoModel';
import { cf_LOCAL_STORAGE } from '../network/cf_NetworkDefine';
import { Vec3 } from 'cc';
import { cf_button_left_right_for_cat } from '../model/cf_saveDataInComp';
import { cf_playing_show_name_player_and_opp } from '../playing/cf_playing_show_name_player_and_opp';
import { cf_playing_show_round1_win_lose } from '../playing/cf_playing_show_round1_win_lose';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';
import { VDAudioManager } from '../../../../vd-framework/audio/VDAudioManager';
import { cf_playing_audioPlay } from '../playing/cf_playing_audioPlay';
import { WEBSOCKET_GAME_STATE } from '../../../../vd-framework/network/VDWebSocketClient';
import { ConeCollider } from 'cc';
import { cf_playing_showBetsIcon } from '../playing/cf_playing_showBetsIcon';
const { ccclass, property } = _decorator;
enum HANDSTATE {
    NOSTATE,
    LEFT_HAND,
    RIGHT_HAND,
}
enum roundState {
    nostate,
    round_laying,
    round_end,
}
enum bg_state {
    nostate,
    go,
    da,
    co,
}
enum colorState {
    bom,
    thiu,
    thuong,
    red,
    yellow,
    blue,
    green,
}
enum FISH_STATE {
    NOSTATE,
    DISAPPEAR,
    EXIST,
}
enum reconectState {
    nostate,
    normalConnect,
    reconnect,
}
enum ConnectState {
    NO_STATE,
    CONNECT,
    DISCONNECT,
}
enum Win_lose_state {
    NO_STATE,
    WIN,
    LOSE,
}
enum Tap_false_true_state {
    NO_STATE,
    FALSE,
    TRUE,
}
@ccclass('cf_PlayingScreen')
export class cf_PlayingScreen extends VDBaseScreen {
    NAME_FISH_LIST = ["Ca_Bom", "Ca_Thiu", "Ca_Thuong", "Ca_Do", "Ca_Vang", "Ca_Lam", "Ca_Luc"];
    PLATE_COLOR_LIST = ['_do', '_vang', '_lam', '_luc'];
    PLATE_COLOR_INDEX = [];
    BETS_LIST = [500, 1000, 2000, 3000, 4000, 5000];
    @property(Node)
    private emit_from_start_group: Node = null;
    @property(Node)
    private emit_from_hand_start_moving: Node = null;
    @property(cf_playing_show_round)
    private round_node: cf_playing_show_round = null;
    @property(cf_playing_hand_moving_starting)
    private player_node: cf_playing_hand_moving_starting = null;
    @property(cf_playing_hand_moving_opp)
    private opp_node: cf_playing_hand_moving_opp = null;
    @property(cf_playing_show_fish)
    private fish_node: cf_playing_show_fish = null;
    @property(cf_playing_3_2_1_start)
    private start_node: cf_playing_3_2_1_start = null;
    @property(cf_playing_show_point_opp)
    private player_show_point: cf_playing_show_point_opp = null;
    @property(cf_playing_show_point_opp)
    private opp_show_point: cf_playing_show_point_opp = null;
    @property(cf_playing_anim_win_lose_game)
    private win_lose_game: cf_playing_anim_win_lose_game = null;
    @property(cf_playing_show_name_player_and_opp)
    private avatar_player: cf_playing_show_name_player_and_opp = null;
    @property(cf_playing_show_name_player_and_opp)
    private avatar_opp: cf_playing_show_name_player_and_opp = null;
    @property(cf_playing_show_round1_win_lose)
    private round1_win_lose: cf_playing_show_round1_win_lose = null;
    @property(cf_playing_show_round1_win_lose)
    private round2_3_4_5_win_lose: cf_playing_show_round1_win_lose = null;
    @property(cf_playing_showBetsIcon)
    showBetsIcon: cf_playing_showBetsIcon = null;
    public audio_play: cf_playing_audioPlay = null;
    private name_fish: string = " ";
    private name_fish_list: string[];
    private hand_state: HANDSTATE = HANDSTATE.NOSTATE;
    private round_state: roundState = roundState.nostate;
    private bg_State: bg_state = bg_state.nostate;
    private bg_taymeo__diaca_cv: number = 0;
    private tay_meo: SpriteFrame[];
    private dia_ca: SpriteFrame[];
    private tay_meo_button: SpriteFrame[];
    private arr_tay_meo_button_position: Vec3[];
    private tweenStop!: Tween<Node>;
    private op_searching_dataModel: cf_searching_data_model = null;
    private op_player_dataModel: cf_PlayerInfoModel = null;
    private op_fishToClient_data: cf_fish_to_client_data_model = null;
    private bets_list_data: cf_BetInfoModel = null;
    private op_nexStage_data: cf_nex_stage_data_model = null;
    private op_playTap_data: cf_playing_tap_data_model = null;
    private op_endStage_data: cf_end_stage_data_model = null;
    private op_reconnec_data: cf_reconnect_data_model = null;
    private ip_playReady_data: play_ready_inputSever = null;
    private ip_playTap_data: playing_tap_inputSever = null;
    private ip_pingpong_data: Ping_inputSever = null;
    private button_left_right_for_cat_pos: cf_button_left_right_for_cat = null;
    private color_state: colorState = colorState.bom;
    private fishState_left: FISH_STATE = FISH_STATE.NOSTATE;
    private fishState_right: FISH_STATE = FISH_STATE.NOSTATE;
    private reconnect_state: reconectState = reconectState.normalConnect;
    private connect_status_player: CONNECT_STATE = CONNECT_STATE.NO_STATE;
    private connect_satus_opp: CONNECT_STATE = CONNECT_STATE.NO_STATE;
    private opp_win_lose_state: Win_lose_state = Win_lose_state.NO_STATE;
    private player_win_lose_state: Win_lose_state = Win_lose_state.NO_STATE;
    private tap_false_true_state: Tap_false_true_state = Tap_false_true_state.NO_STATE;
    private win_lose_game_state: boolean = false;
    private play_setting_popup: VDBasePopup = null!;
    private tap_state_player: Tap_false_true_state = Tap_false_true_state.NO_STATE;
    private tap_state_opp: Tap_false_true_state = Tap_false_true_state.NO_STATE;
    public lock_hand_state: LOCK_HAND_BUTTON = LOCK_HAND_BUTTON.NO_STATE;
    //********************KHOI TAO CAC GIA TRI BAN DAU********************************** */
    onLoad() {
        this.audio_play = this.node.getComponent(cf_playing_audioPlay);
        this.op_player_dataModel = cf_Director.instance.OP_PlayerInfoModel_show_home;
        if (cf_Director.instance.reconnect_state == RECONNECT_STATE.NORMAL_CONNECT && cf_Director.instance.gameStateFE == GAME_STATE_FE.PLAYING_SCREEN) {
            this.bets_list_data = cf_Director.instance.OP_betsInfoModel_show_home;
            this.op_searching_dataModel = cf_Director.instance.OP_searchingDataModel;
            this.op_nexStage_data = {
                dataID: 1604,
                player_round_win: 0,
                opp_round_win: 0,
                current_round: 0,
            }
            this.PLATE_COLOR_INDEX = [this.op_searching_dataModel.player_hand1 - 3,
            this.op_searching_dataModel.player_hand2 - 3,
            this.op_searching_dataModel.opp_hand1 - 3,
            this.op_searching_dataModel.opp_hand2 - 3];
            let index = this.op_searching_dataModel.bets;
            let bets_number = this.bets_list_data.betAmount[index];
            this.init_background(bets_number);
        }
        if (cf_Director.instance.reconnect_state == RECONNECT_STATE.RECONNECT && cf_Director.instance.gameStateFE == GAME_STATE_FE.PLAYING_SCREEN) {
            this.init_reconnect_data();
            let bets_number = this.bets_list_data.betAmount[this.op_searching_dataModel.bets];
            this.init_background(bets_number);
        }
    }
    //init reconnect
    init_reconnect_data() {
        if (cf_Director.instance.reconnect_state == RECONNECT_STATE.RECONNECT && cf_Director.instance.gameStateFE == GAME_STATE_FE.PLAYING_SCREEN) {
            this.bets_list_data = cf_Director.instance.OP_betsInfoModel_show_home;
            this.op_reconnec_data = cf_Director.instance.OP_reconnectDataModel;
            this.op_nexStage_data = cf_Director.instance.OP_nexStageDataModel;
            this.op_searching_dataModel = cf_Director.instance.OP_searchingDataModel;
            this.op_nexStage_data = {
                dataID: 1604,
                player_round_win: this.op_reconnec_data.round_win_player,
                opp_round_win: this.op_reconnec_data.round_win_opp,
                current_round: this.op_reconnec_data.current_round,
            }
            this.round_state = roundState.round_laying;
            if (!this.PLATE_COLOR_INDEX) {
                this.PLATE_COLOR_INDEX = [];
            }
            this.PLATE_COLOR_INDEX = [this.op_searching_dataModel.player_hand1 - 3,
            this.op_searching_dataModel.player_hand2 - 3,
            this.op_searching_dataModel.opp_hand1 - 3,
            this.op_searching_dataModel.opp_hand2 - 3];
        }
    }
    //************KHOI TAO BACKGROUND THEO MUC CUOC**************************** */
    init_background(bets_number: number) {
        if (bets_number == 500 || bets_number == 1000) {
            this.bg_State = bg_state.go;
            this.bg_taymeo__diaca_cv = this.bg_State;
            this.init_bg(this.bg_State);
        }
        if (bets_number == 2000 || bets_number == 3000) {
            this.bg_State = bg_state.da;
            this.init_bg(this.bg_State);
        }
        if (bets_number == 4000 || bets_number == 5000) {
            this.bg_State = bg_state.co;
            this.init_bg(this.bg_State);
        }
    }
    //******************************init backgroud
    init_bg(Bg_state: number) {
        this.init_background_playscreen(Bg_state);
        this.init_tay_meo(this.bg_State);
        this.init_diaca(this.bg_State);
        this.init_handCat_button();
    }
    init_background_playscreen(bg_index: number) {
        var bg_images_add = 'res/images/bgr/' + 'img_background' + `${bg_index}` + '/spriteFrame';
        var sprite_frame = VDScreenManager.instance.assetBundle.get(bg_images_add, SpriteFrame);
        var bg_node = this.node.getChildByName('img_background');
        var bg_sprite = bg_node.getComponent(Sprite);
        bg_sprite.spriteFrame = sprite_frame;
    }//*********************************init tay meo
    init_tay_meo(taymeo_index: number) {
        if (!this.tay_meo) {
            this.tay_meo = [];
        }
        let hand_1 = this.node.getChildByPath('player_group/Plate1/Hand1');
        let hand_2 = this.node.getChildByPath('player_group/Plate2/Hand2');
        let hand_3 = this.node.getChildByPath('comp_group/Plate3/Hand3');
        let hand_4 = this.node.getChildByPath('comp_group/Plate4/Hand4');
        var hand1_sprite = hand_1.getComponent(Sprite);
        var hand2_sprite = hand_2.getComponent(Sprite);
        var hand3_sprite = hand_3.getComponent(Sprite);
        var hand4_sprite = hand_4.getComponent(Sprite);
        hand1_sprite.spriteFrame = null;
        hand2_sprite.spriteFrame = null;
        hand3_sprite.spriteFrame = null;
        hand4_sprite.spriteFrame = null;
        for (let i = 0; i <= 3; i++) {
            if (this.bg_State == bg_state.go || this.bg_State == bg_state.da || this.bg_State == bg_state.co) {
                var sprite_Frame = new SpriteFrame();
                var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
                let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
                let spriteFrame_name = 'Hand1_' + `${i + 1}`;
                sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
                this.tay_meo[i] = sprite_Frame;
            }
        }
        hand1_sprite.spriteFrame = this.tay_meo[0];
        hand2_sprite.spriteFrame = this.tay_meo[1];
        hand3_sprite.spriteFrame = this.tay_meo[2];
        hand4_sprite.spriteFrame = this.tay_meo[3];
    }
    //*****************************init dia ca
    init_diaca(diaca_index: number) {
        if (!this.dia_ca) {
            this.dia_ca = [];
        }
        let dia_1 = this.node.getChildByPath('player_group/Plate1');
        let dia_2 = this.node.getChildByPath('player_group/Plate2');
        let dia_3 = this.node.getChildByPath('comp_group/Plate3');
        let dia_4 = this.node.getChildByPath('comp_group/Plate4');
        var dia1_sprite = dia_1.getComponent(Sprite);
        var dia2_sprite = dia_2.getComponent(Sprite);
        var dia3_sprite = dia_3.getComponent(Sprite);
        var dia4_sprite = dia_4.getComponent(Sprite);
        dia1_sprite.spriteFrame = null;
        dia2_sprite.spriteFrame = null;
        dia3_sprite.spriteFrame = null;
        dia4_sprite.spriteFrame = null;
        for (let i = 0; i <= 3; i++) {
            if (this.bg_State == bg_state.go || this.bg_State == bg_state.da || this.bg_State == bg_state.co) {
                if (this.PLATE_COLOR_INDEX[0] != 0) {
                    var sprite_Frame = new SpriteFrame();
                    var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
                    let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
                    let spriteFrame_name = 'Plate1_xuoi' + this.PLATE_COLOR_LIST[this.PLATE_COLOR_INDEX[i]];
                    sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
                    this.dia_ca[i] = sprite_Frame;
                    this.player_show_point.init_bg_showPoint('img_NenXanh');
                    this.opp_show_point.init_bg_showPoint('img_NenHong');
                }
                if (this.PLATE_COLOR_INDEX[0] == 0) {
                    var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
                    let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
                    let spriteFrame_name = 'Plate1_nguoc' + this.PLATE_COLOR_LIST[this.PLATE_COLOR_INDEX[i]];
                    sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
                    this.dia_ca[i] = sprite_Frame;
                    this.player_show_point.init_bg_showPoint('img_NenHong');
                    this.opp_show_point.init_bg_showPoint('img_NenXanh');
                }
            }
        }
        dia2_sprite.spriteFrame = this.dia_ca[0];
        dia1_sprite.spriteFrame = this.dia_ca[1];
        dia4_sprite.spriteFrame = this.dia_ca[2];
        dia3_sprite.spriteFrame = this.dia_ca[3];
    }
    init_handCat_button() {
        if (!this.tay_meo_button) {
            this.tay_meo_button = [];
        }
        this.button_left_right_for_cat_pos = JSON.parse(sys.localStorage.getItem(cf_LOCAL_STORAGE.ARR_BUTTON_LEFT_RIGHT))
        let handCat_button_left = this.node.getChildByPath('player_group/HandLeft');
        let handCat_button_right = this.node.getChildByPath('player_group/HandRight');
        let button_left_sprite = handCat_button_left.getComponent(Sprite);
        let button_right_sprite = handCat_button_right.getComponent(Sprite);
        button_left_sprite.spriteFrame = null;
        button_right_sprite.spriteFrame = null;
        for (let i = 0; i < 2; i++) {
            var sprite_Frame = new SpriteFrame();
            var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
            let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
            let spriteFrame_name = 'handCat_button' + this.PLATE_COLOR_LIST[this.PLATE_COLOR_INDEX[i]];
            sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
            this.tay_meo_button[i] = sprite_Frame;
        }
        button_right_sprite.spriteFrame = this.tay_meo_button[0];
        button_left_sprite.spriteFrame = this.tay_meo_button[1];
        if (this.button_left_right_for_cat_pos) {
            if (this.button_left_right_for_cat_pos.dataID == cf_Director.instance.userID) {
                handCat_button_left.setWorldPosition(this.button_left_right_for_cat_pos.arr_button_pos[0]);
                handCat_button_right.setWorldPosition(this.button_left_right_for_cat_pos.arr_button_pos[1]);
            }
        }
    }
    //***********************************START GAME********************************* */
    start() {
        if (cf_Director.instance.reconnect_state == RECONNECT_STATE.NORMAL_CONNECT) {
            this.start_node.bl_starting();
            this.scheduleOnce(function () {
                this.audio_play.effect_321_start();
            }, 0.4);
            this.player_show_point.node.active = false;
            this.opp_show_point.node.active = false;
            this.avatar_opp.node.active = false;
            this.avatar_player.node.active = false;
            var setting_node = this.node.getChildByPath('setting_group/setting_button');
            setting_node.active = false;
            this.showBetsIcon.node.active = false;
        }

        if (cf_Director.instance.reconnect_state == RECONNECT_STATE.RECONNECT) {
            this.update_playGame_state();
            this.start_node.node.active = false;
        }

        this.emit_from_start_group.on('updtata show fish', this.update_playGame_state, this);
        this.emit_from_hand_start_moving.on('hand start moving', this.get_hand_state, this);
        VDEventListener.on(cf_GAME_STATE_EVENT.WIN_LOSE_ROUND_END, this.input_data_to_sever.bind(this));
        let setting_group = this.node.getChildByName('setting_group');
        setting_group.on(cf_GAME_STATE_EVENT.UIOPACITY_START_END, this.onClick_setting_button.bind(this));
    }
    onDisable() {
        this.off_events();
    }
    off_events() {
        VDEventListener.off(cf_GAME_STATE_EVENT.WIN_LOSE_ROUND_END, this.input_data_to_sever.bind(this));
        this.emit_from_start_group.off('updtata show fish', this.update_playGame_state, this);
        this.emit_from_hand_start_moving.off('hand start moving', this.get_hand_state, this);
    }
    //****************************************UPDATE DATA GAME*********************** */
    //sen play ready game
    input_data_to_sever() {
        console.log('nhay vao day do goi 2 lan');
        console.log(cf_Director.instance.end_game_state);
        this.lock_hand_state = LOCK_HAND_BUTTON.OPEN;
        if (cf_Director.instance.end_game_state == END_GAME_STATE.NO_STATE) {
            this.op_searching_dataModel = cf_Director.instance.OP_searchingDataModel;
            this.ip_playReady_data = {
                id: cf_CommandID_IP.PLAY_READY_IP,
                r: this.op_searching_dataModel.RoomID,
            }
            cf_Director.instance.send_play_ready_Data(this.ip_playReady_data);
        }
        else if (cf_Director.instance.end_game_state == END_GAME_STATE.ENDGAME) {
            this.nex_screen_win_lose_game();
        }

    }
    //*****************************UPDATE NEXT STAGE********************* */
    update_nexStage(nex_Stage: cf_nex_stage_data_model) {
        this.op_nexStage_data = nex_Stage;
        this.round_state = roundState.round_laying;
        this.update_round(this.op_nexStage_data.current_round + 1);
        this.update_hand_level(this.op_nexStage_data.current_round + 1);
    }
    //****************************UPDATE END STAGE********************** */
    update_endStage(end_stage: cf_end_stage_data_model) {
        this.lock_hand_state = LOCK_HAND_BUTTON.LOCK;
        this.op_endStage_data = end_stage;
        this.round_state = roundState.round_end;
        this.check_point(this.round_state, this.op_playTap_data.player_point_sum, this.op_playTap_data.player_point_add, this.op_playTap_data.opp_point_sum, this.op_playTap_data.opp_point_add);
        tween(this.node)
            .delay(3)
            .call(() => {
                if (this.win_lose_game_state == false) {
                    this.update_win_lose_round_game(this.op_endStage_data.isSelf);
                }
            })
            .start();
    }
    //*********************************GET HAND STATE****************** */
    get_hand_state(hand_state: number, spriteFrame_name_plate: string) {
        if (this.lock_hand_state == LOCK_HAND_BUTTON.OPEN) {
            let red = 'do';
            let yellow = 'vang';
            let blue = 'lam';
            let green = 'luc';
            if (hand_state == HANDSTATE.LEFT_HAND) {
                this.hand_state = HANDSTATE.LEFT_HAND;
            }
            if (hand_state == HANDSTATE.RIGHT_HAND) {
                this.hand_state = HANDSTATE.RIGHT_HAND;
            }
            if (spriteFrame_name_plate.includes(red)) {
                this.color_state = colorState.red;
                this.get_hand_and_send_to_sever();
            }
            if (spriteFrame_name_plate.includes(yellow)) {
                this.color_state = colorState.yellow;
                this.get_hand_and_send_to_sever();
            }
            if (spriteFrame_name_plate.includes(blue)) {
                this.color_state = colorState.blue;
                this.get_hand_and_send_to_sever();
            }
            if (spriteFrame_name_plate.includes(green)) {
                this.color_state = colorState.green;
                this.get_hand_and_send_to_sever();
            }
        }
    }
    //**************************SEND HAND DATA TO SEVER*************************** */
    get_hand_and_send_to_sever() {
        this.ip_playTap_data = {
            id: cf_CommandID_IP.PLAYING_TAP_IP,
            r: this.op_searching_dataModel.RoomID,
            t: this.color_state,
        }
        cf_Director.instance.send_tapfist_Data(this.ip_playTap_data);
    }
    //***********************UPDATE PLAY GAME****************** */
    update_playGame_state() {
        if (cf_Director.instance.reconnect_state == RECONNECT_STATE.NORMAL_CONNECT) {
            this.scheduleOnce(function () {
                cf_Director.instance.ready_playingTap = true;
            }, 1);

            this.audio_play.start_home_nhacnen();
            this.player_show_point.node.active = true;
            this.opp_show_point.node.active = true;
            this.avatar_opp.node.active = true;
            this.avatar_player.node.active = true;
            this.showBetsIcon.node.active = true;
            var setting_node = this.node.getChildByPath('setting_group/setting_button');
            setting_node.active = true;
            this.showBetsIcon.init_show_bets_icon(this.BETS_LIST[this.op_searching_dataModel.bets]);
            this.input_data_to_sever();
            //update avatar
            this.update_avatar_player_and_opp(cf_Director.instance.avatar_for_player, this.op_searching_dataModel.name_player,
                cf_Director.instance.avatar_for_opp, this.op_searching_dataModel.name_opp);
            this.update_connect_state();
            //update round
            this.update_round(this.op_nexStage_data.current_round + 1);
            this.update_hand_level(this.op_nexStage_data.current_round + 1);
        }
        else if (cf_Director.instance.reconnect_state == RECONNECT_STATE.RECONNECT
            && cf_Director.instance.reconnect_reload_playscreen == RECONNECT_RELOADING_PLAYSCREEN.RELOADING) {
            this.scheduleOnce(function () {
                cf_Director.instance.ready_playingTap = true;
            }, 1);
            this.audio_play.start_home_nhacnen();
            this.showBetsIcon.init_show_bets_icon(this.BETS_LIST[this.op_searching_dataModel.bets]);
            this.reconnect_set_point(this.op_reconnec_data.round_win_player, this.op_reconnec_data.round_win_opp, this.op_reconnec_data.point_player, this.op_reconnec_data.point_opp);
            this.input_data_to_sever();
            //update avatar
            this.update_avatar_player_and_opp(cf_Director.instance.avatar_for_player, this.op_searching_dataModel.name_player,
                cf_Director.instance.avatar_for_opp, this.op_searching_dataModel.name_opp);
            this.update_connect_state();
            //update round
            this.update_round(this.op_nexStage_data.current_round + 1);
            this.update_hand_level(this.op_nexStage_data.current_round + 1);
        }
        else if (cf_Director.instance.reconnect_state == RECONNECT_STATE.RECONNECT
            && cf_Director.instance.reconnect_reload_playscreen == RECONNECT_RELOADING_PLAYSCREEN.PLAYSCREEN) {
            this.scheduleOnce(function () {
                cf_Director.instance.ready_playingTap = true;
            }, 1);
            this.showBetsIcon.init_show_bets_icon(this.BETS_LIST[this.op_searching_dataModel.bets]);
            this.audio_play.start_home_nhacnen();
            this.input_data_to_sever();
            this.update_round(this.op_nexStage_data.current_round + 1);
            this.reconnect_set_point(this.op_reconnec_data.round_win_player, this.op_reconnec_data.round_win_opp, this.op_reconnec_data.point_player, this.op_reconnec_data.point_opp);
            this.update_hand_level(this.op_nexStage_data.current_round + 1);
        }
    }
    //***********************UPDATE FISH***************************** */
    update_fish_state(fishToClientData: cf_fish_to_client_data_model) {
        this.op_fishToClient_data = fishToClientData;
        this.name_fish = this.NAME_FISH_LIST[this.op_fishToClient_data.species_of_fish];
        this.fish_node.get_fish_name(this.name_fish);
    }
    update_fishMoving_state() {
        if (this.op_playTap_data.status == 1 || this.op_playTap_data.status == 2 || this.op_playTap_data.status == 3 ||
            this.op_playTap_data.status == 4 || this.op_playTap_data.status == 5) {
            if (this.op_nexStage_data.current_round + 1 == 1) {
                if (this.op_playTap_data.isSelf) {
                    if (this.op_playTap_data.state_Tap == 3 || this.op_playTap_data.state_Tap == 5) {
                        this.fishState_right = FISH_STATE.EXIST;
                        this.player_node.get_fish_state_right(this.fishState_right);
                    }
                } else {
                    if (this.op_playTap_data.state_Tap == 3 || this.op_playTap_data.state_Tap == 5) {
                        this.fishState_right = FISH_STATE.EXIST;
                        this.opp_node.get_fish_state_right(this.fishState_right);
                    }
                }

            }
            if (this.op_nexStage_data.current_round + 1 == 2) {
                if (this.op_playTap_data.isSelf) {
                    if (this.op_playTap_data.state_Tap == 4 || this.op_playTap_data.state_Tap == 6) {
                        this.fishState_left = FISH_STATE.EXIST;
                        this.player_node.get_fish_state_left(this.fishState_left);
                    }
                } else {
                    if (this.op_playTap_data.state_Tap == 6 || this.op_playTap_data.state_Tap == 4) {
                        this.fishState_left = FISH_STATE.EXIST;
                        this.opp_node.get_fish_state_left(this.fishState_left);
                    }
                }

            }
            if (this.op_nexStage_data.current_round + 1 > 2) {
                if (this.op_playTap_data.isSelf) {
                    if (this.op_playTap_data.state_Tap == 3) {
                        this.fishState_right = FISH_STATE.EXIST;
                        this.player_node.get_fish_state_right(this.fishState_right);
                    }
                    else if (this.op_playTap_data.state_Tap == 4) {
                        this.fishState_left = FISH_STATE.EXIST;
                        this.player_node.get_fish_state_left(this.fishState_left);
                    }
                    else if (this.op_playTap_data.state_Tap == 5) {
                        this.fishState_right = FISH_STATE.EXIST;
                        this.player_node.get_fish_state_right(this.fishState_right);
                    }
                    else if (this.op_playTap_data.state_Tap == 6) {
                        this.fishState_left = FISH_STATE.EXIST;
                        this.player_node.get_fish_state_left(this.fishState_left);
                    }
                }
                else {
                    if (this.op_playTap_data.state_Tap == 5) {
                        this.fishState_right = FISH_STATE.EXIST;
                        this.opp_node.get_fish_state_right(this.fishState_right);
                    }
                    else if (this.op_playTap_data.state_Tap == 6) {
                        this.fishState_left = FISH_STATE.EXIST;
                        this.opp_node.get_fish_state_left(this.fishState_left);
                    }
                    else if (this.op_playTap_data.state_Tap == 3) {
                        this.fishState_right = FISH_STATE.EXIST;
                        this.opp_node.get_fish_state_right(this.fishState_right);
                    }
                    else if (this.op_playTap_data.state_Tap == 4) {
                        this.fishState_left = FISH_STATE.EXIST;
                        this.opp_node.get_fish_state_left(this.fishState_left);
                    }
                }
            }
        }
        if (this.op_playTap_data.status == 0) {
            if (this.op_nexStage_data.current_round + 1 == 1) {
                if (this.op_playTap_data.isSelf) {
                    if (this.op_playTap_data.state_Tap == 3 || this.op_playTap_data.state_Tap == 5) {
                        this.fishState_right = FISH_STATE.DISAPPEAR;
                        this.player_node.get_fish_state_right(this.fishState_right);
                    }
                }
                else {
                    if (this.op_playTap_data.state_Tap == 3 || this.op_playTap_data.state_Tap == 5) {
                        this.fishState_right = FISH_STATE.DISAPPEAR;
                        this.opp_node.get_fish_state_right(this.fishState_right);
                    }
                }
            }
            else if (this.op_nexStage_data.current_round + 1 == 2) {
                if (this.op_playTap_data.isSelf) {
                    if (this.op_playTap_data.state_Tap == 4 || this.op_playTap_data.state_Tap == 6) {
                        this.fishState_left = FISH_STATE.DISAPPEAR;
                        this.player_node.get_fish_state_left(this.fishState_left);
                    }
                }
                else {
                    if (this.op_playTap_data.state_Tap == 4 || this.op_playTap_data.state_Tap == 6) {
                        this.fishState_left = FISH_STATE.DISAPPEAR;
                        this.opp_node.get_fish_state_left(this.fishState_left);
                    }
                }
            }
            else if (this.op_nexStage_data.current_round + 1 > 2) {
                if (this.op_playTap_data.isSelf) {
                    if (this.op_playTap_data.state_Tap == 3) {
                        this.fishState_right = FISH_STATE.DISAPPEAR;
                        this.player_node.get_fish_state_right(this.fishState_right);
                    }
                    else if (this.op_playTap_data.state_Tap == 4) {
                        this.fishState_left = FISH_STATE.DISAPPEAR;
                        this.player_node.get_fish_state_left(this.fishState_left);
                    }
                    else if (this.op_playTap_data.state_Tap == 5) {
                        this.fishState_right = FISH_STATE.DISAPPEAR;
                        this.player_node.get_fish_state_right(this.fishState_right);
                    }
                    else if (this.op_playTap_data.state_Tap == 6) {
                        this.fishState_left = FISH_STATE.DISAPPEAR;
                        this.player_node.get_fish_state_left(this.fishState_left);
                    }
                }
                else {
                    if (this.op_playTap_data.state_Tap == 6) {
                        this.fishState_left = FISH_STATE.DISAPPEAR;
                        this.opp_node.get_fish_state_left(this.fishState_left);
                    }
                    else if (this.op_playTap_data.state_Tap == 5) {
                        this.fishState_right = FISH_STATE.DISAPPEAR;
                        this.opp_node.get_fish_state_right(this.fishState_right);
                    }
                    else if (this.op_playTap_data.state_Tap == 4) {
                        this.fishState_left = FISH_STATE.DISAPPEAR;
                        this.opp_node.get_fish_state_left(this.fishState_left);
                    }
                    else if (this.op_playTap_data.state_Tap == 3) {
                        this.fishState_right = FISH_STATE.DISAPPEAR;
                        this.opp_node.get_fish_state_right(this.fishState_right);
                    }
                }
            }
        }
    }
    update_win_lose_before_tap() {
        if (this.op_playTap_data.status == 0) {
            if (this.op_playTap_data.isSelf) {
                if (this.tap_state_player == Tap_false_true_state.FALSE) {
                    this.player_win_lose_state = Win_lose_state.LOSE;
                    this.opp_win_lose_state = Win_lose_state.WIN;
                    this.check_current_round();
                }
                else if (this.tap_state_player == Tap_false_true_state.TRUE) {
                    this.player_win_lose_state = Win_lose_state.WIN;
                    this.opp_win_lose_state = Win_lose_state.LOSE;
                    this.check_current_round();
                }
            } else {
                if (this.tap_state_opp == Tap_false_true_state.FALSE) {
                    this.player_win_lose_state = Win_lose_state.WIN;
                    this.opp_win_lose_state = Win_lose_state.LOSE;
                    this.check_current_round();
                }
                else if (this.tap_state_opp == Tap_false_true_state.TRUE) {
                    this.player_win_lose_state = Win_lose_state.LOSE;
                    this.opp_win_lose_state = Win_lose_state.WIN;
                    this.check_current_round();
                }
            }
        }
        else if (this.op_playTap_data.status == 1 || this.op_playTap_data.status == 2 || this.op_playTap_data.status == 3) {
            if (this.op_playTap_data.isSelf) {
                this.scheduleOnce(function () {
                    this.audio_play.efect_eating1();
                }, 0.5);

                this.tap_state_opp = Tap_false_true_state.FALSE;
                this.tap_state_player = Tap_false_true_state.TRUE;
                this.player_win_lose_state = Win_lose_state.WIN;
                this.opp_win_lose_state = Win_lose_state.LOSE;
                this.check_current_round();
            }
            else {
                this.scheduleOnce(function () {
                    this.audio_play.efect_eating1();
                }, 0.5);
                this.tap_state_player = Tap_false_true_state.FALSE;
                this.tap_state_opp = Tap_false_true_state.TRUE;
                this.player_win_lose_state = Win_lose_state.LOSE;
                this.opp_win_lose_state = Win_lose_state.WIN;
                this.check_current_round();
            }
            tween(this.node)
                .delay(0.5)
                .call(() => {
                    this.tap_state_opp = Tap_false_true_state.NO_STATE;
                    this.tap_state_player = Tap_false_true_state.NO_STATE;
                })
                .start();
        }
        else if (this.op_playTap_data.status == 4 || this.op_playTap_data.status == 5) {
            if (this.op_playTap_data.isSelf) {
                this.player_win_lose_state = Win_lose_state.LOSE;
                this.opp_win_lose_state = Win_lose_state.WIN;
                this.check_current_round();
                if (this.op_playTap_data.status == 4) {
                    this.audio_play.effect_boom();
                    this.fish_node.boom_effect_start();
                    this.scheduleOnce(function () {
                        this.audio_play.effect_meo_an_boom();
                    }, 0.5);
                    if (this.op_playTap_data.state_Tap == 3) {
                        this.player_node.set_right_hand_effect_boom("img_tayden");
                    }
                    else if (this.op_playTap_data.state_Tap == 4) {
                        this.player_node.set_left_hand_effect_boom("img_tayden");
                    }
                    else if (this.op_playTap_data.state_Tap == 5) {
                        this.player_node.set_right_hand_effect_boom("img_tayden");
                    }
                    else if (this.op_playTap_data.state_Tap == 6) {
                        this.player_node.set_left_hand_effect_boom("img_tayden");
                    }
                }
                if (this.op_playTap_data.status == 5) {
                    this.scheduleOnce(function () {
                        this.audio_play.effect_ram_1();
                    }, 0.7);

                    this.fish_node.thiu_effect_start();
                    if (this.op_playTap_data.state_Tap == 3) {
                        this.player_node.set_right_hand_effect_boom("img_tay_thiu");
                    }
                    else if (this.op_playTap_data.state_Tap == 4) {
                        this.player_node.set_left_hand_effect_boom("img_tay_thiu");
                    }
                    else if (this.op_playTap_data.state_Tap == 5) {
                        this.player_node.set_right_hand_effect_boom("img_tay_thiu");
                    }
                    else if (this.op_playTap_data.state_Tap == 6) {
                        this.player_node.set_left_hand_effect_boom("img_tay_thiu");
                    }
                }
            }
            else {
                this.player_win_lose_state = Win_lose_state.WIN;
                this.opp_win_lose_state = Win_lose_state.LOSE;
                this.check_current_round();
                if (this.op_playTap_data.status == 4) {
                    this.audio_play.effect_boom();
                    this.fish_node.boom_effect_start();
                    this.scheduleOnce(function () {
                        this.audio_play.effect_meo_an_boom();
                    }, 0.5);
                    if (this.op_playTap_data.state_Tap == 5) {
                        this.opp_node.set_right_hand_effect_boom("img_tayden");
                    }
                    else if (this.op_playTap_data.state_Tap == 6) {
                        this.opp_node.set_left_hand_effect_boom("img_tayden");
                    }
                    else if (this.op_playTap_data.state_Tap == 3) {
                        this.opp_node.set_right_hand_effect_boom("img_tayden");
                    }
                    else if (this.op_playTap_data.state_Tap == 4) {
                        this.opp_node.set_left_hand_effect_boom("img_tayden");
                    }

                }
                if (this.op_playTap_data.status == 5) {
                    this.scheduleOnce(function () {
                        this.audio_play.effect_ram_1();
                    }, 0.7);
                    this.fish_node.thiu_effect_start();
                    if (this.op_playTap_data.state_Tap == 5) {
                        this.opp_node.set_right_hand_effect_boom("img_tay_thiu");
                    }
                    else if (this.op_playTap_data.state_Tap == 6) {
                        this.opp_node.set_left_hand_effect_boom("img_tay_thiu");
                    }
                    else if (this.op_playTap_data.state_Tap == 3) {
                        this.opp_node.set_right_hand_effect_boom("img_tay_thiu");
                    }
                    else if (this.op_playTap_data.state_Tap == 4) {
                        this.opp_node.set_left_hand_effect_boom("img_tay_thiu");
                    }
                }
            }
        }
    }
    check_current_round() {
        if (this.op_nexStage_data.current_round + 1 == 1) {
            this.round1_win_lose.get_playing_tap_data(this.op_playTap_data);
            this.round1_win_lose.set_img_box_top(this.opp_win_lose_state);
            this.round1_win_lose.set_img_box_bottom(this.player_win_lose_state);
            this.round1_win_lose.box_chat_moving(this.op_nexStage_data.current_round + 1);
        }
        else if (this.op_nexStage_data.current_round + 1 > 1) {
            this.round2_3_4_5_win_lose.get_playing_tap_data(this.op_playTap_data);
            this.round2_3_4_5_win_lose.set_img_box_top(this.opp_win_lose_state);
            this.round2_3_4_5_win_lose.set_img_box_bottom(this.player_win_lose_state);
            this.round2_3_4_5_win_lose.box_chat_moving(this.op_nexStage_data.current_round + 1);
        }
    }
    delete_fish() {
        this.fish_node.delete_fish();
    }
    //**************************UPDATE PLAYING TAP********************* */

    update_playingTap_data(playingTap_data: cf_playing_tap_data_model) {
        this.audio_play.effect_tap_fish();
        this.op_playTap_data = playingTap_data;
        this.update_fishMoving_state();
        this.update_handState();
        this.update_win_lose_before_tap();
        this.update_point(this.op_playTap_data.player_point_add, this.op_playTap_data.player_point_sum, this.op_playTap_data.opp_point_add, this.op_playTap_data.opp_point_sum);
    }
    update_handState() {
        if (this.op_playTap_data.isSelf == true) {
            if (this.op_playTap_data.state_Tap == 3 || this.op_playTap_data.state_Tap == 5) {
                this.player_node.right_hand_moving();
            }
            else if (this.op_playTap_data.state_Tap == 4 || this.op_playTap_data.state_Tap == 6) {
                this.player_node.left_hand_moving();
            }
        }
        else if (this.op_playTap_data.isSelf == false) {
            if (this.op_playTap_data.state_Tap == 6 || this.op_playTap_data.state_Tap == 4) {
                this.opp_node.set_left_hand_moving();
            }
            else if (this.op_playTap_data.state_Tap == 5 || this.op_playTap_data.state_Tap == 3) {
                this.opp_node.set_right_hand_moving();
            }
        }
    }
    update_hand_level(current_round: number) {
        this.player_node.set_update_lever(current_round);
        this.opp_node.get_round_level(current_round);
    }
    //***************(UPDATE AVATAR_NAME_PLAYER_OPP)*************************/
    update_avatar_player_and_opp(avatar_player: SpriteFrame, avatar_name_player: string, avatar_index_opp: SpriteFrame, avatar_name_opp: string) {
        this.avatar_player.show_avatar(avatar_player, avatar_name_player);
        this.avatar_opp.show_avatar(avatar_index_opp, avatar_name_opp);
    }
    update_connect_state() {
        this.avatar_player.init_connect_state(cf_Director.instance.connect_player);
        this.avatar_opp.init_connect_state(cf_Director.instance.connect_opp);
    }
    //***************UPDATE ROUND*********************** */
    update_round(current_round: number) {
        this.round_node.show_round(current_round);
    }
    //****************UPDATE POINT GAME************************ */
    update_point(player_point_add: number, player_point_sum: number, opp_point_add: number, opp_point_sum: number) {
        this.opp_show_point.show_point_start(opp_point_add, opp_point_sum);
        this.player_show_point.show_point_start(player_point_add, player_point_sum);
    }
    check_point(roundState: roundState, player_total_score: number, player_point_add: number, opp_total_score: number, opp_point_add: number) {
        this.player_show_point.check_point_rank(roundState, player_total_score, opp_total_score, player_point_add);
        this.opp_show_point.check_point_rank(roundState, opp_total_score, player_total_score, opp_point_add);
    }
    nex_screen_win_lose_game() {
        var result_screen_prefab = VDScreenManager.instance.assetBundle.get(cf_Path.RESULT_SCREEN, Prefab);
        VDScreenManager.instance.replaceScreenAtIndex(result_screen_prefab, 0, (result: VDBaseScreen) => {
            cf_Director.instance.gameStateFE = GAME_STATE_FE.RESULT_SCREEN;
            cf_Director.instance.resultScreen = result as cf_ResultScreen;
            cf_Director.instance.playingScreen = null;
        });
    }
    reconnect_set_point(round_win_player: number, round_win_opp: number, player_point: number, opp_point: number) {
        if (cf_Director.instance.OP_playingTapDataModel) {
            this.op_playTap_data = cf_Director.instance.OP_playingTapDataModel;
            if (cf_Director.instance.OP_endStageDataModel) {
                this.op_endStage_data = cf_Director.instance.OP_endStageDataModel;
                if (this.op_endStage_data.isSelf) {
                    if (cf_Director.instance.end_stage_state == END_STAGE_STATE.ENDSTAGE) {
                        this.opp_show_point.reconnect_setPoint(round_win_opp * 5, 0);
                        this.player_show_point.reconnect_setPoint(round_win_player * 5 + 5, 0);
                    }
                    else if (cf_Director.instance.end_stage_state == END_STAGE_STATE.PLAYING) {
                        this.opp_show_point.reconnect_setPoint(round_win_opp * 5, this.op_playTap_data.opp_point_sum);
                        this.player_show_point.reconnect_setPoint(round_win_player * 5 + 5, this.op_playTap_data.player_point_sum);
                    }

                } else {
                    if (cf_Director.instance.end_stage_state == END_STAGE_STATE.ENDSTAGE) {
                        this.opp_show_point.reconnect_setPoint(round_win_opp * 5 + 5, 0);
                        this.player_show_point.reconnect_setPoint(round_win_player * 5, 0);
                    }
                    else if (cf_Director.instance.end_stage_state == END_STAGE_STATE.PLAYING) {
                        this.opp_show_point.reconnect_setPoint(round_win_opp * 5 + 5, this.op_playTap_data.opp_point_sum);
                        this.player_show_point.reconnect_setPoint(round_win_player * 5, this.op_playTap_data.player_point_sum);
                    }
                }
            } else {
                this.opp_show_point.reconnect_setPoint(round_win_opp * 5, this.op_playTap_data.opp_point_sum);
                this.player_show_point.reconnect_setPoint(round_win_player * 5, this.op_playTap_data.player_point_sum);
            }
        } else {
            this.opp_show_point.reconnect_setPoint(round_win_opp * 5, opp_point);
            this.player_show_point.reconnect_setPoint(round_win_player * 5, player_point);
        }
    }
    //********************* UPDATE WIN-LOSE ROUND GAME ***************** */
    update_win_lose_round_game(win_lose_for_player: boolean) {
        if (this.op_endStage_data.currentRound + 1 == 1) {
            this.player_node.right_hand_indent();
            this.opp_node.right_hand_indent();
        }
        else if (this.op_endStage_data.currentRound + 1 == 2) {
            this.player_node.left_hand_indent();
            this.opp_node.left_hand_indent();
        }
        else if (this.op_endStage_data.currentRound + 1 > 2) {
            this.player_node.right_hand_indent();
            this.player_node.left_hand_indent();
            this.opp_node.left_hand_indent();
            this.opp_node.right_hand_indent();
        }
        if (win_lose_for_player) {
            this.win_lose_game.show_win();
            this.audio_play.effect_win_game();
        } else {
            this.win_lose_game.show_lose();
            this.audio_play.effect_lose_game();
        }
    }
    disconnect_endGame(win_lose_state: boolean) {
        if (win_lose_state) {
            this.win_lose_game.show_win();
            this.audio_play.effect_win_game();
        } else {
            this.win_lose_game.show_lose();
            this.audio_play.effect_lose_game();
        }
    }
    onClick_setting_button() {
        VDScreenManager.instance.showPopupFromPrefabName(cf_Path.PLAY_SCREEN_POPUP, (popup: VDBasePopup) => {
            this.play_setting_popup = popup;
            let callbacks = [() => {
                VDScreenManager.instance.hidePopup(true);
            }];
        }, false, true, true);
    }
    sound_onclick_button() {
        if (this.audio_play) {
            this.audio_play.effect_clickButton();
        }
    }
    update(deltaTime: number) {
    }
}


