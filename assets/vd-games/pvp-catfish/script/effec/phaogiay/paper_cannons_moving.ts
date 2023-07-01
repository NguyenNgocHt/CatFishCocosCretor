import { _decorator, Component, Node, Prefab, Vec3, instantiate, ParticleSystem, ParticleSystem2D, color, Sprite, AssetManager, SpriteFrame } from 'cc';
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
const { ccclass, property } = _decorator;
enum BlockType {
    BT_NONE,
    BT_STONE,
};
@ccclass('paper_cannons_moving')
export class paper_cannons_moving extends Component {
    @property(Node)
    private emitform_gate_manager: Node = null;
    @property(Prefab)
    private phaohoa_prefab: Prefab = null;
    BUFFTER_FLY_ARR: number[];
    MOVING_POSITION_LIST: Vec3[];
    arrayNodeLenth: number = 27;
    random_position_X: number = 0;
    random_position_Y: number = 0;
    private random_scale: number = 0;
    private random_red: number = 0;
    private random_green: number = 0;
    private random_blue: number = 0;
    onLoad() {
    }
    start() {
        this.init_prefab();
    }
    init_prefab() {
        let p = this.node.getWorldPosition();
        this.node.removeAllChildren();
        if (!this.BUFFTER_FLY_ARR) {
            this.BUFFTER_FLY_ARR = [];
        }
        this.BUFFTER_FLY_ARR.push(BlockType.BT_NONE);
        for (let i = 0; i < this.arrayNodeLenth; i++) {
            this.BUFFTER_FLY_ARR.push(BlockType.BT_STONE);
        }
        for (let j = 0; j < this.BUFFTER_FLY_ARR.length; j++) {
            let block: Node = this.spawnBlockByType(this.BUFFTER_FLY_ARR[j]);
            if (block) {
                this.node.addChild(block);
                block.setWorldPosition(p.x, p.y, 0);
                block.setScale(1, 1, 1);
                let confetti = block.getChildByName('confetti');
                let particle_for_confetti = confetti.getComponent(ParticleSystem2D);
                if (this.node.name == 'phao_hoa_1') {
                    particle_for_confetti.angle = 90;
                }
                if (this.node.name == 'phao_hoa_2') {
                    particle_for_confetti.angle = 135;
                }
                let images_sounce = 'res/images/phaogiay/images_pg/';
                let sprite_frame_add = images_sounce.concat(`${j}`) + '/spriteFrame';
                let sprite_Frame_phaogiay = VDScreenManager.instance.assetBundle.get(sprite_frame_add, SpriteFrame)
                particle_for_confetti.spriteFrame = sprite_Frame_phaogiay;
                particle_for_confetti.setEntityOpacity(255);
            }
        }
    }
    emit_setMusroom_state(index_image: number, sprite_frame_phao_giay: SpriteFrame) {
    }
    // set_state_change_node(index_for_node: number) {
    //     let childs = this.node.children;
    //     for (let i = 0; i < childs.length; i++) {
    //         if (i == index_for_node) {
    //             this.random_red = Math.floor(Math.random() * 255) + 1;
    //             this.random_green = Math.floor(Math.random() * 255) + 1;
    //             this.random_blue = Math.floor(Math.random() * 255) + 1;
    //             let confetti_4 = childs[i].getChildByName('confetti_4');
    //             let confetti_3 = childs[i].getChildByName('confetti_3');
    //             let confetti_2 = childs[i].getChildByName('confetti_2');
    //             let confetti = childs[i].getChildByName('confetti');
    //             let sprite_phao_hoa = childs[i].getChildByName('sprite_phao');
    //             sprite_phao_hoa.active = false;
    //             confetti.active = true;
    //             confetti_2.active = true;
    //             confetti_3.active = true;
    //             confetti_4.active = true;
    //             let start_color = confetti.getComponent(ParticleSystem2D);
    //             let start_color_2 = confetti_2.getComponent(ParticleSystem2D);
    //             let start_color_3 = confetti_2.getComponent(ParticleSystem2D);
    //             let start_color_4 = confetti_2.getComponent(ParticleSystem2D);
    //             start_color.startColor = color(this.random_red, this.random_green, this.random_blue, 255);
    //             start_color.endColor = color(this.random_red + 1, this.random_green + 1, this.random_blue + 1, 255);
    //             start_color_2.startColor = color(this.random_red, this.random_green, this.random_blue, 255);
    //             start_color_2.endColor = color(this.random_red + 1, this.random_green + 1, this.random_blue + 1, 255);
    //             start_color_3.startColor = color(this.random_red, this.random_green, this.random_blue, 255);
    //             start_color_3.endColor = color(this.random_red + 1, this.random_green + 1, this.random_blue + 1, 255);
    //             start_color_4.startColor = color(this.random_red, this.random_green, this.random_blue, 255);
    //             start_color_4.endColor = color(this.random_red + 1, this.random_green + 1, this.random_blue + 1, 255);
    //             this.fireworks_bang.play();
    //         }
    //     }
    // }
    // emit_to_node_fly_up() {
    //     this.node.emit('fireWorks moving');
    // }
    spawnBlockByType(type: BlockType) {
        if (!this.phaohoa_prefab) {
            return null;
        }
        let block: Node | null = null;
        switch (type) {
            case BlockType.BT_STONE:
                {
                    block = instantiate(this.phaohoa_prefab);
                    break;
                }
        }
        return block;
    }
    update(deltaTime: number) {
    }
}


