export type bets_data_inputSever = {
    id: number;
    b: number;//so tien cuoc
}
export type playing_tap_inputSever = {
    id: number;// data id
    r: number;//room id
    t: number;//loai tap
}
export type playing_leave_game_inputSever = {
    id: number;
    r: number; //room id
}
export type stopMaching_inputSever = {
    id: number;
    b: number;//so tien dat cuoc
}
export type end_game_leaveGame_inputSever = {
    id: number;
    r: number;//room id
}
export type recconnect_inputSever = {
    id: number;
    t: number;//token cua tran dau
}
export type Ping_inputSever = {
    id: number;
    r: number; //room id
    t: number;
}
export type play_ready_inputSever = {
    id: number;
    r: number;
}
export type call_to_sever_update_money = {
    id: number;
}

