import { _decorator, Component, Node, SpriteFrame, Label, Sprite, tween, RenderFlow, Tween, UITransform, Vec2, Prefab, Vec3 } from 'cc';
import { avatar, mock_config, seachingModel_fake, user_name } from '../../../../vd-mock/mock_config';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import { cf_PlayScreen } from './cf_PlayScreen';
import { GAME_STATE_FE, cf_Director } from '../core/cf_Director';
import { cf_PlayingScreen } from './cf_PlayingScreen';
import { CONNECT_STATE, ON_OFF_STATE, cf_Path } from '../common/cf_Define';
import { cf_seaching_start_data, cf_searching_data_model } from '../model/cf_searching_Model';
import { director } from 'cc';
import { cf_PlayerInfoModel } from '../model/cf_PlayerModel';
import { bets_data_inputSever, stopMaching_inputSever } from '../model/cf_data_Input_model';
import { cf_CommandID_IP } from '../network/cf_NetworkDefine';
import { cf_HomeScreen } from './cf_HomeScreen';
import { cf_seaching_avatar } from '../common/cf_Define';
import { VDAudioManager } from '../../../../vd-framework/audio/VDAudioManager';
import { cf_playing_audioPlay } from '../playing/cf_playing_audioPlay';
import { resources } from 'cc';
import { SpriteAtlas } from 'cc';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';
import { END_GAME_STATE } from '../common/cf_Define';
import { END_STAGE_STATE } from '../common/cf_Define';
enum searchingState {
    nostate,
    searching,
    found_an_opp,
}
enum searching_comeBack_state {
    nostate,
    normalSearching,
    searching_comeBack,
}
const { ccclass, property } = _decorator;
@ccclass('cf_SearchScreen')
export class cf_SearchScreen extends VDBaseScreen {
    @property(Node)
    private playerNode: Node = null;
    @property(Node)
    private compNode: Node = null;
    @property(Node)
    private call_back_home: Node = null;
    private tweenStop!: Tween<Node>;
    private op_searching_dataModel: cf_searching_data_model = null;
    private op_player_dataModel: cf_PlayerInfoModel = null;
    private ip_stopSearching_data: stopMaching_inputSever = null;
    private searching_state: searchingState = searchingState.nostate;
    private ip_bets_data: bets_data_inputSever = null;
    private searching_ComeBack_State: searching_comeBack_state = searching_comeBack_state.nostate;
    private seaching_start_data: cf_seaching_start_data = null;
    private audio_play: cf_playing_audioPlay = null;
    private NoMoney_popup: VDBasePopup = null!;

    onLoad() {
        this.op_player_dataModel = cf_Director.instance.OP_PlayerInfoModel_show_home;
        this.ip_bets_data = cf_Director.instance.IP_bets_data;
        this.seaching_start_data = {
            seaching_avatar_name: cf_seaching_avatar.AVATAR_NAME,
            searching_text: cf_seaching_avatar.SEARCHING_TEXT,
        }
        this.audio_play = this.node.getComponent(cf_playing_audioPlay);
    }
    get_searchingDataModel(searchingDataModel: cf_searching_data_model) {
        cf_Director.instance.connect_opp = CONNECT_STATE.CONNECT;
        this.searching_state = searchingState.found_an_opp;
        this.op_searching_dataModel = searchingDataModel;
        this.scheduleOnce(function () {
            this.init_comp(cf_Director.instance.avatar_for_opp, this.op_searching_dataModel.name_opp);
        }, 0.5);

    }
    start() {
        cf_Director.instance.end_game_state = END_GAME_STATE.NO_STATE;
        cf_Director.instance.end_stage_state = END_STAGE_STATE.NO_STATE;
        this.init_player(cf_Director.instance.avatar_for_player, this.op_player_dataModel.displayName);
        this.init_wait(this.seaching_start_data.seaching_avatar_name, this.seaching_start_data.searching_text);
        if (cf_Director.instance.searching_comeback_state == searching_comeBack_state.searching_comeBack) {
            cf_Director.instance.send_betsData(this.ip_bets_data);
        }
    }
    init_player(avatar_player: SpriteFrame, name_players: string) {
        this.searching_state = searchingState.searching;
        let avatar_node = this.playerNode.getChildByPath("pictureFrame/Mask_avatar_player/avatar_player");
        avatar_node.setScale(2, 2, 2);
        let name_node = this.playerNode.getChildByName("name_player");
        let name_for_player = name_node.getComponent(Label);
        let sprite_avatar = avatar_node.getComponent(Sprite);
        sprite_avatar.spriteFrame = avatar_player;
        name_for_player.string = name_players;
    }
    init_comp(avatar_opp: SpriteFrame, name_comp: string) {
        let avatar_node = this.compNode.getChildByPath("pictureFrame/Mask_avatar_comp/avatar_comp");
        avatar_node.setScale(1.4, 1.4, 1.4);
        let name_node = this.compNode.getChildByName("name_comp");
        let name_for_comp = name_node.getComponent(Label);
        let sprite_avatar = avatar_node.getComponent(Sprite);
        sprite_avatar.spriteFrame = avatar_opp;
        name_for_comp.string = name_comp;
        this.tween_stop();
        tween(this.node)
            .delay(2)
            .call(() => {
                this.swap_playing_screen();
            })
            .start();
    }
    init_wait(name_avatar_wait: string, string_searching: string) {
        var sprite_Frame = new SpriteFrame();
        var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
        let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
        sprite_Frame = sprite_atlas.getSpriteFrame('avatar_wait');
        let avatar_node = this.compNode.getChildByPath("pictureFrame/Mask_avatar_comp/avatar_comp");
        avatar_node.setScale(1.4, 1.4, 1.4);
        let name_node = this.compNode.getChildByName("name_comp");
        let name_for_wait = name_node.getComponent(Label);
        let sprite_avatar = avatar_node.getComponent(Sprite);
        sprite_avatar.spriteFrame = sprite_Frame
        name_for_wait.string = string_searching;
        this.searchingPlay(string_searching, name_for_wait);
    }
    swap_playing_screen() {
        let playing_screen = VDScreenManager.instance.assetBundle.get(cf_Path.PLAYING_SCREEN, Prefab);
        VDScreenManager.instance.replaceScreenAtIndex(playing_screen, 0, (screen: VDBaseScreen) => {
            cf_Director.instance.gameStateFE = GAME_STATE_FE.PLAYING_SCREEN;
            cf_Director.instance.playingScreen = screen as cf_PlayingScreen;
            cf_Director.instance.searchScreen = null;
        });
    }
    searchingPlay(string_searching: string, name_for_wait: Label) {
        // rotate img waiting
        let imgWaiting = this.node.getChildByPath('img_avata_comp/img_waiting');
        let moving = tween(imgWaiting)
            .by(1, { eulerAngles: new Vec3(0, 0, -360) })
            .repeatForever()
        this.tweenStop = tween(imgWaiting)
            .then(moving)
    }
    onEnable() {
        this.scheduleOnce(function () {
            this.tweenStop.start();
        }, 0.1);
    }
    tween_stop() {
        this.tweenStop.stop();
        let imgWaiting = this.node.getChildByPath('img_avata_comp/img_waiting');
        imgWaiting.active = false;
    }
    stop_searching() {
        if (this.searching_state == searchingState.searching) {
            this.ip_stopSearching_data = {
                id: cf_CommandID_IP.STOP_MACHING_IP,
                b: cf_Director.instance.IP_bets_data.b,
            }
            cf_Director.instance.send_stopMaching_Data(this.ip_stopSearching_data);
            let home_screen = VDScreenManager.instance.assetBundle.get(cf_Path.HOME_SCREEN, Prefab);
            VDScreenManager.instance.replaceScreenAtIndex(home_screen, 0, (screen: VDBaseScreen) => {
                cf_Director.instance.gameStateFE = GAME_STATE_FE.HOME_SCREEN;
                cf_Director.instance.homeScreen = screen as cf_HomeScreen;
            });
        }
    }
    effect_clickButton() {
        this.audio_play.effect_clickButton();
    }
    set_noMoney_data() {
        VDScreenManager.instance.showPopupFromPrefabName(cf_Path.NOMONEY_POPUP, (popup: VDBasePopup) => {
            this.NoMoney_popup = popup;
            let callbacks = [() => {
                VDScreenManager.instance.hidePopup(true);
            }];
        }, false, true, true);
    }
}


