import { tween } from 'cc';
import { _decorator, Component, Node, SpriteAtlas } from 'cc';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';
import { cf_Path } from '../common/cf_Define';
import { Vec3 } from 'cc';
import { UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('cf_playing_effect_boom')
export class cf_playing_effect_boom extends Component {
    private pos_effect_start: Vec3 = new Vec3(0, 0, 0);
    onLoad() {
        this.pos_effect_start = this.node.getWorldPosition();
    }
    start() {
    }
    init_effect_boom() {
        this.node.setWorldPosition(this.pos_effect_start.x, this.pos_effect_start.y, 0);
        let index = 1;
        tween(this.node)
            .delay(0.07)
            .call(() => {
                this.node.setScale(2, 2, 2);
                var boom_sprite = this.node.getComponent(Sprite);
                var sprite_Frame = new SpriteFrame();
                var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD_2;
                let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
                let spriteFrame_name = "img_fire" + `${index}`;
                sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
                boom_sprite.spriteFrame = sprite_Frame;
                index = index + 1;
                if (index == 7) {
                    index = 1;
                    boom_sprite.spriteFrame = null;
                }
            })
            .union()
            .repeat(6)
            .start();
    }
    init_effect_thiu() {
        this.node.setWorldPosition(this.pos_effect_start.x, this.pos_effect_start.y + 100, 0);
        let index = 1;
        tween(this.node)
            .delay(0.15)
            .call(() => {
                this.node.setScale(2, 3, 2);
                var boom_sprite = this.node.getComponent(Sprite);
                var sprite_Frame = new SpriteFrame();
                var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD_2;
                let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
                let spriteFrame_name = "img_smoke" + `${index}`;
                sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
                boom_sprite.spriteFrame = sprite_Frame;
                index = index + 1;
                if (index == 13) {
                    boom_sprite.spriteFrame = null;
                    index = 1;
                }
            })
            .union()
            .repeat(12)
            .start();
    }
    update(deltaTime: number) {
    }
}


