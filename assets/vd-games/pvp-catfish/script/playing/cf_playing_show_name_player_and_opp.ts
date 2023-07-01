import { _decorator, Component, Node, SpriteFrame, SpriteAtlas } from 'cc';
const { ccclass, property } = _decorator;
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { labelAssembler } from 'cc';
import { Label } from 'cc';
import { Sprite } from 'cc';
import { ConeCollider } from 'cc';
import { UITransform } from 'cc';
import { Size } from 'cc';
import { cf_Path } from '../common/cf_Define';
enum connectStatus {
    nostate,
    connect,
    disconnect,
}
@ccclass('cf_playing_show_name_player_and_opp')
export class cf_playing_show_name_player_and_opp extends Component {
    @property(Node)
    avatar: Node = null;
    @property(Label)
    avatar_name: Label = null;
    @property(Node)
    img_connect_state: Node = null;
    connect_state: connectStatus = connectStatus.nostate;
    width_name: number = 0;
    start() {

    }
    show_avatar(avatar_spriteFrame: SpriteFrame, name_show: string) {
        this.avatar.setScale(1.4, 1.4, 1.4);
        let avatar_sprite_frame = this.avatar.getComponent(Sprite);
        avatar_sprite_frame.spriteFrame = avatar_spriteFrame;
        this.avatar_name.string = name_show;
        this.width_name = this.transform_contentSize_label();
    }
    init_connect_state(connect_S: number) {
        let p = this.img_connect_state.getWorldPosition();
        this.img_connect_state.setWorldPosition(p.x - this.width_name / 2, p.y, 0);
        var sprite_Frame_onl = new SpriteFrame();
        var sprite_Frame_off = new SpriteFrame();
        var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
        let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
        sprite_Frame_onl = sprite_atlas.getSpriteFrame('img_onl');
        sprite_Frame_off = sprite_atlas.getSpriteFrame('img_off');
        if (connect_S == connectStatus.connect) {
            var img_onl_sprite = this.img_connect_state.getComponent(Sprite);
            img_onl_sprite.spriteFrame = sprite_Frame_onl;
        }
        else if (connect_S == connectStatus.disconnect) {
            var img_off_sprite = this.img_connect_state.getComponent(Sprite);
            img_off_sprite.spriteFrame = sprite_Frame_off;
        }
    }
    transform_contentSize_label(): number {
        var uitransform = this.avatar_name.node.getComponent(UITransform);
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = `${this.avatar_name.fontSize}px ${this.avatar_name.fontFamily}`;
        const contentSize = ctx.measureText(this.avatar_name.string);
        uitransform.contentSize = new Size(contentSize.width, this.avatar_name.fontSize);
        return uitransform.contentSize.width;
    }
    update(deltaTime: number) {

    }
}


