import { CCBoolean } from 'cc';
import { _decorator, Component, log, assetManager, Prefab } from 'cc';
import VDAsyncTaskMgr from '../../../vd-framework/async-task/VDAsyncTaskMgr';
import { VDAudioManager } from '../../../vd-framework/audio/VDAudioManager';
import VDScreenManager from '../../../vd-framework/ui/VDScreenManager';
import { cf_Config } from './common/cf_Config';
import { cf_Path } from './common/cf_Define';
import { cf_Director } from './core/cf_Director';
import { cf_LoadingScreen } from './screens/cf_LoadingScreen';
const { ccclass, property } = _decorator;

@ccclass('cf_Scene')
export class cf_Scene extends Component {

    @property(CCBoolean)
    public runTestScreen: boolean = false;

    onLoad() {
        log("@ cf_Scene: onLoad  bundle " + cf_Config.GAME_NAME);
        let bundle = assetManager.getBundle("bundle_" + cf_Config.GAME_NAME);
        if (bundle) {
            this.node.addComponent(VDScreenManager);

            VDScreenManager.instance.assetBundle = bundle;
            VDScreenManager.instance.setupCommon();

            let pathScreen = cf_Path.LOADING_SCREEN;
            if (this.runTestScreen) pathScreen = cf_Path.TEST_NETWORK_SCREEN;

            bundle.load(pathScreen, Prefab, (error, prefab) => {
                if (error) {
                    log(`bundle.load: ${error}`);
                }
                else {
                    log("load loading sucess")
                    // VDScreenManager.instance.initWithRootScreen(prefab);
                    VDScreenManager.instance.initWithRootScreen(prefab, (screen) => {
                        log('initWithRootScreen ' + screen.name + ' success!');
                    });
                }
            })
        }
    }

    onDestroy() {
        cf_Director.instance.offEvents();
        VDAudioManager.instance.destroy();
        VDAsyncTaskMgr.instance.stop();
    }

}

