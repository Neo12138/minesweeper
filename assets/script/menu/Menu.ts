import Form from "../component/Form";

const {ccclass, property} = cc._decorator;

@ccclass
export class Menu extends cc.Component {
    @property
    public settingForm: Form = null;

    @property
    public aboutForm: Form = null;

    /**
     * 当前处于启用状态的窗口
     */
    private curActiveForm: Form;

    public onLoad(): void {
        this.curActiveForm = null;
    }


    public onGameStart(): void {
        this.node.parent.runAction (cc.sequence (
            cc.fadeOut (1).easing (cc.easeQuarticActionIn ()),
            cc.callFunc (function () {
                    cc.director.loadScene ("game");
                }
            )));
    }

    public onSetting(): void {
        this._activeForm (this.settingForm);
    }

    public onAbout(): void {
        this._activeForm (this.aboutForm);
    }

    public onExit(): void {
        this._activeForm (null);
    }

    /**
     * 用于切换弹窗
     * 注：只有方法名以'_'开始，在Cocos Creator中才不会被识别，private只在类之间起作用
     * @param {Form} form
     */
    private _activeForm(form: Form): void {
        if (form && form.activated) return;
        else if (this.curActiveForm === form) {
            this.curActiveForm = null;
        }
        //经过上面的过滤
        //当前窗口非空，则一定是开启状态
        //待开启的窗口非空，则一定是未开启状态

        if (this.curActiveForm) {
            this.curActiveForm.hide ();
        }
        if (form) {
            form.show ();
        }
        this.curActiveForm = form;
    }
}
