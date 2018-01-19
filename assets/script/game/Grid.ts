/**
 * Created by Neo on 2017/12/11
 */
const {ccclass} = cc.director;

@ccclass
export class Grid {
    //列数
    public readonly numColumn: number;
    //行数
    public readonly numRow: number;
    //炸弹总数
    public readonly numBomb: number;

    //各个格子周围的雷数
    private cells: number[];

    public constructor(column: number, row: number, numBomb: number) {
        this.numColumn = column;
        this.numRow = row;
        this.numBomb = numBomb;

        this.initGrid ();
    }

    //初始化网格数据 雷的分布，每个格子周围雷的数目
    private initGrid() {
        this.cells = [];

        let indexes = [];
        let len = this.numRow * this.numColumn;
        for (let i = 0; i < len; i++) {
            indexes[i] = i;
        }

        //随机生成炸弹的位置
        for (let i = 0; i < this.numBomb; i++) {
            let randI = (Math.random () * (len - i) + i) | 0;

            let t = indexes[i];
            indexes[i] = indexes[randI];
            indexes[randI] = t;

            let x = indexes[i] % this.numColumn | 0;
            let y = indexes[i] / this.numColumn | 0;

            let index = this.getIndex (x, y);
            this.cells[index] = -1;
        }



        //统计不是炸弹的格子 周围的炸弹数目
        for (let y = 0; y < this.numRow; y++) {
            for (let x = 0; x < this.numColumn; x++) {
                let index = this.getIndex (x, y);
                if (this.cells[index] === -1) continue;

                let roundBombCount = this.countRoundBomb (x, y);
                this.cells[index] = roundBombCount;
            }
        }
    }

    /**
     * 获取指定格子周围炸弹的数目（-1~8）
     * 其中-1表示该格子就是炸弹
     * @param x
     * @param y
     * @returns {number}
     */
    public getCellRoundBombCount(x: number, y: number): number {
        let index = this.getIndex (x, y);
        if (index < 0) {
            console.log (`坐标(${x},${y})超出边界`);
            return NaN;
        }
        return this.cells[index];
    }

    /**
     * 将二维坐标转化为一维坐标
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    private getIndex(x: number, y: number): number {
        if (x < 0 || y < 0) return -1;
        return y * this.numColumn + x;
    }

    /**
     * 统计某个格子周围的雷数
     * @param {number} x
     * @param {number} y
     * @returns {number} 雷数
     */
    private countRoundBomb(x: number, y: number): number {
        //过滤掉超出边界的点
        let startX = x - 1 < 0 ? 0 : x - 1;
        let startY = y - 1 < 0 ? 0 : y - 1;

        let endX = x + 1 >= this.numColumn ? this.numColumn - 1 : x + 1;
        let endY = y + 1 >= this.numRow ? this.numRow - 1 : y + 1;

        let roundBombCount = 0;
        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                let index = this.getIndex (i, j);
                if (this.cells[index] === -1) {
                    roundBombCount++;
                }
            }
        }

        return roundBombCount;
    }
}

