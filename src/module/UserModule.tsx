import { makeAutoObservable } from 'mobx';

// 对应用状态进行建模。
class Timer {
    secondsPassed = 0;
    constructor() {
        makeAutoObservable(this);
    }

    increase() {
        this.secondsPassed += 1;
    }

    reset() {
        this.secondsPassed = 0;
    }
}

export const myTimer = new Timer();
