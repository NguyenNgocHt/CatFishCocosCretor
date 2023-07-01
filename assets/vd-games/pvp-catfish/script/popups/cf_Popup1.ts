import { _decorator, Component, Node } from 'cc';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';
const { ccclass, property } = _decorator;

@ccclass('cf_Popup1')
export class cf_Popup1 extends VDBasePopup {

    finishedCallback: any = null;

    onClickBtnClose() {
        this.hide();
        this.finishedCallback && this.finishedCallback();
    }
}

