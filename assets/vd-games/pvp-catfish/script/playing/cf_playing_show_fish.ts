import { _decorator, Component, Node, SpriteFrame, Sprite, tween, Vec3, SpriteAtlas } from 'cc';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { fish_lis, random_number } from '../../../../vd-mock/mock_config';
import { cf_PlayScreen } from '../screens/cf_PlayScreen';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import { cf_Path } from '../common/cf_Define';
import { cf_playing_effect_boom } from './cf_playing_effect_boom';
const { ccclass, property } = _decorator;
enum FISH_STATE {
    NOSTATE,
    DISAPPEAR,
    EXIST,
}
enum HAND_STATE {
    NOSTATE,
    LEFT_HAND,
    RIGHT_HAND,
}
@ccclass('cf_playing_show_fish')
export class cf_playing_show_fish extends Component {
    @property(Node)
    private emit_from_playing_main: Node = null;
    public fishState: FISH_STATE = FISH_STATE.NOSTATE;
    @property(Node)
    private emit_from_opp_hand_moving: Node = null;
    @property(Node)
    private emit_from_player_hand_moving: Node = null;
    @property(Node)
    private emit_from_round_manager: Node = null;
    private fish_name: string = " ";
    @property(Node)
    boom_effect: Node = null;
    @property(cf_playing_effect_boom)
    private boom: cf_playing_effect_boom = null;
    private position_origin_fish_start: Vec3 = new Vec3(0, 0, 0);

    private _finishCallback: any = null;
    onLoad() {
        var fish_node = this.node.getChildByName('fish');
        this.position_origin_fish_start = fish_node.getWorldPosition();
        var boom_effect = this.node.getChildByPath('fish/boom_effect');
        this.boom = boom_effect.getComponent(cf_playing_effect_boom);
    }
    start() {
        this.emit_from_opp_hand_moving.on('eat fish state true', this.show_fish_nex, this);
        this.emit_from_player_hand_moving.on('eat fish state true', this.show_fish_nex, this);
    }
    get_fish_name(fish_name: string) {
        this.fish_name = fish_name;
        this.show_fish(this.fish_name);
    }
    show_fish(fish_name: string) {
        var sprite_Frame = new SpriteFrame();
        var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
        let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
        let spriteFrame_name = fish_name;
        sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
        var fish_node = this.node.getChildByName('fish');
        var sprite_fish = fish_node.getComponent(Sprite);
        sprite_fish.spriteFrame = sprite_Frame;

    }
    show_fish_nex(hand_state: number, position_origin: Vec3) {
        var fish_node = this.node.getChildByName('fish');
        var sprite_fish = fish_node.getComponent(Sprite);
        var boom_effect = this.node.getChildByPath('fish/boom_effect');
        if (hand_state == HAND_STATE.LEFT_HAND) {
            tween(fish_node)
                .to(0.1, { worldPosition: new Vec3(position_origin.x, position_origin.y, 0) })
                .call(() => {
                    sprite_fish.spriteFrame = null;
                    fish_node.setWorldPosition(this.position_origin_fish_start.x, this.position_origin_fish_start.y, 0);
                })
                .start();
        }
        if (hand_state == HAND_STATE.RIGHT_HAND) {
            tween(fish_node)
                .to(0.1, { worldPosition: new Vec3(position_origin.x, position_origin.y, 0) })
                .call(() => {
                    sprite_fish.spriteFrame = null;
                    fish_node.setWorldPosition(this.position_origin_fish_start.x, this.position_origin_fish_start.y, 0);
                })
                .start();

        }

    }
    delete_fish() {
        var fish_node = this.node.getChildByName('fish');
        var sprite_fish = fish_node.getComponent(Sprite);
        sprite_fish.spriteFrame = null;
    }
    boom_effect_start() {
        this.boom.init_effect_boom();
    }
    thiu_effect_start() {
        this.boom.init_effect_thiu();
    }
    update(deltaTime: number) {

    }
}


