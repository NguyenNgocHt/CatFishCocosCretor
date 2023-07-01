import { DEFAULT_WORLD_MAX_POS } from "cc";

export const cf_Text = {
    ERROR_LOADING_ASSETS: 'Đã có lỗi tải tài nguyên, vui lòng thử lại',
    NO_MONEY: 'Số dư trong ví không đủ,\nvui lòng nạp thêm để chơi tiếp.',
    ANOTHER_ACCOUNT: 'Tài khoản của bạn đã\nđăng nhập từ thiết bị khác.',
    AUTHEN_FAILED: 'Xác thực tài khoản thất bại.',
    MISMATCH_DATA: 'Dữ liệu không đồng bộ với máy chủ,\nvui lòng thử lại.',
    SYSTEM_ERROR: 'Có lỗi xảy ra,\nvui lòng thử lại.',
    NETWORK_WARNING: 'Đường truyền mạng yếu!',
    NO_CONNECT: 'Không có kết nối, vui lòng thử lại',
    ERROR_CONNECT: 'Kết nối thất bại. \n Vui lòng thử lại ...',
    LOST_CONNECT: 'Bạn đã bị mất kết nối. \n Vui lòng thử lại ...',
    DISCONNECT: 'Bị mất kết nối tới máy chủ\n Đang kết nối lại.',
    NO_PLAYSESSION: 'Hệ thống không tìm thấy phiên chơi.',
    GROUP_MAINTAIN: 'Hệ thống đang bảo trì.\nVui lòng quay lại sau.',
    IN_PROGRESSING: 'Mạng chậm vui lòng đợi trong \ngiây lát để hoàn thành\nlượt quay hoặc bấm xác nhận \nđể tải lại game.',
    ACCOUNT_BLOCKED: 'Tài khoản của bạn đã bị khoá,\nvui lòng liên hệ admin.',
    EVENT_NOT_AVAILABLE: 'Sự kiện không hợp lệ,\nvui lòng thử lại.'
}

export const cf_Path = {
    LOADING_SCREEN: 'res/prefabs/screen/loading_screen',
    PLAY_SCREEN: 'res/prefabs/screen/play_screen',
    HOME_SCREEN: 'res/prefabs/screen/home_screen',
    PLAYING_SCREEN: 'res/prefabs/screen/playing_screen',
    SEARCH_SCREEN: 'res/prefabs/screen/search_screen',
    RESULT_SCREEN: 'res/prefabs/screen/result_screen',
    TEST_NETWORK_SCREEN: 'res/prefabs/screen/test_network_screen',

    NOMONEY_POPUP: 'res/prefabs/popup/home_backUp',
    NOTIFY_POPUP: 'res/prefabs/popup/popup_notify',
    HOME_SETTING_POPUP: 'res/prefabs/popup/home_screen_popup_setting',
    HOME_SETTING_POPUP_CUSTOMIZE: 'res/prefabs/popup/home_screen_popup_customize',
    PLAY_SCREEN_POPUP: 'res/prefabs/popup/play_screen_popup',
    WATING_PROGRESS: 'res/prefabs/popup/waiting_progress',
    TEXTURE_ATLAS_ADD: 'res/images/texturePackage/cf_TP',
    TEXTURE_ATLAS_ADD_2: 'res/images/texturePackage/cf_TP2',
    TEXTURE_ATLAS_ADD_3: 'res/images/texturePackage/cf_TP3',
    TEXTURE_ATLAS_ADD_4: 'res/images/texturePackage/cf_TP4',
};
export const cf_seaching_avatar = {
    AVATAR_NAME: 'avatar_wait',
    SEARCHING_TEXT: 'Đang tìm kiếm',
};
export enum ON_OFF_STATE {
    NOT_STATE = 0,
    ON = 1,
    OFF = 2
};
export enum RECONNECT_STATE {
    NO_STATE = 0,
    NORMAL_CONNECT = 1,
    RECONNECT = 2,
};
export enum CONNECT_STATE {
    NO_STATE = 0,
    CONNECT = 1,
    DISCONNECT = 2,
};
export enum RECONNECT_RELOADING_PLAYSCREEN {
    NO_STATE = 0,
    RELOADING = 1,
    PLAYSCREEN = 2,
};
export enum END_GAME_STATE {
    NO_STATE = 0,
    PLAYING = 1,
    ENDGAME = 2,
}
export enum LOCK_HAND_BUTTON {
    NO_STATE = 0,
    LOCK = 1,
    OPEN = 2,
}
export enum END_STAGE_STATE {
    NO_STATE = 0,
    PLAYING = 1,
    ENDSTAGE = 2,
}


