import { _decorator, Component, log } from 'cc';
import { cf_Director } from '../core/cf_Director';
const { ccclass, property } = _decorator;

@ccclass('cf_TestNetworkScreen')
export class cf_TestNetworkScreen extends Component {

    private logClassTag: string = "@ [cf_TestNetworkScreen] -- ";

    onClickBtnInitSocket() {
        log(`onClickBtnInitSocket`);

        cf_Director.instance.login(() => {
            log(this.logClassTag + " login success !");
        });
    }

    onClickSendMsg() {
        log(`onClickSendMsg`);
        let ws = cf_Director.instance.wsGameClient;
        ws && ws.startPlay();
    }
}

