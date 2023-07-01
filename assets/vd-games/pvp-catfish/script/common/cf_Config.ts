import { VDGameConfig } from "../../../../vd-framework/common/VDGameConfig";

export type cf_ConfigType = VDGameConfig & {
    win_coin: number,
    host_url: string,
    port: number,
    isHttps: boolean
};

export const cf_Config: cf_ConfigType = {
    GAME_ID: '1001',
    GAME_NAME: 'catfish',
    versionGame: '1.0.0',
    isShowFPS: true,
    isUnitTest: true,
    host_url: 'api.godoo.asia',
    port: 0,
    isHttps: true,
    //------ extends
    win_coin: 1000,

};
export type cf_seaching_avatar = {
    SEACHING_AVATAR_NAME: 'avatar_wait',
};

