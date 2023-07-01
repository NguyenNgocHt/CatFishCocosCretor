import { _decorator, Component, Node, tween, Vec3, Quat, UIOpacity, UITransform, Vec2, size } from 'cc';
const { ccclass, property } = _decorator;
enum node_state {
    nostate,
    number_1,
    number_2,
    number_3,
    start,
}
@ccclass('cf_playing_3_2_1_start')
export class cf_playing_3_2_1_start extends Component {
    @property(Node)
    private number_3: Node = null;
    @property(Node)
    private number_2: Node = null;
    @property(Node)
    private number_1: Node = null;
    @property(Node)
    private Start: Node = null
    @property(Node)
    private bl: Node = null;
    private nodeState: node_state = node_state.nostate;
    start() {
    }
    bl_starting() {
        this.number_1.active = false;
        this.number_2.active = false;
        this.number_3.active = false;
        this.Start.active = false;
        this.bl.active = true;
        tween(this.bl.getComponent(UITransform))
            .to(0.3, { contentSize: size(720, 1280) })
            .call(() => {
                this.number_2.active = false;
                this.number_1.active = false;
                this.Start.active = false;
                this.number_3.active = true;
                this.nodeState = node_state.number_3;
                this.number_scale(this.number_3);
            })
            .start();
    }
    number_scale(node_scale: Node) {
        tween(node_scale)
            .to(0.1, { scale: new Vec3(3, 3, 3) })
            .to(0.9, { scale: new Vec3(2.5, 2.5, 2.5) })
            // .to(0.1, { scale: new Vec3(0, 0, 0) })
            .start();
        tween(node_scale)
            .to(0.1, { rotation: new Quat(Math.sin(0), Math.sin(0), Math.sin(0.3), Math.cos(0)) })
            .to(0.9, { rotation: new Quat(Math.sin(0), Math.sin(0), Math.sin(-0.3), Math.cos(0)) })
            .call(() => {
                if (this.nodeState == node_state.number_3) {
                    this.set_number_2();
                }
                else if (this.nodeState == node_state.number_2) {
                    this.set_number_1();
                }
                else if (this.nodeState == node_state.number_1) {
                    this.set_start();
                }
            })
            .start();
    }
    start_moving(start_moving_end?: any) {
        let p = this.node.getWorldPosition();
        tween(this.Start)
            .to(0.1, { worldPosition: new Vec3(p.x - 50, p.y, 0) })
            .call(() => {
                tween(this.Start)
                    .to(0.5, { worldPosition: new Vec3(p.x + 50, p.y, 0) })
                    .call(() => {
                        tween(this.Start)
                            .to(0.1, { worldPosition: new Vec3(p.x + 700, p.y, 0) })
                            .call(() => {
                                tween(this.bl.getComponent(UITransform))
                                    .to(0.1, { contentSize: size(720, 0) })
                                    .call(() => {
                                        this.bl.active = false;
                                        this.node.emit('updtata show fish');
                                    })
                                    .start();
                            })
                            .start();
                    })
                    .start();

            })
            .start();
        tween(this.Start.getComponent(UIOpacity))
            .to(0.1, { opacity: 255 })
            .delay(1)
            .call(() => {
                tween(this.Start.getComponent(UIOpacity))
                    .to(0.1, { opacity: 0 })
                    .start();
            })
            .start();

    }
    set_number_2() {
        this.number_3.active = false;
        this.number_1.active = false;
        this.Start.active = false;
        this.number_2.active = true;
        this.nodeState = node_state.number_2;
        this.number_scale(this.number_2)
    }
    set_number_1() {
        this.number_2.active = false;
        this.number_3.active = false;
        this.Start.active = false;
        this.number_1.active = true;
        this.nodeState = node_state.number_1;
        this.number_scale(this.number_1)
    }
    set_start() {
        this.number_1.active = false;
        this.Start.active = true;
        this.nodeState = node_state.start;
        this.start_moving();
    }
    update(deltaTime: number) {

    }
}


