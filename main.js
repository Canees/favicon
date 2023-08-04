class WebTileService {
    #canvas = null;
    #title = document.title;
    #config = { Background: 'red', Color: 'white', Type: 'scroll', Time: 500 };
    #ctx = null;
    #linkTag = null;
    #img = null;
    #timer = null;

    constructor(Config) {
        if (Config instanceof Object && Object.keys(Config).length) {
            this.#config = { ...this.#config, ...Config }
        }
        this.#init()
    }

    async #init() {
        const icon = document.querySelectorAll('link[rel~=shortcut]')[0]
        // img
        const img = new Image()
        img.style.width = `32px`
        img.style.height = `32px`
        img.crossOrigin = 'Anonymous'
        img.src = icon.href
        // canvas 初始化
        const canvas = document.createElement('canvas')
        canvas.height = 32
        canvas.width = 32
        this.#canvas = canvas
        const ctx = canvas.getContext('2d')
        this.#ctx = ctx
        // 画底图
        const res = await new Promise((res, rej) => {
            img.onload = () => res(true)
            img.onerror = () => rej(false)
        })
        if (res) ctx.drawImage(img, 0, 0, 32, 32)
        this.#img = img
        // dom 初始化
        const head = document.getElementsByTagName('head')[0]
        const linkTag = document.createElement('link')
        linkTag.setAttribute('rel', 'shortcut icon')
        linkTag.setAttribute('type', 'image/x-icon')
        linkTag.setAttribute('href', canvas.toDataURL('image/png'))
        linkTag.setAttribute('id', 'RESETLinkICON')
        head.removeChild(icon)
        head.appendChild(linkTag)
        this.#linkTag = linkTag
    }

    setTitle(text) {
        if (!text) return
        const { Type, Time } = this.#config
        let title = ''
        let scrollTitle = ''
        if (this.#timer) clearInterval(this.#timer)
        this.#timer = setInterval(() => {
            switch (Type) {
                case 'scroll':
                    if (!scrollTitle || !scrollTitle.slice(1)) {
                        document.title = text
                        scrollTitle = text
                    } else {
                        scrollTitle = scrollTitle.slice(1)
                        document.title = scrollTitle
                    }
                    break;
                case 'flicker':
                    document.title = title === document.title ? text : title
                default:
                    clearInterval(this.#timer)
                    document.title = this.#title
                    break;
            }
        }, Time);
    }

    setNum(num) {
        if (!(num instanceof Number) || !num || !this.#ctx || !this.#linkTag) return
        const { Background, Color } = this.#config
        this.#ctx.arc(21, 21, 11, 0, 2 * Math.PI)
        this.#ctx.fillStyle = Background
        this.#ctx.fill();
        this.#ctx.textAlign = 'center'
        this.#ctx.font = 'normal bold 16px Aria'
        this.#ctx.fillStyle = Color
        this.#ctx.fillText(num > 99 ? '･･' : num, 21, 27)
        if (num <= 100) this.#linkTag.setAttribute('href', this.#canvas.toDataURL('image/png'));
    }

    clearNum() {
        this.#ctx.drawImage(this.#img, 0, 0, 32, 32)
        this.#linkTag.setAttribute('href', this.#canvas.toDataURL('image/png'));
    }

    clearTitle() {
        clearTimeout(this.#timer)
        document.title = this.#title
    }
}