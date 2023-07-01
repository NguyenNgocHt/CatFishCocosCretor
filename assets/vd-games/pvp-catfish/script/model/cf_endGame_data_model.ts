export type cf_endGame_data_model = {
    dataID: number;
    money_win: number;
}
export type cf_endGame_data_Info_short = {
    id: number;
    w: number;
}
//reconnect
export type cf_reconnect_data_model = {
    dataID: number;
    point_player: number;
    round_win_player: number;
    point_opp: number;
    round_win_opp: number;
    status: boolean;
    current_round: number;
}
export type cf_reconnect_data_Info_short = {
    id: number;
    mP: number;
    mW: number;
    oP: number;
    oW: number;
    s: boolean;
    r: number;
}

