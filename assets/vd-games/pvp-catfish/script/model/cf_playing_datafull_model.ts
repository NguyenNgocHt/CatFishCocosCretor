export type cf_playing_tap_data_model = {
    // playing tap
    dataID: number;
    isSelf: boolean;//nguoi tap la ai co phai ban than khong hay doi thu
    status: number;//0_tap false, khong co ca, 1_tap thanh cong, 2_tap ca cua dong doi, 3_tap cua doi thu;
    player_point_add: number; //so diem ban than duoc cong sau moi lan tap
    player_point_sum: number; //so diem cua ban than sau khi duoc cong diem 
    opp_point_add: number;// so diem cua doi thu duoc cong sau moi lan tap
    opp_point_sum: number; //so diem cua doi thu sau khi duoc cong diem
    state_Tap: number;
}
export type cf_playing_tap_data_info_short = {
    id: number;
    i: boolean;
    s: number;
    pA: number;
    p: number;
    opA: number;
    op: number;
    t: number;
}
//nex stage
export type cf_nex_stage_data_model = {
    dataID: number;
    player_round_win: number;//so hiep thang cu ban than
    opp_round_win: number;//so hiep thang cua doi thu
    current_round: number;// hiep dau hien tai
}
export type cf_nex_stage_data_Info_short = {
    id: number;
    w: number;
    ow: number;
    r: number;
}
//end game
//fish to client
export type cf_fish_to_client_data_model = {
    dataID: number;
    roomID: number;
    species_of_fish: number; // chung loai ca
}
export type cf_fish_to_client_data_info_short = {
    id: number;
    r: number;
    t: number;
}
//end stage
export type cf_end_stage_data_model = {
    dataID: number;
    isSelf: boolean;
    currentRound: number;
}
export type cf_end_stage_data_info_short = {
    id: number;
    i: boolean;
    r: number;
}
export type cf_disconnect_opp = {
    id: number;
}
export type cf_player_outGame = {
    id: number;
}





