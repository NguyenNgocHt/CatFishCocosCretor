import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
import { cf_Path } from '../../common/cf_Define';
import { cf_Director, GAME_STATE_FE } from '../../core/cf_Director';
import VDBaseScreen from '../../../../../vd-framework/ui/VDBaseScreen';
import { cf_HomeScreen } from '../../screens/cf_HomeScreen';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
@ccclass('cf_searching_noMoney_gohome')
export class cf_searching_noMoney_gohome extends VDBasePopup {
    onClick_goHome() {
        this.hide();
        let home_screen = VDScreenManager.instance.assetBundle.get(cf_Path.HOME_SCREEN, Prefab);
        VDScreenManager.instance.replaceScreenAtIndex(home_screen, 0, (screen: VDBaseScreen) => {
            cf_Director.instance.gameStateFE = GAME_STATE_FE.HOME_SCREEN;
            cf_Director.instance.homeScreen = screen as cf_HomeScreen;
        });
    }
}


