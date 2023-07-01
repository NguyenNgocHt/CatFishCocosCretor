import { _decorator, Component, Node, Prefab } from 'cc';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { cf_Director, GAME_STATE_FE } from '../core/cf_Director';
import { cf_Path, END_GAME_STATE, END_STAGE_STATE, RECONNECT_STATE } from '../common/cf_Define';
import { cf_HomeScreen } from './cf_HomeScreen';
import { cf_SearchScreen } from './cf_SearchScreen';
import { cf_playing_audioPlay } from '../playing/cf_playing_audioPlay';
import { Label, tween, Vec3, Tween, Sprite, SpriteFrame, SpriteAtlas } from 'cc';
import { cf_playing_show_name_player_and_opp } from '../playing/cf_playing_show_name_player_and_opp';
const { ccclass, property } = _decorator;
enum searching_comeBack_state {
    nostate,
    normalSearching,
    searching_comeBack,
}
@ccclass('cf_ResultScreen')
export class cf_ResultScreen extends VDBaseScreen {
    @property(Node)
    private win_group: Node = null;
    @property(Node)
    private lose_group: Node = null;
    @property(Node)
    private button_group: Node = null;
    private play_audio: cf_playing_audioPlay = null;
    private result_game: boolean = false;
    private bonus: number = 0;
    private tweenStart_Stop!: Tween<Node>;
    private tweenStart_Stop_anim!: Tween<Node>;
    private anim_win_node: Node = null;
    private anim_lose_node: Node = null;

    onLoad() {
        this.play_audio = this.node.getComponent(cf_playing_audioPlay);
        this.result_game = cf_Director.instance.result_game_state;
        this.bonus = cf_Director.instance.bonus;
    }
    start() {
        this.anim_lose_node = this.lose_group.getChildByPath('img_greysky/img_board/img_bangnho/meo');
        this.anim_win_node = this.win_group.getChildByPath('img_light/img_nen1/img_bangnho/img_winner');
        this.show_win_lose_game();
    }
    onEnable() {
        this.scheduleOnce(function () {
            this.tweenStart_Stop.start();
            this.tweenStart_Stop_anim.start();
        }, 0.1);
    }
    show_win_lose_game() {
        if (this.result_game == false) {
            this.play_audio.effect_lose_game();
            this.show_lose_group();
            this.show_bonus_lose();
        }
        if (this.result_game == true) {
            this.play_audio.effect_win_game();
            this.show_win_group();
            this.show_bonus_win();
        }
    }
    show_win_group() {
        this.lose_group.active = false;
        this.win_group.active = true;
        this.init_effect_meo_win();
        var label_win_node = this.win_group.getChildByPath('img_light/img_nen1/img_bangnho/img_LabelWin');
        let scaleLabel = tween(label_win_node)
            .to(0.3, { scale: new Vec3(1.3, 1.3, 1.3) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .union()
            .repeatForever()
        this.tweenStart_Stop = tween(label_win_node)
            .then(scaleLabel)
    }
    show_lose_group() {
        this.win_group.active = false;
        this.lose_group.active = true;
        this.init_effect_meo_lose();
        var label_lose_node = this.lose_group.getChildByPath('img_greysky/img_board/img_bangnho/img_LabelLose');
        let scaleLabel = tween(label_lose_node)
            .to(0.3, { scale: new Vec3(1.3, 1.3, 1.3) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .union()
            .repeatForever()
        this.tweenStart_Stop = tween(label_lose_node)
            .then(scaleLabel)
    }
    tween_Stop() {
        this.tweenStart_Stop.stop();
        this.tweenStart_Stop_anim.stop();
    }
    show_bonus_win() {
        let bonus_label_node_win = this.win_group.getChildByPath('img_light/img_nen1/img_thanhtien/show_bonus');
        let bonus_label_win = bonus_label_node_win.getComponent(Label);
        bonus_label_win.string = '+' + `${this.bonus}`;
    }
    show_bonus_lose() {
        let bonus_label_node_lose = this.lose_group.getChildByPath('img_greysky/img_board/img_thanhtien/show_bonus');
        let bonus_label_lose = bonus_label_node_lose.getComponent(Label);
        bonus_label_lose.string = `${this.bonus}`;
    }
    home_comeBack() {
        this.tween_Stop();
        cf_Director.instance.searching_comeback_state = searching_comeBack_state.normalSearching;
        let home_screen = VDScreenManager.instance.assetBundle.get(cf_Path.HOME_SCREEN, Prefab);
        VDScreenManager.instance.replaceScreenAtIndex(home_screen, 0, (screen: VDBaseScreen) => {
            cf_Director.instance.gameStateFE = GAME_STATE_FE.HOME_SCREEN;
            cf_Director.instance.homeScreen = screen as cf_HomeScreen;
            cf_Director.instance.reconnect_state = RECONNECT_STATE.NORMAL_CONNECT;
            cf_Director.instance.end_game_state = END_GAME_STATE.NO_STATE;
            cf_Director.instance.end_stage_state = END_STAGE_STATE.NO_STATE;
        });
    }
    searching_comeBack() {
        this.tween_Stop();
        cf_Director.instance.searching_comeback_state = searching_comeBack_state.searching_comeBack;
        let searching_screen = VDScreenManager.instance.assetBundle.get(cf_Path.SEARCH_SCREEN, Prefab);
        VDScreenManager.instance.replaceScreenAtIndex(searching_screen, 0, (screen: VDBaseScreen) => {
            cf_Director.instance.gameStateFE = GAME_STATE_FE.SEARCHING_OPP_SCREEN;
            cf_Director.instance.searchScreen = screen as cf_SearchScreen;
            cf_Director.instance.reconnect_state = RECONNECT_STATE.NORMAL_CONNECT;
            cf_Director.instance.end_game_state = END_GAME_STATE.NO_STATE;
            cf_Director.instance.end_stage_state = END_STAGE_STATE.NO_STATE;
        });
    }
    on_click_button_sound() {
        if (this.play_audio) {
            this.play_audio.effect_clickButton();
        }
    }
    init_effect_meo_lose() {
        let index = 0;
        let anim_lose = tween(this.anim_lose_node)
            .delay(0.035)
            .call(() => {
                var meoLose_sprite = this.anim_lose_node.getComponent(Sprite);
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
            .repeatForever()
        this.tweenStart_Stop_anim = tween(this.anim_lose_node)
            .then(anim_lose)
    }
    init_effect_meo_win() {
        let index = 0;
        let anim_win = tween(this.anim_win_node)
            .delay(0.035)
            .call(() => {
                var meoWin_sprite = this.anim_win_node.getComponent(Sprite);
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
            .repeatForever()
        this.tweenStart_Stop_anim = tween(this.anim_win_node)
            .then(anim_win)

    }
    update(deltaTime: number) {

    }
}


