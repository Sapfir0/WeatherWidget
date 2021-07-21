import { injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

@injectable()
export class FlipStore {
    public isFlipped: boolean = false;

    constructor() {
        makeObservable(this, {
            isFlipped: observable,
            toogle: action,
        });
    }

    public toogle = () => {
        this.isFlipped = !this.isFlipped;
    };
}
