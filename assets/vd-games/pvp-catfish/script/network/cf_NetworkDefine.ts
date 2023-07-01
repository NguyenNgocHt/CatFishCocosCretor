export let cf_CommandID = {
    // LOGIN: 1000,
    // START_GAME: 1001,
    // TAKE_TURN: 1002,
    // END_GAME: 1003, 
}
export let cf_CommandID_IP = {
    PLAY_READY_IP: 1010,
    BETS_LIST_IP: 1001,
    PLAYING_TAP_IP: 1004,
    DISCONNECT_IP: 1007,
    PLAYING_LEAVE_GAME_IP: 1003,
    STOP_MACHING_IP: 1005,
    RECONNECT_IP: 1006,
    UPDATE_MONEY: 1013,

}
export let cf_CommandID_OP = {
    LOGIN_RETURN_OP: 1999,
    BETS_LIST_OP: 1507,
    SEARCHING_DATA_OP: 1501,// output from sever tra ve goi tin nguoi choi va doi thu trong man searching
    TAP_OP: 1504,
    NEX_STAGE_OP: 1604,
    DOUBLE_TAP_FALSE_OP: 1505,
    DISCONNECT_OP: 1507,
    FISH_TO_CLIENT_OP: 1502,
    COUNT_DOWN_OP: 1508,
    END_GAME_OP: 1510,
    RECONNECT_OP: 1506,
    DELETE_FISH: 1509,
    ENDSTAGE_OP: 1507,
    DISCONNECT_OPP: 1511,
    NO_MONEY_OP: 1505,
    PLAYER_OUT_GAME: 1503,
}

export const cf_NETWORK_STATE_EVENT = {
    ERROR: 'dm-network-error',
    DISCONNECT: 'dm-network-disconnect',
}

export const cf_GAME_STATE_EVENT = {
    LOGIN_SUCCESS: 'dm-login-success',
    SEARCHING_OPP_DATA_MODEL: 'searching-opp-data-model',
    PLAYING_TAP_DATA_MODEL: 'playing-tap-data-model',
    NEXT_STAGE_DATA_MODEL: 'next-stage-data-model',
    PLAYING_ENDGAME_DATA_MODEL: 'playing-end-game-data-model',
    DOUBLE_TAP_FALSE_DATA_MODEL: 'double-tap-false-data-model',
    FISH_TO_CLIENT_DATA_MODEL: 'fish-to-client-data-model',
    COUNT_DOWN_DATA_MODEL: 'count-down-data-model',
    END_GAME_DATA_MODEL: 'end-game-data-model',
    RECONNECT_DATA_MODEL: 'reconnect-data-model',
    DELETE_FISH: 'delete-fish',
    END_STAGE_DATA_MODEL: 'end-stage-data-model',
    WIN_LOSE_ROUND_END: 'win-lose-round-end',
    DISCONNECT_OPP: 'disconnect-opp',
    NO_MONEY_DATA: 'no-money-data',
    PLAYER_OUT_GAME: 'player-out-game',
    //button setting
    MOVE_BUTTON_POSITION: 'move-button-position',
    BUTTON_MOVING_STATE: 'button-moving-state',
    SEND_TAP_LEFT_RIGHT_STATE_PLAYER: 'send-tap-left-right-state-player',
    SEND_TAP_LEFT_RIGHT_STATE_OPP: 'send-tap-left-right-state-opp',
    //texture package add
    //setting emit
    UIOPACITY_START_END: "uiopacity-start-end",
}
export const cf_LOCAL_STORAGE = {
    SEARCHING_DATA_MODEL: 'SEARCHING_DATA_MODEL',
    PLAYER_DATA_MODEL: 'PLAYER-DATA-MODEL',
    NEXT_STAGE_DATA_MODEL: 'NEXT_STAGE_DATA_MODEL',
    ARR_BUTTON_LEFT_RIGHT: 'arr-button-left-right',
}
