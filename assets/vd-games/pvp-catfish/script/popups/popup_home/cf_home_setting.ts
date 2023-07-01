import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import { VDAudioManager } from '../../../../../vd-framework/audio/VDAudioManager';
import { cf_playing_audioPlay } from '../../playing/cf_playing_audioPlay';
import { cf_Path, ON_OFF_STATE } from '../../common/cf_Define';
import { cf_Director } from '../../core/cf_Director';
import VDBaseScreen from '../../../../../vd-framework/ui/VDBaseScreen';
import { GAME_STATE_FE } from '../../core/cf_Director';
import { cf_LoadingScreen } from '../../screens/cf_LoadingScreen';
@ccclass('cf_home_setting')
export class cf_home_setting extends VDBasePopup {
    private home_setting_popup_customize: VDBasePopup = null;
    @property(Node)
    hand_cat_for_sound_node: Node = null;
    @property(Node)
    hand_cat_for_vibrate: Node = null;
    private audio_play: cf_playing_audioPlay = null;
    start() {
        this.audio_play = this.node.getComponent(cf_playing_audioPlay);
        this.set_button_statte();
        this.set_button_sfx_state();
    }
    click_button_sound_setting() {
        cf_Director.instance.count_music_button_press = cf_Director.instance.count_music_button_press + 1;
        if (cf_Director.instance.count_music_button_press == 1) {
            this.audio_play.music_pause();
            this.audio_play.stop_audioPlay();
            cf_Director.instance.music_button_on_off_state = ON_OFF_STATE.OFF;
            this.set_button_statte();

        }
        if (cf_Director.instance.count_music_button_press == 2) {
            this.audio_play.music_play();
            this.audio_play.start_home_nhacnen();
            cf_Director.instance.music_button_on_off_state = ON_OFF_STATE.ON;
            this.set_button_statte();
            cf_Director.instance.count_music_button_press = 0;
        }
    }
    set_button_statte() {
        if (cf_Director.instance.music_button_on_off_state == ON_OFF_STATE.OFF) {
            this.hand_cat_for_sound_node.active = false;
        }
        if (cf_Director.instance.music_button_on_off_state == ON_OFF_STATE.ON) {
            this.hand_cat_for_sound_node.active = true;
        }
    }
    click_button_X() {
        this.hide();
    }
    on_click_sfx_button() {
        cf_Director.instance.count_sfx_button_press = cf_Director.instance.count_sfx_button_press + 1;
        if (cf_Director.instance.count_sfx_button_press == 1) {
            this.audio_play.effect_stop_all();
            cf_Director.instance.sfx_button_on_off_state = ON_OFF_STATE.OFF;
            this.set_button_sfx_state();
        }
        if (cf_Director.instance.count_sfx_button_press == 2) {
            this.audio_play.effect_play_all();
            cf_Director.instance.sfx_button_on_off_state = ON_OFF_STATE.ON;
            this.set_button_sfx_state();
            cf_Director.instance.count_sfx_button_press = 0;
        }
    }
    set_button_sfx_state() {
        if (cf_Director.instance.sfx_button_on_off_state == ON_OFF_STATE.OFF) {
            this.hand_cat_for_vibrate.active = false;
        }
        if (cf_Director.instance.sfx_button_on_off_state == ON_OFF_STATE.ON) {
            this.hand_cat_for_vibrate.active = true;
        }
    }
    click_customize_button() {
        VDScreenManager.instance.showPopupFromPrefabName(cf_Path.HOME_SETTING_POPUP_CUSTOMIZE, (popup: VDBasePopup) => {
            this.home_setting_popup_customize = popup;
            let callbacks = [() => {
                VDScreenManager.instance.hidePopup(true);
            }];
        }, false, true, true);
    }
    onclick_exit_button() {
        let loading_screen = VDScreenManager.instance.assetBundle.get(cf_Path.LOADING_SCREEN, Prefab);
        VDScreenManager.instance.replaceScreenAtIndex(loading_screen, 0, (screen: VDBaseScreen) => {
            cf_Director.instance.gameStateFE = GAME_STATE_FE.LOADING_SCREEN;
            cf_Director.instance.LoadingScreen = screen as cf_LoadingScreen;
        });
        this.hide();
    }

    effect_clickButton() {
        this.audio_play.effect_clickButton();
    }
    update(deltaTime: number) {

    }
}


