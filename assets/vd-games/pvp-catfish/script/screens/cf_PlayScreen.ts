import { Prefab } from 'cc';
import { _decorator, Component, Node, log } from 'cc';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
const { ccclass, property } = _decorator;

@ccclass('cf_PlayScreen')
export class cf_PlayScreen extends VDBaseScreen {
    onClickBtnNext() {
        log(`onClickBtnNext`);
    }
}

