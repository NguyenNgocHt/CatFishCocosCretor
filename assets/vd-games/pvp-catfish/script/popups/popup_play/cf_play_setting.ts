import { _decorator, Component, Node, Prefab } from 'cc';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
import { cf_Path, RECONNECT_STATE } from '../../common/cf_Define';
import VDBaseScreen from '../../../../../vd-framework/ui/VDBaseScreen';
import { cf_Director, GAME_STATE_FE } from '../../core/cf_Director';
import { cf_LoadingScreen } from '../../screens/cf_LoadingScreen';
import { playing_leave_game_inputSever } from '../../model/cf_data_Input_model';
import { cf_CommandID_IP } from '../../network/cf_NetworkDefine';
import { cf_searching_data_model } from '../../model/cf_searching_Model';
import { cf_HomeScreen } from '../../screens/cf_HomeScreen';
import { VDAudioManager } from '../../../../../vd-framework/audio/VDAudioManager';
import { cf_playing_audioPlay } from '../../playing/cf_playing_audioPlay';
import { ON_OFF_STATE } from '../../common/cf_Define';
import { END_GAME_STATE } from '../../common/cf_Define';
const { ccclass, property } = _decorator;
export enum LOGIN_STATE {
    NO_LOGIN = 0,
    LOGINNING = 1,
    LOGIN_SUCCESS = 2,
    LOGIN_FAIL = 3,
}
enum searching_comeBack_state {
    nostate,
    normalSearching,
    searching_comeBack,
}
@ccclass('cf_play_setting')
export class cf_play_setting extends VDBasePopup {
    private IP_leaveGame_data: playing_leave_game_inputSever = null;
    private OP_searching_data: cf_searching_data_model = null;
    private play_audio: cf_playing_audioPlay = null;
    @property(Node)
    music_button_node: Node = null;
    @property(Node)
    sfx_button_node: Node = null;
    onLoad() {
        this.play_audio = this.node.getComponent(cf_playing_audioPlay);
    }
    start() {
        this.set_button_music_statte();
        this.set_button_sfx_state();
    }
    onClick_X_button() {
        this.hide();
    }
    //click button music
    click_button_music_setting() {
        cf_Director.instance.count_music_button_press = cf_Director.instance.count_music_button_press + 1;
        if (cf_Director.instance.count_music_button_press == 1) {
            this.play_audio.music_pause();
            this.play_audio.stop_audioPlay();
            cf_Director.instance.music_button_on_off_state = ON_OFF_STATE.OFF;
            this.set_button_music_statte();

        }
        if (cf_Director.instance.count_music_button_press == 2) {
            this.play_audio.music_play();
            this.play_audio.start_home_nhacnen();
            cf_Director.instance.music_button_on_off_state = ON_OFF_STATE.ON;
            this.set_button_music_statte();
            cf_Director.instance.count_music_button_press = 0;
        }
    }
    set_button_music_statte() {
        if (cf_Director.instance.music_button_on_off_state == ON_OFF_STATE.OFF) {
            this.music_button_node.active = false;
        }
        if (cf_Director.instance.music_button_on_off_state == ON_OFF_STATE.ON) {
            this.music_button_node.active = true;
        }
    }
    //click button sfx
    on_click_sfx_button() {
        cf_Director.instance.count_sfx_button_press = cf_Director.instance.count_sfx_button_press + 1;
        if (cf_Director.instance.count_sfx_button_press == 1) {
            this.play_audio.effect_stop_all();
            cf_Director.instance.sfx_button_on_off_state = ON_OFF_STATE.OFF;
            this.set_button_sfx_state();
        }
        if (cf_Director.instance.count_sfx_button_press == 2) {
            this.play_audio.effect_play_all();
            cf_Director.instance.sfx_button_on_off_state = ON_OFF_STATE.ON;
            this.set_button_sfx_state();
            cf_Director.instance.count_sfx_button_press = 0;
        }
    }
    set_button_sfx_state() {
        if (cf_Director.instance.sfx_button_on_off_state == ON_OFF_STATE.OFF) {
            this.sfx_button_node.active = false;
        }
        if (cf_Director.instance.sfx_button_on_off_state == ON_OFF_STATE.ON) {
            this.sfx_button_node.active = true;
        }
    }
    onClick_exit_button() {
        this.OP_searching_data = cf_Director.instance.OP_searchingDataModel;
        this.IP_leaveGame_data = {
            id: cf_CommandID_IP.PLAYING_LEAVE_GAME_IP,
            r: this.OP_searching_data.RoomID,
        };
        cf_Director.instance.send_playingLeave_GameData(this.IP_leaveGame_data);
        cf_Director.instance.searching_comeback_state = searching_comeBack_state.normalSearching;
        let home_screen = VDScreenManager.instance.assetBundle.get(cf_Path.HOME_SCREEN, Prefab);
        VDScreenManager.instance.replaceScreenAtIndex(home_screen, 0, (screen: VDBaseScreen) => {
            cf_Director.instance.homeScreen = screen as cf_HomeScreen;
            cf_Director.instance.reconnect_state = RECONNECT_STATE.NORMAL_CONNECT;
            cf_Director.instance.gameStateFE = GAME_STATE_FE.HOME_SCREEN;
            cf_Director.instance.playingScreen = null;
        });
        this.hide();
    }
    on_click_button_sound() {
        if (this.play_audio) {
            this.play_audio.effect_clickButton();
        }
    }
    update(deltaTime: number) {
    }
}


