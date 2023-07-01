export type cf_searching_data_model = {
    dataID: number;
    RoomID: number;
    name_player: string;
    player_hand1: number;
    player_hand2: number;
    name_opp: string;
    opp_hand1: number;
    opp_hand2: number;
    bets: number;
    token: number;
    opp_avatar: string;
    round_current: number;
}
export type cf_searching_data_Info_shot = {
    id: number;// id goi du lieu
    r: number;//id phong choi
    n1: string;//ten nguoi choi
    h1: number;//tay 1 nguoi choi
    h2: number;//tay 2 nguoi choi
    n2: string;//ten doi thu
    o1: number;//tay 1 doi thu
    o2: number;//tay 2 doi thu
    b: number;//tien dat cuoc
    t: number;//ma thong tin man choi 
    a: string;// so avata cua doi thu
    R: number;//round current
}
export type cf_seaching_start_data = {
    seaching_avatar_name: string;
    searching_text: string;
};
export type cf_noMoney_data = {
    id: number,
};

