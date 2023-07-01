import { tween } from 'cc';
import { CapsuleCollider } from 'cc';
import { UIOpacity } from 'cc';
import { Vec3 } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { VDEventListener } from '../../../../vd-framework/common/VDEventListener';
import { cf_NETWORK_STATE_EVENT } from '../network/cf_NetworkDefine';
import { cf_GAME_STATE_EVENT } from '../network/cf_NetworkDefine';
const { ccclass, property } = _decorator;

@ccclass('cf_playing_setting_group')
export class cf_playing_setting_group extends Component {
    @property(Node)
    button_setting: Node = null;
    private button_setting_opacity_number: number = 0;
    protected onLoad() {
        this.button_setting_opacity_number = this.button_setting.getOpacity();
    }
    start() {
        this.button_setting.on(Node.EventType.TOUCH_START, this.button_setting_open_start, this);
    }
    button_setting_open_start() {
        var opacity_button_setting = this.button_setting.getComponent(UIOpacity);
        tween(opacity_button_setting)
            .to(1, { opacity: 255 })
            .call(() => {
                this.node.emit(cf_GAME_STATE_EVENT.UIOPACITY_START_END);
            })
            .delay(4)
            .to(0.5, { opacity: this.button_setting_opacity_number })
            .start();
    }
    update(deltaTime: number) {
    }
}


