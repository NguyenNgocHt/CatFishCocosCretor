import { tween } from 'cc';
import { _decorator, Component, Node, SpriteAtlas } from 'cc';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';
import { cf_Path } from '../common/cf_Define';
import { Vec3 } from 'cc';
import { UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('cf_playing_anim_meo_winLose')
export class cf_playing_anim_meo_winLose extends Component {
    private pos_effect_start: Vec3 = new Vec3(0, 0, 0);
    start() {
        this.pos_effect_start = this.node.getWorldPosition();
    }
    init_effect_meo_lose() {
        this.node.setWorldPosition(this.pos_effect_start.x, this.pos_effect_start.y, 0);
        let index = 0;
        tween(this.node)
            .delay(0.035)
            .call(() => {
                var meoLose_sprite = this.node.getComponent(Sprite);
                var sprite_Frame = new SpriteFrame();
                var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD_4;
                let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
                let spriteFrame_name = "meow-lose_" + `${index}`;
                sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
                meoLose_sprite.spriteFrame = sprite_Frame;
                index = index + 1;
                if (index == 41) {
                    index = 0;
                }
            })
            .union()
            .repeat(246)
            .start();
    }
    init_effect_meo_win() {
        this.node.setWorldPosition(this.pos_effect_start.x, this.pos_effect_start.y, 0);
        let index = 0;
        tween(this.node)
            .delay(0.035)
            .call(() => {
                var meoWin_sprite = this.node.getComponent(Sprite);
                var sprite_Frame = new SpriteFrame();
                var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD_3;
                let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
                let spriteFrame_name = "meow-win_" + `${index}`;
                sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
                meoWin_sprite.spriteFrame = sprite_Frame;
                index = index + 1;
                if (index == 48) {
                    index = 0;
                }
            })
            .union()
            .repeat(288)
            .start();
    }
    update(deltaTime: number) {

    }
}


