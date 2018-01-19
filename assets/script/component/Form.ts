/**
 * Created by Neo on 2017/12/8
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Form extends cc.Component {
    /**
     * 窗体沿X轴方向的位移
     * @type {number}
     */
    @property
    public vectorX: number = 0;

    /**
     * 窗体沿Y轴方向的位移
     * @type {number}
     */
    @property
    public vectorY: number = 0;


    //窗体是否处于激活状态
    private _activated: boolean;
    ////////////////////////////////////////////////////////////////////////////
    //public
    //请在此处书写所有的公有方法
    ////////////////////////////////////////////////////////////////////////////
    public onLoad() {
    }

    public show(): void {
        if (this._activated) return;
        let action = cc.moveBy (0.2, cc.p (this.vectorX, this.vectorY)).easing (cc.easeBounceOut ());
        this.node.runAction (action);

        this._activated = true;
    }

    public hide(): void {
        if (!this._activated) return;
        let action = cc.moveBy (0.2, cc.p (-this.vectorX, -this.vectorY)).easing (cc.easeQuadraticActionIn ());
        let callback = () => {this._activated = false;};

        this.node.runAction (cc.sequence (action, cc.callFunc (callback)));
    }


    ///////////////////////////////////////////////////////////////////////////
    //protected
    //请在此处书写所有的保护方法
    ///////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////
    //private
    //请在此处书写所有的私有方法
    //////////////////////////////////////////////////////////////////////////
    public get activated() {
        return this._activated;
    }

}
