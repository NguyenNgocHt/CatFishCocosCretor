import { _decorator, Component, Node, tween, Vec3, SpriteFrame, SpriteAtlas, UIOpacity } from 'cc';
import { fish_lis } from '../../../../vd-mock/mock_config';
import { Sprite } from 'cc';
import { cf_Director } from '../core/cf_Director';
import { cf_GAME_STATE_EVENT } from '../network/cf_NetworkDefine';
import { VDEventListener } from '../../../../vd-framework/common/VDEventListener';
import { RECONNECT_STATE } from '../common/cf_Define';
import { cf_Path } from '../common/cf_Define';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
const { ccclass, property } = _decorator;
enum HANDSTATE {
    NOSTATE,
    LEFT_HAND,
    RIGHT_HAND,
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
@ccclass('cf_playing_hand_moving_starting')
export class cf_playing_hand_moving_starting extends Component {
    @property(Node)
    private left_hand_button: Node = null;
    @property(Node)
    private right_hand_button: Node = null;
    @property(Node)
    private left_hand: Node = null;
    @property(Node)
    private right_hand: Node = null;
    private hand_state: HANDSTATE = HANDSTATE.NOSTATE;
    @property(Node)
    private position_origin_hand_moving: Node = null;
    @property(Node)
    private emit_from_playing_show_fish: Node = null;
    @property(Node)
    private emit_from_playing: Node = null;
    @property(Node)
    private position_origin_left: Node = null;
    @property(Node)
    private position_origin_right: Node = null;
    @property(Node)
    private plate_left: Node = null;
    @property(Node)
    private plate_right: Node = null;
    private p_start_left_hand: Vec3 = new Vec3(0, 0, 0);
    private p_start_right_hand: Vec3 = new Vec3(0, 0, 0);
    private pos_origin_left_hand: Vec3 = new Vec3(0, 0, 0);
    private pos_origin_right_hand: Vec3 = new Vec3(0, 0, 0);
    private fistState_left: FISH_STATE = FISH_STATE.NOSTATE;
    private fistState_right: FISH_STATE = FISH_STATE.NOSTATE;
    private reconnect_state: reconectState = reconectState.nostate;
    private round_level: number = 0;
    private name_parent_left: string = " ";
    private name_parent_right: string = " ";
    private count_round: number = 0;
    private left_Plate_posStart: Vec3 = new Vec3(0, 0, 0);
    private right_Plate_posStart: Vec3 = new Vec3(0, 0, 0);
    private tap_state: boolean = false;
    onLoad() {
        this.left_Plate_posStart = this.plate_left.getWorldPosition();
        this.right_Plate_posStart = this.plate_right.getWorldPosition();
    }
    start() {
        this.left_hand_button.on(Node.EventType.TOUCH_START, this.set_catch_fish_left_hand, this);
        this.right_hand_button.on(Node.EventType.TOUCH_START, this.set_catch_fish_right_hand, this);
    }
    set_update_lever(round_level: number) {
        if (cf_Director.instance.reconnect_state == RECONNECT_STATE.NORMAL_CONNECT) {
            this.round_level = round_level;
            if (this.round_level == 1) {
                this.left_hand_button.active = false;
                this.right_hand_button.active = true;
                let p = this.position_origin_right.getWorldPosition();
                tween(this.plate_right)
                    .to(0.5, { worldPosition: new Vec3(p.x, p.y, 0) })
                    .call(() => {
                        this.p_start_right_hand = this.right_hand.getWorldPosition();
                    })
                    .start();
            }
            else if (this.round_level == 2) {
                this.left_hand_button.active = true;
                this.right_hand_button.active = false;
                let p = this.position_origin_left.getWorldPosition();
                tween(this.plate_right)
                    .to(0.5, { worldPosition: new Vec3(this.right_Plate_posStart.x, this.right_Plate_posStart.y, 0) })
                    .start();
                tween(this.plate_left)
                    .to(0.5, { worldPosition: new Vec3(p.x, p.y, 0) })
                    .call(() => {
                        this.p_start_left_hand = this.left_hand.getWorldPosition();
                    })
                    .start();
            }

            else if (this.round_level == 3) {
                this.left_hand_button.active = true;
                this.right_hand_button.active = true;
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
            this.round_level = round_level;
            if (this.round_level == 1) {

                this.left_hand_button.active = false;
                this.right_hand_button.active = true;
                let p = this.position_origin_right.getWorldPosition();
                tween(this.plate_right)
                    .to(0.5, { worldPosition: new Vec3(p.x, p.y, 0) })
                    .call(() => {
                        this.p_start_right_hand = this.right_hand.getWorldPosition();
                    })
                    .start();
            }
            else if (this.round_level == 2) {

                if (cf_Director.instance.OP_reconnectDataModel.status) {
                    this.left_hand_button.active = true;
                    this.right_hand_button.active = false;
                    let p = this.position_origin_left.getWorldPosition();
                    tween(this.plate_left)
                        .to(0.5, { worldPosition: new Vec3(p.x, p.y, 0) })
                        .call(() => {
                            this.p_start_left_hand = this.left_hand.getWorldPosition();
                        })
                        .start();
                } else {
                    this.left_hand_button.active = true;
                    this.right_hand_button.active = false;
                    let p = this.position_origin_left.getWorldPosition();
                    tween(this.plate_right)
                        .to(0.5, { worldPosition: new Vec3(this.right_Plate_posStart.x, this.right_Plate_posStart.y, 0) })
                        .start();
                    tween(this.plate_left)
                        .to(0.5, { worldPosition: new Vec3(p.x, p.y, 0) })
                        .call(() => {
                            this.p_start_left_hand = this.left_hand.getWorldPosition();
                        })
                        .start();
                }

            }
            else if (this.round_level >= 3) {

                this.count_round = this.count_round + 1;
                if (this.count_round == 1) {
                    this.left_hand_button.active = true;
                    this.right_hand_button.active = true;
                    let p_left = this.position_origin_left.getWorldPosition();
                    let p_right = this.position_origin_right.getWorldPosition();
                    tween(this.plate_right)
                        .to(0.5, { worldPosition: p_right })
                        .call(() => {
                            this.p_start_right_hand = this.right_hand.getWorldPosition();
                        })
                        .start();
                    tween(this.plate_left)
                        .to(0.5, { worldPosition: p_left })
                        .call(() => {
                            this.p_start_left_hand = this.left_hand.getWorldPosition();
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
    set_catch_fish_left_hand() {
        this.hand_state = HANDSTATE.LEFT_HAND;
        let parent_node = this.left_hand.getParent();
        this.name_parent_left = parent_node.name;
        let sprite_parent = parent_node.getComponent(Sprite);
        let sprite_frame_parent_name = sprite_parent.spriteFrame.name;
        this.node.emit('hand start moving', this.hand_state, sprite_frame_parent_name, parent_node);
    }
    left_hand_moving() {
        let position_origin = this.position_origin_hand_moving.getWorldPosition();
        tween(this.left_hand)
            .to(0.07, { worldPosition: new Vec3(position_origin.x - 130, position_origin.y - 170, 0) })
            .to(0.07, { worldPosition: new Vec3(this.p_start_left_hand.x, this.p_start_left_hand.y, 0) })
            .call(() => {
                if (this.fistState_left == FISH_STATE.EXIST) {
                    this.hand_state = HANDSTATE.LEFT_HAND;
                    this.node.emit('eat fish state true', this.hand_state, this.p_start_left_hand);
                }
            })
            .start();
    }
    set_catch_fish_right_hand() {

        this.hand_state = HANDSTATE.RIGHT_HAND;
        let parent_node = this.right_hand.getParent();
        this.name_parent_right = parent_node.name;
        let sprite_parent = parent_node.getComponent(Sprite);
        let sprite_frame_parent_name = sprite_parent.spriteFrame.name;
        this.node.emit('hand start moving', this.hand_state, sprite_frame_parent_name, parent_node);

    }
    right_hand_moving() {
        let position_origin = this.position_origin_hand_moving.getWorldPosition();
        tween(this.right_hand)
            .to(0.07, { worldPosition: new Vec3(position_origin.x + 130, position_origin.y - 170, 0) })
            .to(0.07, { worldPosition: new Vec3(this.p_start_right_hand.x, this.p_start_right_hand.y, 0) })
            .call(() => {
                if (this.fistState_right == FISH_STATE.EXIST) {
                    this.hand_state = HANDSTATE.RIGHT_HAND;
                    this.node.emit('eat fish state true', this.hand_state, this.p_start_right_hand);
                }
            })
            .start();
    }
    left_hand_indent() {
        let pos_origin = this.left_hand.getWorldPosition();
        tween(this.left_hand)
            .to(0.2, { worldPosition: new Vec3(pos_origin.x - 250, pos_origin.y - 290, 0) })
            .delay(3)
            .to(0.5, { worldPosition: new Vec3(pos_origin.x, pos_origin.y, 0) })
            .start();
    }
    right_hand_indent() {
        let pos_origin = this.right_hand.getWorldPosition();
        tween(this.right_hand)
            .to(0.2, { worldPosition: new Vec3(pos_origin.x + 250, pos_origin.y - 290, 0) })
            .delay(3)
            .to(0.5, { worldPosition: new Vec3(pos_origin.x, pos_origin.y, 0) })
            .start();
    }
    set_right_hand_effect_boom(effect_name: string) {
        var right_hand_effect_boom_node = this.node.getChildByPath("Plate2/Hand2/black_hand_2");
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
        var left_hand_effect_boom_node = this.node.getChildByPath("Plate1/Hand1/black_hand_1");
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


