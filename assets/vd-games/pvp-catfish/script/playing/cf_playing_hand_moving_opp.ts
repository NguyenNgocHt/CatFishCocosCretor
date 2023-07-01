import { _decorator, Component, Node, tween, random, math, Vec3, SpriteAtlas, SpriteFrame } from 'cc';
import { fish_lis, random_number } from '../../../../vd-mock/mock_config';
import { mock_config } from '../../../../vd-mock/mock_config';
import { cf_Director } from '../core/cf_Director';
import { VDEventListener } from '../../../../vd-framework/common/VDEventListener';
import { cf_GAME_STATE_EVENT } from '../network/cf_NetworkDefine';
import { RECONNECT_STATE } from '../common/cf_Define';
import { cf_Path } from '../common/cf_Define';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { Sprite } from 'cc';
import { UIOpacity } from 'cc';
const { ccclass, property } = _decorator;
enum FISH_STATE {
    NOSTATE,
    DISAPPEAR,
    EXIST,
}
enum HAND_STATE {
    NOSTATE,
    LEFT_HAND,
    RIGHT_HAND,
}
enum reconectState {
    nostate,
    normalConnect,
    reconnect,
}
@ccclass('cf_playing_hand_moving_opp')
export class cf_playing_hand_moving_opp extends Component {
    @property(Node)
    private left_hand: Node = null;
    @property(Node)
    private right_hand: Node = null;
    @property(Node)
    private emit_from_playing_show_fish: Node = null;
    @property(Node)
    private position_origin_hand_moving: Node = null;
    @property(Node)
    private emit_from_playing: Node = null;
    @property(Node)
    private plate_left: Node = null;
    @property(Node)
    private plate_right: Node = null;
    @property(Node)
    private position_origin_left: Node = null;
    @property(Node)
    private position_origin_right: Node = null;
    private p_start_left_hand: Vec3 = new Vec3(0, 0, 0);
    private p_start_right_hand: Vec3 = new Vec3(0, 0, 0);
    private fistState_left: FISH_STATE = FISH_STATE.NOSTATE;
    private fistState_right: FISH_STATE = FISH_STATE.NOSTATE;
    private handState: HAND_STATE = HAND_STATE.NOSTATE;
    private reconnect_state: reconectState = reconectState.nostate;
    private count_round: number = 0;
    private round_level: number = 0;
    private left_plate_posStart: Vec3 = new Vec3(0, 0, 0);
    private right_plate_posStart: Vec3 = new Vec3(0, 0, 0);
    private left_hand_posStart: Vec3 = new Vec3(0, 0, 0);
    private right_hand_posStart: Vec3 = new Vec3(0, 0, 0);
    private tap_state: boolean = false;
    onLoad() {
        this.left_plate_posStart = this.plate_left.getWorldPosition();
        this.right_plate_posStart = this.plate_right.getWorldPosition();
        this.left_hand_posStart = this.left_hand.getWorldPosition();
        this.right_hand_posStart = this.right_hand.getWorldPosition();
    }
    start() {
    }
    get_round_level(round_level_reconnect: number) {
        if (cf_Director.instance.reconnect_state == RECONNECT_STATE.NORMAL_CONNECT) {
            this.round_level = round_level_reconnect;
            if (this.round_level == 1) {

                let p = this.position_origin_right.getWorldPosition();
                tween(this.plate_right)
                    .to(0.5, { worldPosition: p })
                    .call(() => {
                        this.p_start_right_hand = this.right_hand.getWorldPosition();
                    })
                    .start();
            }
            else if (this.round_level == 2) {
                let p = this.position_origin_left.getWorldPosition();
                tween(this.plate_right)
                    .to(0.5, { worldPosition: this.right_plate_posStart })
                    .start();
                tween(this.plate_left)
                    .to(0.5, { worldPosition: p })
                    .call(() => {
                        this.p_start_left_hand = this.left_hand.getWorldPosition();
                    })
                    .start();
            }
            else if (this.round_level == 3) {
                let p = this.position_origin_right.getWorldPosition();
                tween(this.plate_right)
                    .to(0.5, { worldPosition: new Vec3(p.x, p.y, 0) })
                    .call(() => {
                        this.p_start_right_hand = this.right_hand.getWorldPosition();
                    })
                    .start();
            }
        }
        else if (cf_Director.instance.reconnect_state == RECONNECT_STATE.RECONNECT) {
            this.round_level = round_level_reconnect;
            if (this.round_level == 1) {
                let p = this.position_origin_right.getWorldPosition();
                tween(this.plate_right)
                    .to(0.5, { worldPosition: p })
                    .call(() => {
                        this.p_start_right_hand = this.right_hand.getWorldPosition();
                        cf_Director.instance.reconnect_state = RECONNECT_STATE.NORMAL_CONNECT;
                    })
                    .start();
            }
            else if (this.round_level == 2) {
                if (cf_Director.instance.OP_reconnectDataModel.status) {

                    let p = this.position_origin_left.getWorldPosition();
                    tween(this.plate_left)
                        .to(0.5, { worldPosition: p })
                        .call(() => {
                            this.p_start_left_hand = this.left_hand.getWorldPosition();
                            cf_Director.instance.reconnect_state = RECONNECT_STATE.NORMAL_CONNECT;
                        })
                        .start();
                } else {
                    let p = this.position_origin_left.getWorldPosition();
                    tween(this.plate_right)
                        .to(0.5, { worldPosition: this.right_plate_posStart })
                        .start();
                    tween(this.plate_left)
                        .to(0.5, { worldPosition: p })
                        .call(() => {
                            this.p_start_left_hand = this.left_hand.getWorldPosition();
                            cf_Director.instance.reconnect_state = RECONNECT_STATE.NORMAL_CONNECT;
                        })
                        .start();
                }

            }
            else if (this.round_level >= 3) {
                this.count_round = this.count_round + 1;
                if (this.count_round == 1) {
                    let p_right = this.position_origin_right.getWorldPosition();
                    let p_left = this.position_origin_left.getWorldPosition();
                    tween(this.plate_right)
                        .to(0.5, { worldPosition: p_right })
                        .call(() => {
                            this.p_start_right_hand = this.right_hand.getWorldPosition();
                            cf_Director.instance.reconnect_state = RECONNECT_STATE.NORMAL_CONNECT;
                        })
                        .start();
                    tween(this.plate_left)
                        .to(0.5, { worldPosition: p_left })
                        .call(() => {
                            this.p_start_left_hand = this.left_hand.getWorldPosition();
                            cf_Director.instance.reconnect_state = RECONNECT_STATE.NORMAL_CONNECT;
                        })
                        .start();
                }
            }
        }
    }
    get_fish_state_left(state_left: number) {
        if (state_left == FISH_STATE.DISAPPEAR) {
            this.fistState_left = FISH_STATE.DISAPPEAR;
        }
        if (state_left == FISH_STATE.EXIST) {
            this.fistState_left = FISH_STATE.EXIST;
        }
    }
    get_fish_state_right(state_right: number) {
        if (state_right == FISH_STATE.DISAPPEAR) {
            this.fistState_right = FISH_STATE.DISAPPEAR;
        }
        if (state_right == FISH_STATE.EXIST) {
            this.fistState_right = FISH_STATE.EXIST;
        }
    }

    set_left_hand_moving() {
        let position_origin = this.position_origin_hand_moving.getWorldPosition();
        tween(this.left_hand)
            .to(0.07, { worldPosition: new Vec3(position_origin.x + 130, position_origin.y + 170, 0) })
            .to(0.07, { worldPosition: new Vec3(this.p_start_left_hand.x, this.p_start_left_hand.y, 0) })
            .call(() => {
                if (this.fistState_left == FISH_STATE.EXIST) {
                    this.handState = HAND_STATE.LEFT_HAND;
                    this.node.emit('eat fish state true', this.handState, this.p_start_left_hand);
                }
            })
            .start();
    }
    set_right_hand_moving() {
        let position_origin = this.position_origin_hand_moving.getWorldPosition();
        tween(this.right_hand)
            .to(0.07, { worldPosition: new Vec3(position_origin.x - 130, position_origin.y + 170, 0) })
            .to(0.07, { worldPosition: new Vec3(this.p_start_right_hand.x, this.p_start_right_hand.y, 0) })
            .call(() => {
                if (this.fistState_right == FISH_STATE.EXIST) {
                    this.handState = HAND_STATE.RIGHT_HAND;
                    this.node.emit('eat fish state true', this.handState, this.p_start_right_hand);
                }
            })
            .start();
    }
    left_hand_indent() {
        let pos_origin = this.left_hand.getWorldPosition();
        tween(this.left_hand)
            .to(0.2, { worldPosition: new Vec3(pos_origin.x + 250, pos_origin.y + 290, 0) })
            .delay(3)
            .to(0.5, { worldPosition: new Vec3(pos_origin.x, pos_origin.y, 0) })
            .start();
    }
    right_hand_indent() {
        let pos_origin = this.right_hand.getWorldPosition();
        tween(this.right_hand)
            .to(0.2, { worldPosition: new Vec3(pos_origin.x - 250, pos_origin.y + 290, 0) })
            .delay(3)
            .to(0.5, { worldPosition: new Vec3(pos_origin.x, pos_origin.y, 0) })
            .start();
    }
    set_right_hand_effect_boom(effect_name: string) {
        var right_hand_effect_boom_node = this.node.getChildByPath("Plate4/Hand4/img_tayden");
        var sprite_Node = right_hand_effect_boom_node.getComponent(Sprite);
        var sprite_Frame = new SpriteFrame();
        var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD_2;
        let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
        let spriteFrame_name = effect_name;
        sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
        sprite_Node.spriteFrame = sprite_Frame;
        var uiopacity_node = right_hand_effect_boom_node.getComponent(UIOpacity);
        tween(uiopacity_node)
            .to(0.5, { opacity: 255 })
            .start();
        tween(this.node)
            .delay(2.5)
            .call(() => {
                tween(uiopacity_node)
                    .to(0.5, { opacity: 0 })
                    .call(() => {
                        sprite_Node.spriteFrame = null;
                    })
                    .start();

            })
            .start();

    }
    set_left_hand_effect_boom(effect_name: string) {
        var left_hand_effect_boom_node = this.node.getChildByPath("Plate3/Hand3/img_tayden");
        var sprite_Node = left_hand_effect_boom_node.getComponent(Sprite);
        var sprite_Frame = new SpriteFrame();
        var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD_2;
        let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
        let spriteFrame_name = effect_name;
        sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
        sprite_Node.spriteFrame = sprite_Frame;
        var uiopacity_node = left_hand_effect_boom_node.getComponent(UIOpacity);
        tween(uiopacity_node)
            .to(0.5, { opacity: 255 })
            .start();
        tween(this.node)
            .delay(2.5)
            .call(() => {
                tween(uiopacity_node)
                    .to(0.5, { opacity: 0 })
                    .call(() => {
                        sprite_Node.spriteFrame = null;
                    })
                    .start();

            })
            .start();
    }
    update(deltaTime: number) {

    }
}


