import { cf_PlayerInfoShort, cf_PlayerInfoModel } from '../model/cf_PlayerModel';
import { cf_BetInfoData, cf_BetInfoModel } from './cf_BetInfoModel';
import { cf_endGame_data_Info_short, cf_endGame_data_model, cf_reconnect_data_Info_short, cf_reconnect_data_model } from './cf_endGame_data_model';
import { cf_home_data_full } from './cf_home_data_full';
import { cf_end_stage_data_info_short, cf_end_stage_data_model, cf_fish_to_client_data_info_short, cf_fish_to_client_data_model, cf_nex_stage_data_Info_short, cf_nex_stage_data_model, cf_playing_tap_data_info_short, cf_playing_tap_data_model } from './cf_playing_datafull_model';
import { cf_searching_data_Info_shot, cf_searching_data_model } from './cf_searching_Model';

export class cf_BuildModel {
    static buildPlayerModel(playerData: cf_home_data_full): cf_PlayerInfoModel {
        const playerModel: cf_PlayerInfoModel = {
            playerId: playerData.id,
            displayName: playerData.n,
            avatarId: playerData.a,
            money: playerData.S,
        };
        return playerModel;
    }
    static builBetsModel(betsData: cf_home_data_full): cf_BetInfoModel {
        const betsModel: cf_BetInfoModel = {
            betAmount: JSON.parse(betsData.b),
        };
        return betsModel;
    }
    //build searching data to data model
    static build_SearchingDataModel(searching_data_info_short: cf_searching_data_Info_shot): cf_searching_data_model {
        const seachingModel: cf_searching_data_model = {
            dataID: searching_data_info_short.id,
            RoomID: searching_data_info_short.r,
            name_player: searching_data_info_short.n1,
            player_hand1: searching_data_info_short.h1,
            player_hand2: searching_data_info_short.h2,
            name_opp: searching_data_info_short.n2,
            opp_hand1: searching_data_info_short.o1,
            opp_hand2: searching_data_info_short.o2,
            bets: searching_data_info_short.b,
            token: searching_data_info_short.t,
            opp_avatar: searching_data_info_short.a,
            round_current: searching_data_info_short.R
        };
        return seachingModel;
    }
    //build playing tap data to tap data model
    static build_PlayingTap_DataModel(playing_tap_info_short: cf_playing_tap_data_info_short): cf_playing_tap_data_model {
        const tapDataModel: cf_playing_tap_data_model = {
            dataID: playing_tap_info_short.id,
            isSelf: playing_tap_info_short.i,//nguoi tap la ai co phai ban than khong hay doi thu
            status: playing_tap_info_short.s,//0_tap false, khong co ca, 1_tap thanh cong, 2_tap ca cua dong doi, 3_tap cua doi thu;
            player_point_add: playing_tap_info_short.pA, //so diem ban than duoc cong sau moi lan tap
            player_point_sum: playing_tap_info_short.p, //so diem cua ban than sau khi duoc cong diem 
            opp_point_add: playing_tap_info_short.opA,// so diem cua doi thu duoc cong sau moi lan tap
            opp_point_sum: playing_tap_info_short.op, //so diem cua doi thu sau khi duoc cong diem
            state_Tap: playing_tap_info_short.t// trang thai tap, -1 , 3 4 5 6
        };
        return tapDataModel;
    }
    // build nexStage data to data model
    static build_nexStage_dataModel(nexStage_data_info_short: cf_nex_stage_data_Info_short): cf_nex_stage_data_model {
        const nexStageModel: cf_nex_stage_data_model = {
            dataID: nexStage_data_info_short.id,
            player_round_win: nexStage_data_info_short.w,//so hiep thang cu ban than
            opp_round_win: nexStage_data_info_short.ow,//so hiep thang cua doi thu
            current_round: nexStage_data_info_short.r,// hiep dau hien tai
        };
        return nexStageModel;
    }
    //build fish to client data to data model
    static build_fishDataModel(fishToClient_dataInfoShort: cf_fish_to_client_data_info_short):
        cf_fish_to_client_data_model {
        const fishDataModel: cf_fish_to_client_data_model = {
            dataID: fishToClient_dataInfoShort.id,
            roomID: fishToClient_dataInfoShort.r,
            species_of_fish: fishToClient_dataInfoShort.t,
        };
        return fishDataModel;
    }
    //build end game data to data model
    static build_endGame_dataModel(endGame_dataInfoShort: cf_endGame_data_Info_short): cf_endGame_data_model {
        const endGameDataModel: cf_endGame_data_model = {
            dataID: endGame_dataInfoShort.id,
            money_win: endGame_dataInfoShort.w,
        };
        return endGameDataModel;
    }
    //build reconnect data to data model
    static build_reconnect_dataModel(reconnect_dataInfoShort: cf_reconnect_data_Info_short): cf_reconnect_data_model {
        const reconnectDataModel: cf_reconnect_data_model = {
            dataID: reconnect_dataInfoShort.id,
            point_player: reconnect_dataInfoShort.mP,
            round_win_player: reconnect_dataInfoShort.mW,
            point_opp: reconnect_dataInfoShort.oP,
            round_win_opp: reconnect_dataInfoShort.oW,
            status: reconnect_dataInfoShort.s,
            current_round: reconnect_dataInfoShort.r,
        };
        return reconnectDataModel;
    }
    //build end stage data to data model
    static build_endStage_dataModel(endStage_dataInfoShort: cf_end_stage_data_info_short): cf_end_stage_data_model {
        const endStageDataModel: cf_end_stage_data_model = {
            dataID: endStage_dataInfoShort.id,
            isSelf: endStage_dataInfoShort.i,
            currentRound: endStage_dataInfoShort.r,
        };
        return endStageDataModel;
    }
}

