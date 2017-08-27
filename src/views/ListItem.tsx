import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

export class ItemInfo {
    name: string;
    time: number;
    amount: number;
    @observable selected: boolean;

    constructor(
        name: string,
        time: number,
        amount: number,
        selected: boolean = false
    ) {

        this.name = name;
        this.time = time;
        this.amount = amount;
        this.selected = selected;

    }
}
let ListItem = observer<{ itemInfo: ItemInfo }>(({ itemInfo }) => {
    return <div>{itemInfo.name} {itemInfo.time} {itemInfo.amount} {`${itemInfo.selected}`}</div>;
});
export default ListItem;