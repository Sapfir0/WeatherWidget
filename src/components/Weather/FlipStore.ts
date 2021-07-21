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
        console.log(this.isFlipped);

        this.isFlipped = !this.isFlipped;
    };
}
