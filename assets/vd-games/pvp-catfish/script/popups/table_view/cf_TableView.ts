import { math } from 'cc';
import { _decorator, Component, Node } from 'cc';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import VDTableView, { VDTableViewDataSource } from '../../../../../vd-framework/ui/VDTableView';
import { cf_Item_TableView } from './cf_Item_TableView';
const { ccclass, property } = _decorator;

@ccclass('cf_TableView')
export class cf_TableView extends VDBasePopup implements VDTableViewDataSource {

    @property(VDTableView)
    protected tableView: VDTableView = null!;

    protected _listItems: any[] = [];
    private numItems: number = 10;

    numberOfCellsInTableView(tableView: VDTableView): number {
        return this._listItems.length;
    }
    tableCellAtIndex(tableView: VDTableView, idx: number): Node {
        let cell = tableView.dequeueCell();
        let comp = cell?.getComponent(cf_Item_TableView);
        comp?.setData(this._listItems[idx]);
        return cell;
    }

    onEnable() {
        this.tableView.dataSource = this;

        this.initListData();
        this.tableView && this.tableView.reloadData();
    }

    initListData() {
        this._listItems = [];
        for (let i = 0; i < this.numItems; i++) {
            this._listItems.push({
                id: i + 1,
                content: 'content ' + (i + 1)
            });
        }
    }
    onclick_close() {
        this.hide();
    }

}

