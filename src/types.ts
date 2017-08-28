import {Point} from './utils/data';

export interface FrameData {
    num: number;
    time: number;
    frame?: number;
    children?: FrameArray;
}

export interface FrameArray {
    [index: string]: FrameData;
}

export interface FuncLine {
    [index: string]: Array<Point>;
}
