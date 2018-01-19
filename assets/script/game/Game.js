var {Grid} = require('../game/Grid');
var {Block} = require('../game/Block');
var {Form} = require('../component/Form');
var {SettingPanel} = require('../menu/SettingPanel');

cc.Class({
    extends: cc.Component,

    properties: {
        board: cc.Node,
        blocks: cc.Node,
        blockPrefab: cc.Prefab,
        gameoverForm: SettingPanel,
        settingForm: SettingPanel
    },

    onLoad: function () {
        this.firstRound = true;
        this.grid = null;
        this.cells = [];
        this.roundCount = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
        this.onGameStart();
    },

    onUnload: function () {
        this.settingForm.hide();

        this.node.runAction(cc.sequence(
            cc.fadeOut(0.5).easing(cc.easeQuarticActionIn()),
            cc.callFunc(function () {
                    cc.director.loadScene("menu");
                }
            )));
    },

    _onKeyUp: function (e) {
        switch (e.keyCode) {
            case cc.KEY.escape:
                this.settingForm.show();
                break;
        }
    },

    _drawBoard: function (grid, size) {
        // var g = this.board.getComponent(cc.Graphics);
        var w = grid.numColumn * size;
        var h = grid.numRow * size;

        // //画横线
        // for (let i = 0; i <= grid.numRow; i++) {
        //     g.moveTo(0, size * i);
        //     g.lineTo(w, size * i);
        //     g.stroke();
        // }
        // //画横线
        // for (let i = 0; i <= grid.numColumn; i++) {
        //     g.moveTo(size * i, 0);
        //     g.lineTo(size * i, h);
        //     g.stroke();
        // }
        // this.board.x -= w / 2;
        // this.board.y -= h / 2;

        //画按钮
        for (let j = 0; j < grid.numRow; j++) {
            for (let i = 0; i < grid.numColumn; i++) {
                var block;
                let index = this._getIndex(i, j);

                if (this.firstRound) {
                    block = cc.instantiate(this.blockPrefab);
                    block.x = size * i;
                    block.y = size * j; //cocos 的y轴是向上的，这里将调整为向下

                    this.cells[index] = block;
                    this.blocks.addChild(block);
                }
                block = this.cells[index];
                block.getComponent(Block).changeStatus(1);
                block.getComponent(Block).init(grid.getCellRoundBombCount(i, j));
            }
        }

        if (this.firstRound) {
            this.blocks.width = w;
            this.blocks.height = h;
            this.blocks.x -= w / 2;
            this.blocks.y -= h / 2;
            this.firstRound = false;
        }
    },

    _onClickBlock: function (e) {
        var p = this.blocks.convertToNodeSpace(cc.p(e._x, e._y));
        //console.log(p.x/36|0,p.y/36|0);
        var x = p.x / 36 | 0;
        var y = p.y / 36 | 0;
        var index = this._getIndex(x, y);

        var block = this.cells[index].getComponent(Block);
        if (e._button === 0 && block.clickable) {
            block.changeStatus(0);
            if (block.isBomb) {
                this._onGameOver();
            }
            if (block.isBlank) {
                this._autoOpenRoundBlock(x, y);
            }
        }
        if (e._button === 2) {
            block.autoChangeStatus();
        }
    },


    _onHoverBlock: function (e) {
        var p = this.blocks.convertToNodeSpace(cc.p(e._x, e._y));
        var x = p.x / 36 | 0;
        var y = p.y / 36 | 0;
        var index = this._getIndex(x, y);
        if(!this.cells[index]) return;
        var block = this.cells[index].getComponent(Block);
        if(this.curBlock && this.curBlock != block && this.curBlock.clickable){
            this.curBlock.setHover(false);
        }
        if(block.clickable){
            this.curBlock = block;
            block.setHover(true);
        }
    },

    onGameStart: function (e) {
        this.roundCount++;
        this.gameoverForm.hide();

        //读取设置，创建游戏
        this.grid = new Grid(30, 16, 99);
        this._drawBoard(this.grid, 36);
        console.log(`--------${this.roundCount}------------------------------------------`);
        for (let j = this.grid.numRow - 1; j >= 0; j--) {
            let str = "";
            for (let i = 0; i < this.grid.numColumn; i++) {
                str += this.grid.getCellRoundBombCount(i, j) + "\t";
            }
            console.log(str);
        }

        //如果是点击按钮开局，则延时开启事件监听，否则点击按钮就会点击到棋盘
        var delay = e ? delay = 50 : 0;
        setTimeout(function () {
            this.blocks.on(cc.Node.EventType.MOUSE_UP, this._onClickBlock, this);
            this.blocks.on(cc.Node.EventType.MOUSE_MOVE, this._onHoverBlock, this);
        }.bind(this), delay);

    },

    _onGameOver: function () {
        //显示所有的雷
        for (let i = 0; i < this.cells.length; i++) {
            let block = this.cells[i].getComponent(Block);
            if (block.isBomb) {
                block.changeStatus(0);
            }
        }

        this.blocks.off(cc.Node.EventType.MOUSE_UP, this._onClickBlock, this);
        this.blocks.off(cc.Node.EventType.MOUSE_MOVE, this._onHoverBlock, this);
        this.gameoverForm.show();
    },

    _autoOpenRoundBlock: function (x, y, numBomb) {
        //if(numBomb != 0) return;
        //过滤掉超出边界的点
        let startX = x - 1 < 0 ? 0 : x - 1;
        let startY = y - 1 < 0 ? 0 : y - 1;

        let endX = x + 1 >= this.grid.numColumn ? this.grid.numColumn - 1 : x + 1;
        let endY = y + 1 >= this.grid.numRow ? this.grid.numRow - 1 : y + 1;

        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                let index = this._getIndex(i, j);
                let block = this.cells[index].getComponent(Block);
                if (block.opened) continue;

                block.changeStatus(0);
                if (block.isBlank) {
                    this._autoOpenRoundBlock(i, j);
                }
            }
        }
    },

    _getIndex: function (x, y) {
        return y * this.grid.numColumn + x;
    }
});
