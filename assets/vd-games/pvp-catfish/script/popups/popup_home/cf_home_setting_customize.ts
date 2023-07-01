import { _decorator, Component, Node } from 'cc';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import { cf_GAME_STATE_EVENT, cf_LOCAL_STORAGE } from '../../network/cf_NetworkDefine';
import { cf_Director } from '../../core/cf_Director';
import { VDAudioManager } from '../../../../../vd-framework/audio/VDAudioManager';
import { cf_playing_audioPlay } from '../../playing/cf_playing_audioPlay';
import { Vec3 } from 'cc';
import { sys } from 'cc';
const { ccclass, property } = _decorator;
enum MOVING_STATE {
    NO_STATE,
    START,
    MOVING,
    END,
}
@ccclass('cf_home_setting_customize')
export class cf_home_setting_customize extends VDBasePopup {
    @property(Node)
    private left_button: Node = null;
    @property(Node)
    private right_button: Node = null;
    private leftButton_position: Vec3 = new Vec3(0, 0, 0);
    private rightButton_position: Vec3 = new Vec3(0, 0, 0);
    private audio_play: cf_playing_audioPlay = null;
    private moving_state_left: MOVING_STATE = MOVING_STATE.NO_STATE;
    private moving_state_right: MOVING_STATE = MOVING_STATE.NO_STATE;
    private
    onLoad() {
        this.audio_play = this.node.getComponent(cf_playing_audioPlay);
    }
    start() {
        this.left_button.on(cf_GAME_STATE_EVENT.MOVE_BUTTON_POSITION, this.get_position_node_moving_left, this);
        this.right_button.on(cf_GAME_STATE_EVENT.MOVE_BUTTON_POSITION, this.get_position_node_moving_right, this);
        this.left_button.on(cf_GAME_STATE_EVENT.BUTTON_MOVING_STATE, this.get_button_moving_state_left.bind(this));
        this.right_button.on(cf_GAME_STATE_EVENT.BUTTON_MOVING_STATE, this.get_button_moving_state_right.bind(this));
    }
    get_button_moving_state_left(state: MOVING_STATE) {
        if (state == MOVING_STATE.START) {
            this.moving_state_left = MOVING_STATE.START;
        }
        else if (state == MOVING_STATE.MOVING) {
            this.moving_state_left = MOVING_STATE.MOVING;
        }
        else if (state == MOVING_STATE.END) {
            this.moving_state_left = MOVING_STATE.END;
        }
    }
    get_button_moving_state_right(state: MOVING_STATE) {
        if (state == MOVING_STATE.START) {
            this.moving_state_right = MOVING_STATE.START;
        }
        else if (state == MOVING_STATE.MOVING) {
            this.moving_state_right = MOVING_STATE.MOVING;
        }
        else if (state == MOVING_STATE.END) {
            this.moving_state_right = MOVING_STATE.END;
        }
    }
    check_moving_state() {
        if (this.moving_state_left != MOVING_STATE.START && this.moving_state_left != MOVING_STATE.MOVING && this.moving_state_left != MOVING_STATE.END) {
            this.moving_state_left = MOVING_STATE.NO_STATE;
        }
        if (this.moving_state_right != MOVING_STATE.START && this.moving_state_right != MOVING_STATE.MOVING && this.moving_state_right != MOVING_STATE.END) {
            this.moving_state_right = MOVING_STATE.NO_STATE;
        }
    }
    get_position_node_moving_left(left_position: Vec3) {
        this.leftButton_position = left_position;
    }
    get_position_node_moving_right(right_position: Vec3) {
        this.rightButton_position = right_position;
    }
    click_on_button_save() {
        this.check_moving_state();
        if (this.moving_state_left == MOVING_STATE.NO_STATE && this.moving_state_right == MOVING_STATE.NO_STATE) {
            this.leftButton_position = this.left_button.getWorldPosition();
            this.rightButton_position = this.right_button.getWorldPosition();
            cf_Director.instance.saveData_button_position(this.leftButton_position, this.rightButton_position);
        }

        else if (this.moving_state_left == MOVING_STATE.NO_STATE && this.moving_state_right != MOVING_STATE.NO_STATE) {
            this.leftButton_position = this.left_button.getWorldPosition();
            cf_Director.instance.saveData_button_position(this.leftButton_position, this.rightButton_position);
        }

        else if (this.moving_state_right == MOVING_STATE.NO_STATE && this.moving_state_left != MOVING_STATE.NO_STATE) {
            this.rightButton_position = this.right_button.getWorldPosition();
            cf_Director.instance.saveData_button_position(this.leftButton_position, this.rightButton_position);
        } else {
            cf_Director.instance.saveData_button_position(this.leftButton_position, this.rightButton_position);
        }
        console.log(JSON.parse(sys.localStorage.getItem(cf_LOCAL_STORAGE.ARR_BUTTON_LEFT_RIGHT)));
        this.hide();
    }

    effect_clickButton() {
        this.audio_play.effect_clickButton();
    }
    update(deltaTime: number) {

    }
}


