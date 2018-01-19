const {ccclass, property} = cc._decorator;

@ccclass
export default class Game2 extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        console.log("Game.js加载");
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    }

    private _onKeyUp(e):void {

    }
    // update (dt) {},
}
