import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { cf_GAME_STATE_EVENT } from '../network/cf_NetworkDefine';
import { cf_Path } from '../common/cf_Define';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { SpriteAtlas } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('cf_playing_showBetsIcon')
export class cf_playing_showBetsIcon extends Component {
    start() {

    }
    init_show_bets_icon(bets_number: number) {
        var img_bets = this.node.getChildByPath('img_ruong_tien/img_xu_dat_cuoc/img_best');
        var sprite_imgBets = img_bets.getComponent(Sprite);
        var sprite_frame = new SpriteFrame;
        var sprite_atlas_add = cf_Path.TEXTURE_ATLAS_ADD;
        var sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_add, SpriteAtlas);
        var sprite_name = 'img_' + `${bets_number}`;
        sprite_frame = sprite_atlas.getSpriteFrame(sprite_name);
        sprite_imgBets.spriteFrame = sprite_frame;
    }
}


