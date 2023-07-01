import { Sprite } from 'cc';
import { EventTouch } from 'cc';
import { _decorator, Component, Node, SpriteAtlas } from 'cc';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { SpriteFrame } from 'cc';
import { UITransform } from 'cc';
import { cf_GAME_STATE_EVENT } from '../network/cf_NetworkDefine';
import { cf_Path } from '../common/cf_Define';
const { ccclass, property } = _decorator;
enum MOVING_STATE {
    NO_STATE,
    START,
    MOVING,
    END,
}
@ccclass('cf_homeSetting_button_moving')
export class cf_homeSetting_button_moving extends Component {
    GAME_WIDTH: number = 900;
    GAME_HIGHT: number = 1280;
    @property(Node)
    img_move: Node = null;
    private moving_state: MOVING_STATE = MOVING_STATE.NO_STATE;
    onLoad() {
        this.img_move.getComponent(Sprite).spriteFrame = null;
    }
    start() {

    }
    onEnable() {
        this._registerEvent();
    }

    onDisable() {
        this._unregisterEvent();
    }
    _unregisterEvent() {
        this.node.off(Node.EventType.TOUCH_START, this.button_moving_start.bind(this));
        this.node.off(Node.EventType.TOUCH_MOVE, this.button_move.bind(this));
        this.node.off(Node.EventType.TOUCH_END, this.button_end, this);
    }
    _registerEvent() {
        this.node.on(Node.EventType.TOUCH_START, this.button_moving_start.bind(this));
        this.node.on(Node.EventType.TOUCH_MOVE, this.button_move.bind(this));
        this.node.on(Node.EventType.TOUCH_END, this.button_end, this);
    }
    button_moving_start() {
        this.moving_state = MOVING_STATE.START;
        this.node.emit(cf_GAME_STATE_EVENT.BUTTON_MOVING_STATE, this.moving_state);
        var sprite_Frame = new SpriteFrame();
        var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
        let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
        let spriteFrame_name = 'img_move';
        sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
        this.img_move.getComponent(Sprite).spriteFrame = sprite_Frame;
    }
    button_move(event: EventTouch) {
        this.moving_state = MOVING_STATE.MOVING;
        this.node.emit(cf_GAME_STATE_EVENT.BUTTON_MOVING_STATE, this.moving_state);
        let moving_node_width = this.node.getComponent(UITransform).contentSize.width;
        let moving_node_hight = this.node.getComponent(UITransform).contentSize.height;
        let p_button_moving = this.node.getWorldPosition();
        let e = event.getUILocation();
        if (e.x >= 0 + moving_node_width + 70 && e.x <= this.GAME_WIDTH - moving_node_width + 10 &&
            e.y >= 0 + moving_node_hight - 100 && e.y <= this.GAME_HIGHT / 2 - moving_node_hight + 50) {
            this.node.setWorldPosition(e.x, e.y, 0);
        }
        let p = this.node.getWorldPosition();
        this.node.emit(cf_GAME_STATE_EVENT.MOVE_BUTTON_POSITION, p);
    }
    button_end() {
        this.moving_state = MOVING_STATE.END;
        this.node.emit(cf_GAME_STATE_EVENT.BUTTON_MOVING_STATE, this.moving_state);
        this.img_move.getComponent(Sprite).spriteFrame = null;
    }
    update(deltaTime: number) {

    }
}


