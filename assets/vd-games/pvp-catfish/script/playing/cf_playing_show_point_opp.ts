import { _decorator, Component, Node, Label, ProgressBar, tween, Sprite, SpriteFrame, SpriteAtlas } from 'cc';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { labelAssembler } from 'cc';
import { Vec3 } from 'cc';
import { Color } from 'cc';
import { color } from 'cc';
import { cf_Path } from '../common/cf_Define';
const { ccclass, property } = _decorator;
enum crown_state {
    nostate,
    vuongmien_1,
    vuongmien_2,
    vuongmien_3,
}
enum roundState {
    nostate,
    round_laying,
    round_end,
}
enum vuongmien_state {
    nostate,
    on,
    off,
}
enum countdown_state {
    NO_STATE,
    UP,
    DOWN,
}
@ccclass('cf_playing_show_point_opp')
export class cf_playing_show_point_opp extends Component {
    @property(Label)
    private show_point: Label = null;
    @property(ProgressBar)
    private thanhdiem_full: ProgressBar = null;
    @property(Node)
    private vuongmien_1: Node = null;
    @property(Node)
    private vuongmien_2: Node = null;
    @property(Node)
    private vuongmien_3: Node = null;
    @property(Label)
    private point_update: Label = null;
    private crownState: crown_state = crown_state.nostate;
    private round_state: roundState = roundState.nostate;
    private vuongmien_1_State: vuongmien_state = vuongmien_state.nostate;
    private vuongmien_2_State: vuongmien_state = vuongmien_state.nostate;
    private vuongmien_3_State: vuongmien_state = vuongmien_state.nostate;
    private point_game_ex: number = 15;
    private sum_point_in_round: number = 0;
    private sum_point_all_game: number = 0;
    private point_rank: number = 0;
    private count_set_Crown: number = 0;
    private red_color: Color = new Color(255, 0, 0, 255);
    private yellow_color: Color = new Color(255, 255, 0, 255);
    private countdown_State: countdown_state = countdown_state.NO_STATE;
    private point_sumIn_round_player: number = 0;
    private point_sumIn_round_opp: number = 0;
    start() {
    }
    show_point_start(point_update: number, point_round: number) {
        if (point_update > 0 || point_update < 0) {
            this.show_point_update_to_screen(point_update);
        }
        this.sum_point_in_round = point_round;
        this.sum_point_all_game = this.sum_point_all_game + point_update;
        this.show_point.string = `${this.sum_point_in_round}`;
        if (this.sum_point_all_game >= this.point_rank && this.sum_point_all_game >= 0) {
            tween(this.thanhdiem_full)
                .to(1, { progress: this.sum_point_all_game / this.point_game_ex })
                .start();
        }
        else if (this.sum_point_all_game < this.point_rank && this.sum_point_all_game >= 0) {
            tween(this.thanhdiem_full)
                .to(1, { progress: this.point_rank / this.point_game_ex })
                .start();
        }
    }
    show_point_update_to_screen(show_point_update: number) {
        this.point_update.node.active = true;
        if (show_point_update < 0) {
            this.point_update.string = `${show_point_update}`;
        }
        else if (show_point_update > 0) {
            this.point_update.string = "+" + `${show_point_update}`;
        }
        tween(this.point_update.node)
            .to(0.2, { scale: new Vec3(3, 3, 3) })
            .to(0.5, { scale: new Vec3(0, 0, 0) })
            .call(() => {
                this.point_update.node.active = false;
            })
            .start();
    }
    reconnect_setPoint(point_rank_reconnec: number, point_current: number) {
        if (point_rank_reconnec == 0) {
            this.sum_point_in_round = point_current;
            this.show_point.string = `${point_current}`;
            this.sum_point_all_game = this.sum_point_in_round;
            tween(this.thanhdiem_full)
                .to(0.5, { progress: this.sum_point_in_round / this.point_game_ex })
                .start();
        }
        if (point_rank_reconnec >= 5) {
            this.count_set_Crown = 0;
            let vuong_mien_index = point_rank_reconnec / 5;
            this.point_rank = point_rank_reconnec;
            tween(this.thanhdiem_full)
                .delay(0.1)
                .call(() => {
                    this.count_set_Crown = this.count_set_Crown + 1;
                    this.init_sprite_frame_crown(this.count_set_Crown);
                })
                .union()
                .repeat(vuong_mien_index)
                .start();
            this.sum_point_all_game = point_rank_reconnec + point_current;
            this.show_point_start(0, point_current);
        }
    }
    show_crown_glow() {
        if (this.crownState == crown_state.vuongmien_1) {
            this.init_sprite_frame_crown(this.crownState);
        }
        if (this.crownState == crown_state.vuongmien_2) {
            this.init_sprite_frame_crown(this.crownState);
        }
        if (this.crownState == crown_state.vuongmien_3) {
            this.init_sprite_frame_crown(this.crownState);
        }
    }
    init_sprite_frame_crown(crown_index: number) {
        var crown_name = 'img_IconVuongMienTrang_' + `${crown_index}`;
        var vuongmientrang_node = this.node.getChildByName(crown_name);
        var crown_sprite = vuongmientrang_node.getComponent(Sprite);
        crown_sprite.spriteFrame = null;
        var sprite_Frame = new SpriteFrame();
        var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
        let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
        let spriteFrame_name = 'vuongmienmau';
        sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
        crown_sprite.spriteFrame = sprite_Frame;
    }
    check_point_rank(roundstate: number, point_sum_in_round_self: number, point_sum_in_round_opp: number, point_add: number) {
        this.point_sumIn_round_player = point_sum_in_round_self;
        this.point_sumIn_round_opp = point_sum_in_round_opp;
        if (roundstate == roundState.round_end) {
            this.round_state = roundState.round_end;
            this.check_point_end_round(point_sum_in_round_self, point_sum_in_round_opp, point_add);
        }
    }
    check_point_end_round(point_sum_in_round_self: number, point_sum_in_round_opp, point_add: number) {
        if (point_sum_in_round_self >= 5 || point_sum_in_round_opp <= -5) {
            this.count_set_Crown = this.count_set_Crown + 1;
            if (this.count_set_Crown == 1) {
                this.point_rank = this.point_rank + 5;
                this.sum_point_all_game = this.point_rank;
                this.crownState = crown_state.vuongmien_1;
                this.show_crown_glow();
                this.show_point_start(0, point_sum_in_round_self);
                this.scheduleOnce(function () {
                    this.sum_point_in_round = 0;
                    this.show_point.string = `${this.sum_point_in_round}`;
                    this.round_state = roundState.nostate;
                }, 6);
            }
            if (this.count_set_Crown == 2) {
                this.point_rank = this.point_rank + 5;
                this.sum_point_all_game = this.point_rank;
                this.crownState = crown_state.vuongmien_2;
                this.show_crown_glow();
                this.show_point_start(0, point_sum_in_round_self);
                this.scheduleOnce(function () {
                    this.sum_point_in_round = 0;
                    this.show_point.string = `${this.sum_point_in_round}`;
                    this.round_state = roundState.nostate;
                }, 6);
            }
            if (this.count_set_Crown == 3) {
                this.point_rank = this.point_rank + 5;
                this.sum_point_all_game = this.point_rank;
                this.crownState = crown_state.vuongmien_3;
                this.show_crown_glow();
                this.show_point_start(0, point_sum_in_round_self);
                this.scheduleOnce(function () {
                    this.sum_point_in_round = 0;
                    this.show_point.string = `${this.sum_point_in_round}`;
                    this.round_state = roundState.nostate;
                }, 6);
            }
        }
        if (point_sum_in_round_self < 5 || point_sum_in_round_opp > -5) {
            this.sum_point_all_game = this.point_rank;
            this.show_point_start(0, point_sum_in_round_self);
            this.scheduleOnce(function () {
                this.sum_point_in_round = 0;
                this.show_point.string = `${this.sum_point_in_round}`;
                this.round_state = roundState.nostate;
            }, 6);
            tween(this.thanhdiem_full)
                .to(1, { progress: this.point_rank / this.point_game_ex })
                .start();
        }
    }
    point_countDown(point_countdowm: number) {
        let pointNumber_start = Math.abs(point_countdowm)
        if (point_countdowm >= 0) {
            tween(point_countdowm)
                .by(0.1, point_countdowm - 1)
                .call(() => {
                    this.show_point_game(point_countdowm);
                })
                .delay(0.1)
                .union()
                .repeat(pointNumber_start)
                .start();
        }
        if (point_countdowm <= 0) {
            tween(point_countdowm)
                .by(0.1, point_countdowm + 1)
                .call(() => {
                    this.show_point_game(point_countdowm);
                })
                .delay(0.1)
                .union()
                .repeat(pointNumber_start)
                .start();
        }
    }
    show_point_game(point_game: number) {
        this.show_point.string = `${point_game}`;
    }
    init_bg_showPoint(bg_game: string) {
        var img_bg_node = this.node.getChildByName('img_bg');
        var sprite_bg = img_bg_node.getComponent(Sprite);
        var sprite_Frame_bg_point = new SpriteFrame();
        var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
        let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
        let spriteFrame_bg_name = bg_game;
        sprite_Frame_bg_point = sprite_atlas.getSpriteFrame(spriteFrame_bg_name);
        sprite_bg.spriteFrame = sprite_Frame_bg_point;
    }
    update(deltaTime: number) {
    }
}


