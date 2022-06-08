/**
 * 树叶、花瓣等物体飘落动画
 * @author Tooru(x)
 * @description My website: https://tooru.ink
 */


class FallItem {
    path: string
    width?: number
    height?: number
    isPx: boolean
    dir?: number

    constructor(path: string, width?: number | null, height?: number | null, isPx?: boolean, dir?: number) {
        this.path = path;
        this.width = width === null ? undefined : width
        this.height = height === null ? undefined : height
        this.isPx = isPx === true
        this.dir = dir

        if (!width && !height) {
            this.width = 1
            this.isPx = false
        }
    }
}

class Fall {
    container: HTMLElement
    items: FallItem[] // 元素
    density: number // 密度
    speed: number

    _fallEleList: FallElement[] = []

    static random(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    constructor(container: HTMLElement, items: FallItem[], density?: number, speed?: number) {
        this.container = container;
        this.items = items;
        this.density = density || 20;
        this.speed = speed || 1;

        this.generateFallElement(this.density, true)

        this.loop()
    }

    generateFallElement(count:number, isInit:boolean) {
        for (let i = 0; i < count; i++) {
            const item = this.items[Fall.random(0, this.items.length - 1)];
            const ele = new FallElement(this.container, item, this.speed, isInit);
            this._fallEleList.push(ele);
        }
    }

    loop() {

        for (let i = this._fallEleList.length - 1; i >= 0; i--) {
            const ele = this._fallEleList[i]
            if (ele.isDestroyed()) {
                console.log("isDestroyed")
                this.container.removeChild(ele.ele)
                this._fallEleList.splice(i, 1);
                this.generateFallElement(1, false)
                continue;
            }
            ele.fall()
        }

        setTimeout(() => {
            this.loop()
        }, 1000 * this.speed)
    }

}

class FallElement {
    container: HTMLElement
    speed: number
    posX: number
    posY: number
    rotate: number
    item: FallItem
    ele: HTMLImageElement
    w: number
    h: number
    cw: number
    ch: number
    dir: number

    constructor(container: HTMLElement, item: FallItem, speed: number, isInit: boolean) {
        this.item = item;
        this.speed = speed;
        this.container = container;
        this.cw = this.container.offsetWidth
        this.ch = this.container.offsetHeight

        this.dir = item.dir ? item.dir : (Fall.random(0,1) ? -1 : 1) // 方向

        this.rotate = Fall.random(0, 360)
        this.posX = Fall.random(-10000, 10000) / 100

        this.posY = (isInit ? (Fall.random(0,1) ? -1 : 1) : -1) * Fall.random(5, 95)

        let scale = Fall.random(60, 120) / 100

        let width = undefined
        let height = undefined
        if (this.item.width !== undefined) {
            width = (this.item.isPx ? this.item.width : this.item.width / 100 * this.container.offsetWidth) * scale
        }
        if (this.item.height !== undefined) {
            height = (this.item.isPx ? this.item.height : this.item.height / 100 * this.container.offsetHeight) * scale
        }

        this.ele = new Image(width, height)
        this.ele.src = this.item.path
        this.ele.setAttribute("style", this._getStyle())

        this.container.append(this.ele)

        this.ele.onload = () => {
            this.w = this.ele.offsetWidth
            this.h = this.ele.offsetHeight
            this.fall()
        }

    }

    fall() {
        if (this.w === undefined || this.h === undefined)
            return;

        this.posY = this.posY + this.h * (1 + Fall.random(0, 20) / 100);
        this.posX = this.posX + this.w * (this.dir * Fall.random(80, 140) / 100);
        this.rotate = this.rotate + -this.dir * Fall.random(30, 90)

        this.ele.setAttribute("style", this._getStyle());
    }

    _getStyle() {
        return `
            position: absolute;
            top: 0;
            left: 0;
            transition: transform ${1000 * this.speed + 200}ms linear;
            transform: ${this._getTransform()};
        `;
    }

    _getTransform() {
        const w = (this.posX / 100 * this.cw).toFixed(2)
        const h = (this.posY / 100 * this.ch).toFixed(2)
        return `translateX(${w}px) translateY(${h}px) rotate(${this.rotate}deg);`
    }

    isDestroyed() {
        if (this.posY / 100 * this.ch > this.ch * 1.2) {
            return true
        }
        if (this.posX / 100 * this.cw < 0 - this.cw * 0.2) {
            return true
        }
        if (this.posX / 100 * this.cw > this.cw * 1.2) {
            return true
        }
        return false
    }

}
