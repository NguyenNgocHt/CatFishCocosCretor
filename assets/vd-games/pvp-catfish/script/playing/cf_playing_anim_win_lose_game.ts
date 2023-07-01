import { _decorator, Component, Node, Vec3, tween } from 'cc';
import { cf_GAME_STATE_EVENT } from '../network/cf_NetworkDefine';
import { VDEventListener } from '../../../../vd-framework/common/VDEventListener';
import { RenderFlow } from 'cc';
import { cf_playing_anim_meo_winLose } from './cf_playing_anim_meo_winLose';
const { ccclass, property } = _decorator;
enum win_lose_game {
    nostate,
    win,
    lose,
    anbom,
}
@ccclass('cf_playing_anim_win_lose_game')
export class cf_playing_anim_win_lose_game extends Component {
    @property(Node)
    private anim_win: Node = null;
    @property(Node)
    private anim_lose: Node = null;
    @property(Node)
    private phao_giay: Node = null;
    @property(Node)
    private position_origin: Node = null;
    @property(Node)
    private label_win: Node = null;
    @property(Node)
    private label_lose: Node = null;
    private position_origin_anim: Vec3 = new Vec3(0, 0, 0);
    private position_start_anim: Vec3 = new Vec3(0, 0, 0);
    private position_start_anbom: Vec3 = new Vec3(0, 0, 0);
    private effect_meo_win: cf_playing_anim_meo_winLose = null;
    private effect_meo_lose: cf_playing_anim_meo_winLose = null;
    private anim_win_node: Node = null;
    private anim_lose_node: Node = null;
    private
    onLoad() {
        this.position_origin_anim = this.position_origin.getWorldPosition();
        this.position_start_anim = this.anim_win.getWorldPosition();
    }
    start() {
        this.anim_lose_node = this.anim_lose.getChildByName("img_MeoKhoc");
        this.effect_meo_lose = this.anim_lose_node.getComponent(cf_playing_anim_meo_winLose);
        this.anim_win_node = this.anim_win.getChildByName("img_MeoCuoi");
        this.effect_meo_win = this.anim_win_node.getComponent(cf_playing_anim_meo_winLose);
    }
    show_win() {
        this.anim_win_node.setScale(2.5, 2.5, 2.5);
        this.effect_meo_win.init_effect_meo_win();
        tween(this.anim_win)
            .to(0.5, { worldPosition: new Vec3(this.position_origin_anim.x, this.position_origin_anim.y, 0) }, { easing: "backInOut" })
            .call(() => {
                tween(this.label_win)
                    .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
                    .to(0.2, { scale: new Vec3(1, 1, 1) })
                    .union()
                    .repeat(9)
                    .start();
            })
            .delay(2.5)
            .to(0.5, { worldPosition: new Vec3(this.position_start_anim.x, this.position_start_anim.y, 0) }, { easing: "backInOut" })
            .delay(1)
            .call(() => {
                VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.WIN_LOSE_ROUND_END);
            })
            .start();
    }
    show_lose() {
        this.anim_lose_node.setScale(2.5, 2.5, 2.5);
        this.effect_meo_lose.init_effect_meo_lose();
        tween(this.anim_lose)
            .to(0.5, { worldPosition: new Vec3(this.position_origin_anim.x, this.position_origin_anim.y, 0) }, { easing: "backInOut" })
            .call(() => {
                tween(this.label_lose)
                    .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
                    .to(0.2, { scale: new Vec3(1, 1, 1) })
                    .union()
                    .repeat(9)
                    .start();
            })
            .delay(2.5)
            .to(0.5, { worldPosition: new Vec3(this.position_start_anim.x, this.position_start_anim.y, 0) }, { easing: "backInOut" })
            .delay(1)
            .call(() => {
                VDEventListener.dispatchEvent(cf_GAME_STATE_EVENT.WIN_LOSE_ROUND_END);
            })
            .start();
    }
    update(deltaTime: number) {

    }
}