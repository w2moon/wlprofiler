import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import ListItem, { ItemInfo } from './ListItem';

export class ListInfo {
    @observable itemInfos: Array<ItemInfo> = [];

    add(itemInfo: ItemInfo) {
        this.itemInfos.push(itemInfo);
    }

    clear() {
        this.itemInfos = [];
    }
}
let ListView = observer<{ listInfo: ListInfo }>(({ listInfo }) => {
    return (
        <div>
            {
                listInfo.itemInfos.map(
                    (itemInfo, key) => <ListItem key={key} itemInfo={itemInfo} />
                )
            }
        </div>
    );
});
export default ListView;