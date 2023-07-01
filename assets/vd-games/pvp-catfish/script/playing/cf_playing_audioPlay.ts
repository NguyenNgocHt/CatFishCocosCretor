import { _decorator, Component, Node } from 'cc';
import { VDAudioManager } from '../../../../vd-framework/audio/VDAudioManager';
import { cf_Director } from '../core/cf_Director';
import { ON_OFF_STATE } from '../common/cf_Define';
const { ccclass, property } = _decorator;
enum EFFECT_STATE {
    NO_STATE,
    ON,
    OFF,
}
@ccclass('cf_playing_audioPlay')
export class cf_playing_audioPlay extends Component {
    onLoad() {
        VDAudioManager.instance.effectVolume = 1;
    }
    start() {
    }
    start_home_nhacnen() {

        if (cf_Director.instance.music_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.musicVolume = 0.1;
            VDAudioManager.instance.playBGM('cf_nhacnen_new');
        }
    }
    stop_audioPlay() {

        if (cf_Director.instance.music_on_off_state == ON_OFF_STATE.OFF) {
            VDAudioManager.instance.pauseBGM();
        }
    }
    stop_music_home() {
        VDAudioManager.instance.pauseBGM();
    }
    resume_home_nhacnen() {
        VDAudioManager.instance.resumeBGM();
    }
    effect_clickButton() {
        if (cf_Director.instance.sfx_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.playEffect("cf_clickbutton");
        }
    }
    effect_tap_fish() {
        if (cf_Director.instance.sfx_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.playEffect("cf_anca");
        }
    }
    effect_meo_an_boom() {
        if (cf_Director.instance.sfx_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.playEffect("cf_meoanbom");
        }
    }
    effect_boom() {
        if (cf_Director.instance.sfx_button_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.playEffect("cf_boom");
        }
    }
    effect_ram_2() {
        if (cf_Director.instance.sfx_button_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.playEffect("cf_ram_2");
        }
    }
    effect_ram_1() {
        if (cf_Director.instance.sfx_button_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.playEffect("cf_ram_1");
        }
    }
    efect_eating() {
        if (cf_Director.instance.sfx_button_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.playEffect("cf_cat_eating_sound");
        }
    }
    efect_eating1() {
        if (cf_Director.instance.sfx_button_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.playEffect("cf_cat_eating_1");
        }
    }
    effect_lose_game() {
        if (cf_Director.instance.sfx_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.playEffect("cf_lose_game");
        }
    }
    effect_win_game() {
        if (cf_Director.instance.sfx_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.playEffect("cf_win_game");
        }
    }
    effect_321_start() {
        if (cf_Director.instance.sfx_on_off_state == ON_OFF_STATE.ON) {
            VDAudioManager.instance.playEffect("cf_321_Start");
        }
    }
    effect_stop_all() {
        cf_Director.instance.sfx_on_off_state = ON_OFF_STATE.OFF
    }
    effect_play_all() {
        cf_Director.instance.sfx_on_off_state = ON_OFF_STATE.ON
    }
    music_play() {
        cf_Director.instance.music_on_off_state = ON_OFF_STATE.ON;
    }
    music_pause() {
        cf_Director.instance.music_on_off_state = ON_OFF_STATE.OFF;
    }
    //rung 2s
    effect_vibrate() {
        navigator.vibrate(2000);
        setTimeout(() => {
            navigator.vibrate(0);
        }, 2000);
    }
    update(deltaTime: number) {

    }
}


