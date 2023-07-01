import { _decorator, Component, Node, SpriteFrame, Sprite, Label, Prefab, labelAssembler, SpriteAtlas } from 'cc';
import { best_list, mock_config, money_for_player } from '../../../../vd-mock/mock_config';
import VDScreenManager, { VD_SCREEN_IDS } from '../../../../vd-framework/ui/VDScreenManager';
import { cf_PlayScreen } from './cf_PlayScreen';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import { GAME_STATE_FE, cf_Director } from '../core/cf_Director';
import { cf_SearchScreen } from './cf_SearchScreen';
import { END_GAME_STATE, cf_Path } from '../common/cf_Define';
import { bets_data_inputSever, call_to_sever_update_money } from '../model/cf_data_Input_model';
import { cf_CommandID_IP, cf_NETWORK_STATE_EVENT } from '../network/cf_NetworkDefine';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';
import { VDAudioManager } from '../../../../vd-framework/audio/VDAudioManager';
import { cf_playing_audioPlay } from '../playing/cf_playing_audioPlay';
const { ccclass, property } = _decorator

@ccclass('cf_HomeScreen')
export class cf_HomeScreen extends VDBaseScreen {
    @property(Node)
    private top_group: Node = null;
    @property(Node)
    private center_group: Node = null;
    private bets: number = 0;
    public bets_data: bets_data_inputSever = null;
    private bets_index: number = 0;
    private bets_list: number[];
    private home_setting_popup: VDBasePopup = null!;
    private audio_play: cf_playing_audioPlay = null;
    private ip_update_money: call_to_sever_update_money = null;
    onLoad() {
        this.audio_play = this.node.getComponent(cf_playing_audioPlay);
    }
    start() {
        this.audio_play.start_home_nhacnen();
        this.call_to_sever_update_money();
        this.set_top_screen(cf_Director.instance.avatar_for_player,
            cf_Director.instance.OP_PlayerInfoModel_show_home.displayName,
            cf_Director.instance.OP_PlayerInfoModel_show_home.money, cf_Director.instance.OP_betsInfoModel_show_home.betAmount);
        cf_Director.instance.outGame_state = false;
        cf_Director.instance.end_game_state = END_GAME_STATE.NO_STATE;
    }
    call_to_sever_update_money() {
        this.ip_update_money = {
            id: cf_CommandID_IP.UPDATE_MONEY,
        };
        cf_Director.instance.send_update_money(this.ip_update_money);
    }
    set_top_screen(avatar_player: SpriteFrame, user_name: string, money_for_player: number, best_list: number[]) {
        if (!this.bets_list) {
            this.bets_list = [];
        }
        this.bets_list = best_list;
        this.set_avatar_and_name_for_player(avatar_player, user_name);
        this.set_money_for_player(money_for_player);
        this.set_bets_list(best_list);
    }
    set_avatar_and_name_for_player(avatar_player: SpriteFrame, user_name: string) {
        let avatar_node = this.top_group.getChildByPath("button_avatar/img_avatar/Mask_img_avatar/avatar");
        let name_node = this.top_group.getChildByPath("button_avatar/img_avatar/name_player");
        let name_for_player = name_node.getComponent(Label);
        let sprite_avatar = avatar_node.getComponent(Sprite);
        avatar_node.setScale(1.4, 1.4, 1.4);
        sprite_avatar.spriteFrame = avatar_player;
        name_for_player.string = user_name;
    }
    set_money_for_player(money_for_player: number) {
        let convert_number = money_for_player.toLocaleString();
        let _money_for_player = this.top_group.getChildByPath("money_group/img_thanhtien/money_show");
        let label_money = _money_for_player.getComponent(Label);
        label_money.string = convert_number;
        label_money.spacingX = 1;
    }
    set_bets_list(best_list: number[]) {
        for (let i = 0; i < best_list.length; i++) {
            let img_number_node_add = "img_nen1/img_nen2/button_" + `${i + 1}` + "/" + "img_" + `${best_list[i]}`;
            let img_number_node = this.center_group.getChildByPath(img_number_node_add);
            let sprite_node = img_number_node.getComponent(Sprite);

            var sprite_Frame = new SpriteFrame();
            var sprite_atlas_dirs = cf_Path.TEXTURE_ATLAS_ADD;
            let sprite_atlas = VDScreenManager.instance.assetBundle.get(sprite_atlas_dirs, SpriteAtlas);
            let spriteFrame_name = 'img_' + `${best_list[i]}`;
            sprite_Frame = sprite_atlas.getSpriteFrame(spriteFrame_name);
            sprite_node.spriteFrame = sprite_Frame;
        }
    }
    onClick_button_to_searching_comp(event: TouchEvent, bets: number) {
        for (let i = 0; i < this.bets_list.length; i++) {
            if (this.bets_list[i] == bets) {
                this.bets_index = i;
            }
        }
        cf_Director.instance.bets_data = this.bets;
        this.bets_data = {
            id: cf_CommandID_IP.BETS_LIST_IP,
            b: this.bets_index,
        };
        cf_Director.instance.send_betsData(this.bets_data);
        this.audio_play.stop_music_home();
        let searching_screen = VDScreenManager.instance.assetBundle.get(cf_Path.SEARCH_SCREEN, Prefab);
        VDScreenManager.instance.replaceScreenAtIndex(searching_screen, 0, (screen: VDBaseScreen) => {
            cf_Director.instance.gameStateFE = GAME_STATE_FE.SEARCHING_OPP_SCREEN;
            cf_Director.instance.searchScreen = screen as cf_SearchScreen;
        });
    }

    click_button_setting() {
        VDScreenManager.instance.showPopupFromPrefabName(cf_Path.HOME_SETTING_POPUP, (popup: VDBasePopup) => {
            this.home_setting_popup = popup;
            let callbacks = [() => {
                VDScreenManager.instance.hidePopup(true);
            }];
        }, false, true, true);
    }
    effect_clickButton() {
        this.audio_play.effect_clickButton();
    }
    update(deltaTime: number) {

    }
}


