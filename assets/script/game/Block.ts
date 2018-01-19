/**
 * Created by Neo on 2017/12/12
 */
import Color = cc.Color;
import SpriteFrame = cc.SpriteFrame;

const {ccclass, property} = cc._decorator;

@ccclass
export class Block extends cc.Component {
    @property (cc.Sprite)
    public bg: cc.Sprite = null;

    @property (cc.Sprite)
    public bomb: cc.Sprite = null;

    @property (cc.Label)
    public lblNumRoundBomb: cc.Label = null;

    @property (cc.Node)
    public btn: cc.Node = null;

    @property (cc.Sprite)
    //标雷
    public mark: cc.Sprite = null;

    @property (cc.Sprite)
    //不确定
    public mark2: cc.Sprite = null;

    /**格子周围炸弹数目 */
    private _numRoundBomb: number;
    /**
     * 格子当前状态
     * 0.点开状态
     * 1.正常状态，未被点击或标记
     * 2.标记状态，有雷
     * 3.标记状态，不确定
     */
    private _status: number = 1;

    private static readonly LABEL_COLOR: Color[] = [
        new Color (0, 0, 255),
        new Color (0, 255, 0),
        new Color (255, 0, 0),
        new Color (0, 0, 96),
        new Color (64, 0, 0),
        new Color (0, 128, 128),
        new Color (255, 255, 255),
        new Color (255, 255, 255),
    ];

    public init(numRoundBomb: number): void {
        this._numRoundBomb = numRoundBomb;

        if (this._numRoundBomb === 0) {
            this.lblNumRoundBomb.string = "";
        }
        if (this._numRoundBomb > 0) {
            this.lblNumRoundBomb.string = "" + this._numRoundBomb;
            this.lblNumRoundBomb.node.color = Block.LABEL_COLOR[this._numRoundBomb - 1];
        }
        this.lblNumRoundBomb.node.active = false;
    }

    public autoChangeStatus(): void {
        if (this.opened) return;

        this._status++;
        if (this._status >= 4) {
            this._status = 1;
        }
        this.changeStatus (this._status);
    }

    /**
     * 变更格子当前状态
     * 0.点开状态
     * 1.正常状态，未被点击或标记
     * 2.标记状态，有雷
     * 3.标记状态，不确定
     */
    public changeStatus(status: number): void {
        if ([0, 1, 2, 3].indexOf (status) >= 0) {
            this._status = status;
        }
        switch (this._status) {
            case 0:
                this.btn.active = false;
                this.mark.node.active = false;
                this.mark2.node.active = false;
                this.bg.node.active = true;
                if (this._numRoundBomb === -1) {
                    this.bomb.node.active = true;
                } else {
                    this.lblNumRoundBomb.node.active = true;
                }
                break;
            case 1:
                this.btn.active = true;
                this.mark.node.active = false;
                this.mark2.node.active = false;
                this.bomb.node.active = false;
                this.lblNumRoundBomb.node.active = false;
                break;
            case 2:
                this.btn.active = true;
                this.mark.node.active = true;
                this.mark2.node.active = false;
                break;
            case 3:
                this.btn.active = true;
                this.mark.node.active = false;
                this.mark2.node.active = true;
                break;

        }
    }

    public setHover(hover:boolean):void {
        this.btn.active = !hover;
        this.bg.node.active = hover;
    }
    public get isBomb() {
        return this._numRoundBomb === -1;
    }

    public get isBlank() {
        return this._numRoundBomb === 0;
    }

    public get opened() {
        return this._status === 0;
    }

    public get clickable() {
        return this._status === 1;
    }
}
