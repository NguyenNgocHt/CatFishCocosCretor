import { tween } from 'cc';
import { Sprite } from 'cc';
import { RenderFlow } from 'cc';
import { Vec3 } from 'cc';
import { _decorator, Component, Node, SpriteAtlas } from 'cc';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { SpriteFrame } from 'cc';
import { cf_Path } from '../common/cf_Define';
import { cf_playing_tap_data_model } from '../model/cf_playing_datafull_model';
const { ccclass, property } = _decorator;
enum Win_lose_state {
    NO_STATE,
    WIN,
    LOSE,
}
@ccclass('cf_playing_show_round1_win_lose')
export class cf_playing_show_round1_win_lose extends Component {
    @property(Node)
    box_chat_top: Node = null;
    @property(Node)
    box_chat_bottom: Node = null;
    @property(Node)
    pos_origin_top: Node = null;
    @property(Node)
    pos_origin_bottom: Node = null;
    _pos_origin_top: Vec3 = new Vec3(0, 0, 0);
    _pos_origin_bottom: Vec3 = new Vec3(0, 0, 0);
    _pos_start_top: Vec3 = new Vec3(0, 0, 0);
    _pos_start_bottom: Vec3 = new Vec3(0, 0, 0);
    private play_tap_data: cf_playing_tap_data_model = null;
    private sprite_Frame_win: SpriteFrame = new SpriteFrame();
    private sprite_Frame_lose: SpriteFrame = new SpriteFrame();
    onLoad() {

        this._pos_origin_top = this.pos_origin_top.getWorldPosition();
        this._pos_origin_bottom = this.pos_origin_bottom.getWorldPosition();
        this._pos_start_top = this.box_chat_top.getWorldPosition();
        this._pos_start_bottom = this.box_chat_bottom.getWorldPosition();
    }
    start() {
    }
    box_chat_moving(current_round: number) {
        if (current_round > 1) {
            tween(this.box_chat_top)
                .to(0.2, { worldPosition: this._pos_origin_top }, { easing: "backInOut" })
                .to(0.2, { scale: new Vec3(1.5, 1.5, 1.5) })
                .delay(1.5)
                .to(0.2, { scale: new Vec3(1, 1, 1) })
                .to(0.2, { worldPosition: this._pos_start_top }, { easing: "backInOut" })
                .start();
            tween(this.box_chat_bottom)
                .to(0.2, { worldPosition: this._pos_origin_bottom }, { easing: "backInOut" })
                .to(0.2, { scale: new Vec3(1.5, 1.5, 1.5) })
                .delay(1.5)
                .to(0.2, { scale: new Vec3(1, 1, 1) })
                .to(0.2, { worldPosition: this._pos_start_bottom }, { easing: "backInOut" })
                .start();
        }
        else if (current_round == 1) {
            tween(this.box_chat_top)
                .to(0.2, { worldPosition: this._pos_origin_top }, { easing: "backInOut" })
                .to(0.2, { scale: new Vec3(-1.5, 1.5, 1.5) })
                .delay(1.5)
                .to(0.2, { scale: new Vec3(-1, 1, 1) })
                .to(0.2, { worldPosition: this._pos_start_top }, { easing: "backInOut" })
                .start();
            tween(this.box_chat_bottom)
                .to(0.2, { worldPosition: this._pos_origin_bottom }, { easing: "backInOut" })
                .to(0.2, { scale: new Vec3(-1.5, 1.5, 1.5) })
                .delay(1.5)
                .to(0.2, { scale: new Vec3(-1, 1, 1) })
                .to(0.2, { worldPosition: this._pos_start_bottom }, { easing: "backInOut" })
                .start();
        }

    }
    set_img_box_top(opp_win_lose_state: number) {
        let win_lose_image_opp = this.box_chat_top.getChildByName('win_lose_images');
        let win_lose_opp_sprite = win_lose_image_opp.getComponent(Sprite);

        if (opp_win_lose_state == Win_lose_state.LOSE) {
            if (this.play_tap_data.status == 0) {
                this.set_spriteFrame_lose('img_meo_sad');
            }
            else if (this.play_tap_data.status == 4) {
                this.set_spriteFrame_lose('img_meo_boom');
            }
            else if (this.play_tap_data.status == 5) {
                this.set_spriteFrame_lose('img_meo_non');
            }
            else if (this.play_tap_data.status == 1 || this.play_tap_data.status == 2 || this.play_tap_data.status == 3) {
                this.set_spriteFrame_lose('img_meo_sad');
            }
            if (this.sprite_Frame_lose) {
                win_lose_opp_sprite.spriteFrame = this.sprite_Frame_lose;
            }
        }
        if (opp_win_lose_state == Win_lose_state.WIN) {
            this.set_spriteFrame_win('img_emoji_hehe');
            if (this.sprite_Frame_win) {
                win_lose_opp_sprite.spriteFrame = this.sprite_Frame_win;
            }
        }
    }
    set_img_box_bottom(player_win_lose_state: number) {
        let win_lose_image_player = this.box_chat_bottom.getChildByName('win_lose_images');
        let win_lose_player_sprite = win_lose_image_player.getComponent(Sprite);

        if (player_win_lose_state == Win_lose_state.LOSE) {
            if (this.play_tap_data.status == 0) {
                this.set_spriteFrame_lose('img_meo_sad');
            }
            else if (this.play_tap_data.status == 4) {
                this.set_spriteFrame_lose('img_meo_boom');
            }
            else if (this.play_tap_data.status == 5) {
                this.set_spriteFrame_lose('img_meo_non');
            }
            else if (this.play_tap_data.status == 1 || this.play_tap_data.status == 2 || this.play_tap_data.status == 3) {
                this.set_spriteFrame_lose('img_meo_sad');
            }
            if (this.sprite_Frame_lose) {
                win_lose_player_sprite.spriteFrame = this.sprite_Frame_lose;
            }
        }
        if (player_win_lose_state == Win_lose_state.WIN) {
            this.set_spriteFrame_win('img_emoji_hehe');
            if (this.sprite_Frame_win) {
                win_lose_player_sprite.spriteFrame = this.sprite_Frame_win;
            }
        }
    }
    get_playing_tap_data(tap_data: cf_playing_tap_data_model) {
        this.play_tap_data = tap_data;
    }
    set_spriteFrame_lose(sprite_Frame_name: string) {
        var sprite_atlas_dirs_2 = cf_Path.TEXTURE_ATLAS_ADD_2;
        let sprite_atlas_2 = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs_2, SpriteAtlas);
        if (sprite_atlas_2) {
            this.sprite_Frame_lose = sprite_atlas_2.getSpriteFrame(sprite_Frame_name);
        }

    }
    set_spriteFrame_win(sprite_Frame_name: string) {
        var sprite_atlas_dirs_1 = cf_Path.TEXTURE_ATLAS_ADD;
        let sprite_atlas_1 = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs_1, SpriteAtlas);
        if (sprite_atlas_1) {
            this.sprite_Frame_win = sprite_atlas_1.getSpriteFrame(sprite_Frame_name);
        }
    }
    update(deltaTime: number) {

    }
}


