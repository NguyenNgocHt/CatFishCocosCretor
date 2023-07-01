import { _decorator, Component, Node, SpriteFrame, Sprite, tween, Vec2, Vec3, SpriteAtlas } from 'cc';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { fish_lis } from '../../../../vd-mock/mock_config';
import { cf_Path } from '../common/cf_Define';
VDScreenManager
const { ccclass, property } = _decorator;

@ccclass('cf_playing_show_round')
export class cf_playing_show_round extends Component {
    @property(Node)
    private position_origin: Node = null;
    @property(Node)
    private level_up: Node = null;
    @property(Node)
    private round1: Node = null;
    @property(Node)
    private round2: Node = null;
    private p_origin: Vec3 = new Vec3(0, 0, 0);
    private p_round1: Vec3 = new Vec3(0, 0, 0);
    private p_round2: Vec3 = new Vec3(0, 0, 0);
    onLoad() {
        this.level_up.active = false;
        this.p_origin = this.position_origin.getWorldPosition();
        this.p_round1 = this.round1.getWorldPosition();
        this.p_round2 = this.round2.getWorldPosition();
    }
    start() {
    }
    show_round(round_index: number) {
        if (round_index >= 1 && round_index != 3) {
            this.set_round_spriteFrame(round_index);
            if (round_index == 1) {
                tween(this.round1)
                    .to(0.2, { worldPosition: this.p_origin })
                    .start();
                tween(this.round2)
                    .to(0.2, { worldPosition: this.p_origin })
                    .start();
            }
            else if (round_index != 1) {
                tween(this.round1)
                    .to(0.2, { worldPosition: this.p_round1 })
                    .delay(1)
                    .call(() => {
                        tween(this.round1)
                            .to(0.2, { worldPosition: this.p_origin })
                            .start();
                    })
                    .start();
                tween(this.round2)
                    .to(0.2, { worldPosition: this.p_round2 })
                    .delay(1)
                    .call(() => {
                        tween(this.round2)
                            .to(0.2, { worldPosition: this.p_origin })
                            .start();
                    })
                    .start();
            }
        }
        if (round_index == 3) {
            tween(this.round1)
                .to(0.2, { worldPosition: this.p_round1 })
                .start();
            tween(this.round2)
                .to(0.2, { worldPosition: this.p_round2 })
                .start();
            this.level_up.active = true;
            tween(this.level_up)
                .to(0.5, { scale: new Vec3(2, 2, 2) })
                .to(1, { scale: new Vec3(0, 0, 0) })
                .call(() => {
                    this.level_up.active = false;
                    this.set_round_spriteFrame(round_index);
                    tween(this.round1)
                        .to(0.2, { worldPosition: this.p_origin })
                        .start();
                    tween(this.round2)
                        .to(0.2, { worldPosition: this.p_origin })
                        .start();
                })
                .start();
        }
    }
    set_round_spriteFrame(round_index: number) {
        var sprite_Frame = new SpriteFrame();
        var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
        let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
        let spriteFrame_name = 'round_' + `${round_index}`;
        sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
        var round_sprite1 = this.round1.getComponent(Sprite)
        round_sprite1.spriteFrame = sprite_Frame;
        var round_sprite2 = this.round2.getComponent(Sprite)
        round_sprite2.spriteFrame = sprite_Frame;
    }
    update(deltaTime: number) {
    }
}


