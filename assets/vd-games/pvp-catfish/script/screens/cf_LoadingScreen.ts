import { ProgressBar } from 'cc';
import { Label } from 'cc';
import { AudioClip, assetManager, Asset, Button, utils, sp, Prefab, tween, Vec3, Size } from 'cc';
import { sys } from 'cc';
import { _decorator, Component, log } from 'cc';
import { VDAudioManager } from '../../../../vd-framework/audio/VDAudioManager';
import VDLocalDataManager from '../../../../vd-framework/common/VDLocalDataManager';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { cf_Config } from '../common/cf_Config';
import { END_GAME_STATE, RECONNECT_RELOADING_PLAYSCREEN, RECONNECT_STATE, cf_Path, cf_Text } from '../common/cf_Define';
import { GAME_STATE_FE, LOGIN_STATE, cf_Director } from '../core/cf_Director';
import { cf_PopupNotify } from '../popups/cf_PopupNotify';
import { cf_WaitingProgress } from '../popups/cf_WaitingProgress';
import { cf_HomeScreen } from './cf_HomeScreen';
import { cf_PlayScreen } from './cf_PlayScreen';
import { cf_PlayingScreen } from './cf_PlayingScreen';
import { EditBox } from 'cc';
import { cf_reconnect_data_model } from '../model/cf_endGame_data_model';
import { UITransform } from 'cc';
import { cf_playing_audioPlay } from '../playing/cf_playing_audioPlay';
import { cf_ResultScreen } from './cf_ResultScreen';
const { ccclass, property } = _decorator;

enum reconectState {
    nostate,
    normalConnect,
    reconnect,
}
enum connectState {
    nostate,
    success,
    false,
}
@ccclass('cf_LoadingScreen')
export class cf_LoadingScreen extends VDBaseScreen {
    private reconnect_state: reconectState = reconectState.normalConnect;
    @property(ProgressBar)
    loadingProgress: ProgressBar = null!;
    @property(Label)
    lbVersion: Label = null!;
    @property(Button)
    btnGoHomeScreen: Button = null!;
    private reconnect_data: cf_reconnect_data_model = null;
    private _audios: { [key: string]: string } = {};
    private _items: string[] = [];
    private audio_play: cf_playing_audioPlay = null;
    private _isLoading: boolean = false;
    private _isLoginning: boolean = false;
    private percentage: number = 0;
    private percentage_number_width: number = 0;

    onLoad() {
        let soundDirs = [
            'res/sounds/bgm/',
            'res/sounds/sfx/',
        ];

        let imageDirs = [
            'res/fonts/',
            'res/images/bgr/',
            'res/images/play_screen/playScreen/playscreen/play_screen_update_1/',
            'res/images/popup_setting/setting_button/',
            'res/images/play_screen/playScreen/playscreen/playscreen_update/',
            'res/images/avatar_loading_from_URL/',
            'res/images/texturePackage/',
        ];

        let prefabDirs = [
            'res/anims/prefabs/',
            'res/prefabs/popup/',
        ];

        let prefabs = [
            'res/prefabs/screen/test_network_screen',
            'res/prefabs/screen/play_screen',
            'res/prefabs/screen/home_screen',
            'res/prefabs/screen/search_screen',
            'res/prefabs/screen/playing_screen',
            'res/prefabs/screen/result_screen',
        ];

        if (sys.isNative) this._items = this._items.concat(soundDirs);

        this._items = this._items
            // .concat(soundDirs)
            .concat(imageDirs)
            .concat(prefabDirs)
            .concat(prefabs);

        this._setVersion(cf_Config.versionGame);
        this.audio_play = this.node.getComponent(cf_playing_audioPlay);
    }

    start() {
        this.btnGoHomeScreen && (this.btnGoHomeScreen.node.active = false);
        this.loadingProgress.progress = 0;

        let percent = 1.0 / (this._items.length + 1);
        sys.isBrowser && this._loadAudioWeb();
        this.checkGoHomeScreen();
    }
    show_label_play_or_reconnect() {
        var label_play_and_reconnect_node = this.btnGoHomeScreen.node.getChildByName('label');
        var label_play_and_reconnect = label_play_and_reconnect_node.getComponent(Label);
        if (this.reconnect_state == reconectState.normalConnect) {
            label_play_and_reconnect.string = "PLAY";
        }
        if (this.reconnect_state == reconectState.reconnect) {
            label_play_and_reconnect.string = 'RECONNECT';
        }
    }

    checkGoHomeScreen() {
        if (cf_Director.instance.getLoginState() === LOGIN_STATE.LOGIN_SUCCESS && cf_Director.instance.loadingSuccess) {
            this.loadingProgress && (this.loadingProgress.node.active = false);
            if (cf_Director.instance.reconnect_state == RECONNECT_STATE.RECONNECT) {
                this.reconnect_state = reconectState.reconnect;
                this.onClickBtn2MainGame();
            }
            if (cf_Director.instance.reconnect_state == RECONNECT_STATE.NORMAL_CONNECT) {
                this.reconnect_state = reconectState.normalConnect;
                this.onClickBtn2MainGame();
            }
        }
        else {
            if (cf_Director.instance.getLoginState() === LOGIN_STATE.NO_LOGIN) {
                this._checkLogin();
            }
            if (!cf_Director.instance.loadingSuccess && !this._isLoading) {
                let percent = 1.0 / (this._items.length + 1);
                this._loadAsset(0, percent);
            }
        }
    }

    dangnhap_ID_game_Play() {
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get("id");
        const token = searchParams.get("token");
        var ID_number = parseInt(id);
        var tocken_number = parseInt(token);
        cf_WaitingProgress.instance.show();
        cf_Director.instance.connectToGameServer(tocken_number, ID_number);
        if (cf_Director.instance.connect_state == connectState.success) {
            this.checkGoHomeScreen();
        }
    }

    private _checkLogin() {
        VDScreenManager.instance.assetBundle.load(cf_Path.NOTIFY_POPUP,
            (err, data) => {
                if (!err) {
                    this.doLogin();
                }
                else {
                    log("load error  " + err + " _checkLogin");
                    if (sys.isBrowser) {
                        alert(cf_Text.NO_CONNECT);
                    }
                }
            });
    }

    private doLogin() {
        if (this._isLoginning) return;
        this._isLoginning = true;
        cf_Director.instance.login(
            () => {
                log(`login is successful!`);
                this._isLoginning = false;
                this.checkGoHomeScreen();
            },
            () => {
                this._isLoginning = false;
                log(`login is failed!`);
            },
        )
        this.dangnhap_ID_game_Play();
    }

    private _loadAudioWeb() {
        let soundDirs = [
            'res/sounds/bgm/',
            'res/sounds/sfx/',
        ];
        soundDirs.forEach(soundsPath => {
            const sounds = VDScreenManager.instance.assetBundle.getDirWithPath(soundsPath, AudioClip);
            sounds.forEach(sound => {
                if (this._audios[`${sound.path}`]) return;
                const nativeUrl = assetManager.utils.getUrlWithUuid(sound.uuid, { isNative: true, nativeExt: '.mp3' });
                this._audios[`${sound.path}`] = nativeUrl;
            })
        });

        this._initAudio();
    }

    private _initAudio() {
        VDAudioManager.instance.init(this._audios);

        let isMuteMusic = VDLocalDataManager.getBoolean(VDAudioManager.ENABLE_MUSIC, false);
        let isMuteSfx = VDLocalDataManager.getBoolean(VDAudioManager.ENABLE_SFX, false);

        VDAudioManager.instance.isMutingMusic = isMuteMusic;
        VDAudioManager.instance.isMutingEffect = isMuteSfx;
    }

    private _loadAsset(index: number, totalPercent: number) {
        if (index >= this._items.length) {
            this.loadingProgress.progress = 1.0;
            this.convert_to_percentage(this.loadingProgress.progress);
            this._finishedLoading();
            return;
        }
        let path = this._items[index];
        log("_loadAsset  " + path);
        if (this._isDirectory(path)) {
            VDScreenManager.instance.assetBundle.loadDir(path,
                (finished, total) => {
                    let progress = index * totalPercent + finished / total * totalPercent;
                    if (progress > this.loadingProgress.progress) {
                        this.loadingProgress.progress = progress;
                        this.convert_to_percentage(this.loadingProgress.progress);
                    }
                },
                (err, data) => {
                    if (sys.isNative && (path.endsWith('/bgm/') || path.endsWith('/sfx/'))) {
                        let assets: Asset[] = data;
                        for (let as of assets) {
                            if (as instanceof AudioClip) {
                                this._audios[`${path}${as.name}`] = `${as._nativeAsset.url}`;
                            }
                        }

                        this._initAudio();
                    }

                    if (!err) {
                        this.scheduleOnce(() => {
                            this._loadAsset(index + 1, totalPercent);
                        }, 0);
                    } else {
                        log("load error  " + err + "    " + path);
                        if (sys.isBrowser) {
                            this.showPopupMessage(cf_Text.ERROR_LOADING_ASSETS);
                        }
                    }
                });
        }
        else {
            VDScreenManager.instance.assetBundle.load(path,
                (finished, total) => {
                    this.loadingProgress.progress = index * totalPercent + finished / total * totalPercent;
                    this.convert_to_percentage(this.loadingProgress.progress);
                },
                (err, data) => {
                    if (!err) {
                        this.scheduleOnce(() => {
                            this._loadAsset(index + 1, totalPercent);
                        }, 0);
                    }
                    else {
                        log("load error  " + err + "    " + path);
                        if (sys.isBrowser) {
                            this.showPopupMessage(cf_Text.ERROR_LOADING_ASSETS);
                        }
                    }
                });
        }
    }
    private _finishedLoading() {
        log(`LoadingScreen: _finishedLoading`);
        this._isLoading = false;
        cf_Director.instance.loadingSuccess = true;
        cf_WaitingProgress.instance.init();
        this.checkGoHomeScreen();
    }
    convert_to_percentage(progress_number: number) {
        var percentage_number = progress_number * 100;
        this.percentage = parseFloat(percentage_number.toFixed(2))
        this.show_percentage(this.percentage)
    }
    show_percentage(percent: number) {
        var percentage_number_node = this.loadingProgress.node.getChildByPath('show_loading_percentage/number');
        var Percentage = this.loadingProgress.node.getChildByPath('show_loading_percentage/percentage');
        let p_percentage = Percentage.getWorldPosition();
        let p_percentage_number = percentage_number_node.getWorldPosition();
        var percentage_number_label = percentage_number_node.getComponent(Label);
        percentage_number_label.string = `${percent}`;
        this.percentage_number_width = this.transform_contentSize_label();
        Percentage.setWorldPosition(p_percentage_number.x + this.percentage_number_width + 13, p_percentage_number.y, 0);
    }

    transform_contentSize_label(): number {
        var percentage_number_node = this.loadingProgress.node.getChildByPath('show_loading_percentage/number');
        var percentage_number_label = percentage_number_node.getComponent(Label);
        var uitransform = percentage_number_node.getComponent(UITransform);
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = `${percentage_number_label.fontSize}px ${percentage_number_label.fontFamily}`;
        const contentSize = ctx.measureText(percentage_number_label.string);
        uitransform.contentSize = new Size(contentSize.width, percentage_number_label.fontSize);
        return uitransform.contentSize.width;
    }
    onClickBtn2MainGame() {
        tween(this.node)
            .delay(0.5)
            .call(() => {
                if (this.reconnect_state == reconectState.normalConnect) {
                    let home_screen = VDScreenManager.instance.assetBundle.get(cf_Path.HOME_SCREEN, Prefab)!;
                    VDScreenManager.instance.replaceScreenAtIndex(home_screen, 0, (screen: VDBaseScreen) => {
                        cf_Director.instance.gameStateFE = GAME_STATE_FE.HOME_SCREEN;
                        cf_Director.instance.homeScreen = screen as cf_HomeScreen;
                    });
                }
                if (this.reconnect_state == reconectState.reconnect) {
                    if (cf_Director.instance.OP_reconnectDataModel.current_round == -1) {
                        var result_screen_prefab = VDScreenManager.instance.assetBundle.get(cf_Path.RESULT_SCREEN, Prefab);
                        VDScreenManager.instance.replaceScreenAtIndex(result_screen_prefab, 0, (result: VDBaseScreen) => {
                            cf_Director.instance.gameStateFE = GAME_STATE_FE.RESULT_SCREEN;
                            cf_Director.instance.resultScreen = result as cf_ResultScreen;
                        });
                    } else {
                        let play_screen = VDScreenManager.instance.assetBundle.get(cf_Path.PLAYING_SCREEN, Prefab)!;
                        VDScreenManager.instance.replaceScreenAtIndex(play_screen, 0, (screen: VDBaseScreen) => {
                            cf_Director.instance.gameStateFE = GAME_STATE_FE.PLAYING_SCREEN;
                            cf_Director.instance.playingScreen = screen as cf_PlayingScreen;
                            cf_Director.instance.reconnect_reload_playscreen = RECONNECT_RELOADING_PLAYSCREEN.RELOADING;
                        });
                    }
                    if (cf_Director.instance.end_game_state == END_GAME_STATE.ENDGAME) {
                        var result_screen_prefab = VDScreenManager.instance.assetBundle.get(cf_Path.RESULT_SCREEN, Prefab);
                        VDScreenManager.instance.replaceScreenAtIndex(result_screen_prefab, 0, (result: VDBaseScreen) => {
                            cf_Director.instance.gameStateFE = GAME_STATE_FE.RESULT_SCREEN;
                            cf_Director.instance.resultScreen = result as cf_ResultScreen;
                        });
                    }
                }
            })
            .start();
    }

    private showPopupMessage(message: string) {
        VDScreenManager.instance.showPopupFromPrefabName(cf_Path.NOTIFY_POPUP, (popup: VDBasePopup) => {
            let popupDisplay = popup as cf_PopupNotify;
            popupDisplay.setupPopup(message, [
                () => {
                    VDScreenManager.instance.hidePopup(true);
                    let percent = 1.0 / (this._items.length + 1);
                    this._loadAsset(0, percent);
                },
                () => {
                    VDScreenManager.instance.hidePopup(true);
                }
            ]);
        }, true, true, false);
    }

    private _setVersion(version: string) {
        this.lbVersion && (this.lbVersion.string = 'v' + version);
    }

    private _isDirectory(path: string | null): boolean {
        return path != null && typeof path == 'string' && path.length > 0 && path[path.length - 1] == '/';
    }
    on_click_button_sound() {
        this.audio_play.effect_clickButton();
    }
}

