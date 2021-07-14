import axios, { AxiosResponse } from "axios"
import { BaseOption, InitOption } from "./option"

export class ColorPickerTool {
  canvas: HTMLCanvasElement | null = null

  context: CanvasRenderingContext2D | null = null

  options: BaseOption = {
    id: "",
    canvasWidth: 500,
    canvasHeight: 500,
    scaleRatio: 2.0,
    // preview scale circle radius
    scaleRadius: 60,
    imageURL: "",
    sightRadius: 6,
    // grid line padding
    gridSpace: 2,
    // inner canvas padding, give the mouse room to move
    innerPadding: 60,
    // click callback fn
    callback: null,
    readImageStrategy: {
      value: "internal",
      strategy: null
    }
  }
  _tipsize = 12

  get gridWidth() {
    return this.options.sightRadius * 2 + this.options.gridSpace
  }

  scaleRectangle = {
    width: 300,
    height: 300,
    x: 0,
    y: 0
  }

  _internalDealCors = (url: string) => {
    // https://cn.webmasterapi.com/free-image-proxy
    return `https://ip.webmasterapi.com/api/imageproxy/${encodeURIComponent(url)}`
  }

  // save imageData, could be used to recover
  _imageData: ImageData | null = null

  constructor(options: InitOption) {
    if (!options.id) throw "Invalid canvas id"
    this._initContext(options.id)
    options = this.normalizeOpt(options)
    this.options = Object.assign({}, this.options, options)

    this.scaleRectangle.width = this.options.canvasWidth * 0.6
    this.scaleRectangle.height = this.options.canvasHeight * 0.6

    // init event & get cross origin image
    this.initial()
  }

  normalizeOpt(options: InitOption) {
    // prevent options.readImageStrategy error
    if (
      typeof options.readImageStrategy === "object" &&
      options.readImageStrategy?.value === "custom" &&
      !options.readImageStrategy.strategy
    ) {
      console.warn(
        `[warn]: If options.readImageStrategy.value = 'custom', readImageStrategy.strategy must be a function`
      )
      options.readImageStrategy.strategy = () => this.options.imageURL
    }
    return options
  }

  /// when change imageUrl should reinitial
  changeImage(imageUrl) {
    this.options.imageURL = imageUrl
    this.clearPaint()
    this.initial()
  }

  /// internal fn to create context 2d
  _initContext(id) {
    if (!this.canvas || !this.context) {
      this.canvas = document.getElementById(id) as HTMLCanvasElement
      if (!this.canvas) {
        throw `Can not find canvas element, maybe use nextTick to resolve this?`
      }
      this.canvas.width = this.options.canvasWidth
      this.canvas.height = this.options.canvasHeight
      this.context = this.canvas.getContext("2d")
    }
  }

  /// recover imageData to canvas
  restoreLastImageData() {
    if (this._imageData != null) {
      const { scaleRadius } = this.options
      const { scaleRectangle, context } = this
      context.putImageData(
        this._imageData,
        scaleRectangle.x - scaleRadius,
        scaleRectangle.y - scaleRadius
      )
    }
  }

  /// draw a scale circle to preview imageData
  drawScaleCirclePath(mouse) {
    let _localScaledRect = null
    const { scaleRadius, scaleRatio } = this.options
    const { scaleRectangle } = this
    // offset, include `margin` and so on
    scaleRectangle.x = mouse.x
    scaleRectangle.y = mouse.y
    this._imageData = this.context.getImageData(
      mouse.x - scaleRadius,
      mouse.y - scaleRadius,
      scaleRectangle.width,
      scaleRectangle.height
    )

    this.context.save()
    _localScaledRect = {
      width: scaleRectangle.width * scaleRatio,
      height: scaleRectangle.height * scaleRatio
    }
    this.drawScaleCircleWrapper()
    // after used, need to restore clip layer
    this.context.clip()

    this.context.drawImage(
      this.canvas,
      scaleRectangle.x - scaleRadius,
      scaleRectangle.y - scaleRadius,
      scaleRectangle.width,
      scaleRectangle.height,
      scaleRectangle.x - 2 * scaleRadius,
      scaleRectangle.y - 2 * scaleRadius,
      _localScaledRect.width,
      _localScaledRect.height
    )

    this.drawSights()

    this.context.restore()
    this.drawRealtimePreviewWrapper({ x: mouse.x, y: mouse.y })
  }

  drawRealtimePreviewWrapper(position: { x: number; y: number }) {
    this.context.save()
    this.context.globalAlpha = 0.5
    this.context.beginPath()
    const { scaleRadius } = this.options
    const { scaleRectangle } = this
    const startY = scaleRectangle.y + scaleRadius / 3
    const startX = scaleRectangle.x - scaleRadius / 2
    const padding = 4
    this.context.fillRect(startX, startY, scaleRadius, this._tipsize + padding)
    this.context.closePath()
    this.context.restore()

    this.context.save()
    this.context.textAlign = "center"
    this.context.fillStyle = "white"
    this.context.font = `${this._tipsize}px Airal`
    const hex = this.getPositionImageData(position)
    this.context.fillText(hex, scaleRectangle.x, startY + this._tipsize + 1)
    this.context.restore()
  }

  /// The amplifier consists of three circles
  drawScaleCircleWrapper() {
    const { scaleRadius } = this.options
    this._drawArc(scaleRadius + 2, true, {
      lineWidth: 6,
      strokeStyle: "#979797"
    })
    this._drawArc(scaleRadius, true, {
      lineWidth: 4,
      strokeStyle: "white"
    })
    this._drawArc(scaleRadius - 7, false)
  }
  /// internal fn to draw circle
  _drawArc(radius, useStroke, payload?) {
    const { scaleRectangle, context } = this
    context.beginPath()

    context.arc(
      scaleRectangle.x,
      scaleRectangle.y,
      useStroke ? radius - payload.lineWidth : radius,
      0,
      Math.PI * 2,
      false
    )
    context.closePath()

    if (useStroke) {
      const { lineWidth, strokeStyle } = payload
      context.save()
      context.lineWidth = lineWidth
      context.strokeStyle = strokeStyle
      context.stroke()
      context.restore()
    }
  }

  // draw sights + grid line
  drawSights() {
    const { scaleRadius } = this.options
    const { scaleRectangle } = this
    this.context.save()
    const startX = scaleRectangle.x - scaleRadius
    const endX = scaleRectangle.x + scaleRadius
    const startY = scaleRectangle.y - scaleRadius
    const endY = scaleRectangle.y + scaleRadius
    this.context.lineWidth = 1
    this.context.strokeStyle = "#979797"

    this.context.beginPath()
    // left
    let pointer = scaleRectangle.x - this.gridWidth / 2
    for (; pointer > startX; pointer -= this.gridWidth) {
      this.context.moveTo(pointer, scaleRectangle.y - scaleRadius)
      this.context.lineTo(pointer, scaleRectangle.y + scaleRadius)
    }
    // right
    pointer = scaleRectangle.x + this.gridWidth / 2
    for (; pointer < endX; pointer += this.gridWidth) {
      this.context.moveTo(pointer, scaleRectangle.y - scaleRadius)
      this.context.lineTo(pointer, scaleRectangle.y + scaleRadius)
    }

    // top
    pointer = scaleRectangle.y - this.gridWidth / 2
    for (; pointer > startY; pointer -= this.gridWidth) {
      this.context.moveTo(scaleRectangle.x - scaleRadius, pointer)
      this.context.lineTo(scaleRectangle.x + scaleRadius, pointer)
    }
    // bottom
    pointer = scaleRectangle.y + this.gridWidth / 2
    for (; pointer < endY; pointer += this.gridWidth) {
      this.context.moveTo(scaleRectangle.x - scaleRadius, pointer)
      this.context.lineTo(scaleRectangle.x + scaleRadius, pointer)
    }
    this.context.closePath()

    this.context.stroke()
    this.context.restore()

    // sights
    this._drawArc(this.options.sightRadius, true, {
      lineWidth: 1,
      strokeStyle: "green"
    })
  }
  getPositionImageData(position: { x: number; y: number }) {
    const p = this.context.getImageData(position.x, position.y, 1, 1).data

    const hex = "#" + ("000000" + this.rgbToHex(p[0], p[1], p[2])).slice(-6)
    return hex
  }
  // Fix addEventListener `this`
  onCanvasClick = (e: MouseEvent) => {
    const hex = this.getPositionImageData({ x: e.offsetX, y: e.offsetY })
    this.options.callback && this.options.callback(hex)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMouseLeave = (e: MouseEvent) => {
    this.restoreLastImageData()
  }
  onMouseMove = (e: MouseEvent) => {
    this.restoreLastImageData()
    this.drawScaleCirclePath({
      clientX: e.clientX,
      clientY: e.clientY,
      x: e.offsetX,
      y: e.offsetY
    })
  }

  dispose() {
    if (this.canvas) {
      this.clearPaint()
      this.removeEvents()
      this.canvas = null
      this.context = null
    }
  }

  removeEvents() {
    if (!this.canvas) return
    this.canvas.removeEventListener("mousemove", this.onMouseMove)
    this.canvas.removeEventListener("mouseleave", this.onMouseLeave)
    this.canvas.removeEventListener("click", this.onCanvasClick)
  }

  bindEvents() {
    if (!this.canvas) return
    this.canvas.addEventListener("mousemove", this.onMouseMove)
    this.canvas.addEventListener("mouseleave", this.onMouseLeave)
    this.canvas.addEventListener("click", this.onCanvasClick)
  }

  rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) throw "Invalid color value"

    return ((r << 16) | (g << 8) | b).toString(16)
  }

  clearPaint() {
    this._imageData = null
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  async initial() {
    // if reinit，should initial the canvas & context
    if (!this.context) {
      this._initContext(this.options.id)
    }
    let imgSrc = this.options.imageURL
    if (
      this.options.readImageStrategy.value === "internal" &&
      imgSrc.startsWith("http")
    ) {
      // Fix crossOrigin
      let resource: AxiosResponse<any> = null
      try {
        resource = await axios.get(imgSrc, {
          responseType: "arraybuffer"
        })
      } catch (error) {
        // if not has header `Access-Control-Allow-Origin` use internal middleware to deal with
        resource = await axios.get(this._internalDealCors(imgSrc), {
          responseType: "arraybuffer"
        })
      }
      const u8a = new Uint8Array(resource.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
      imgSrc =
        "data:" + resource.headers["content-type"] + ";base64," + btoa(u8a)
    } else if (this.options.readImageStrategy.value === "custom") {
      imgSrc = this.options.readImageStrategy?.strategy()
    } else {
      imgSrc = this.options.imageURL
    }

    const image = new Image()
    image.crossOrigin = ""
    image.src = imgSrc

    image.onload = () => {
      const ratio = image.width / image.height
      const isWidthMax = image.width > image.height

      let scaleWidth = 0
      let scaleHeight = 0
      if (isWidthMax) {
        scaleWidth = this.canvas.width - this.options.innerPadding
        scaleHeight = scaleWidth / ratio
      } else {
        scaleHeight = this.canvas.height - this.options.innerPadding
        scaleWidth = ratio * scaleHeight
      }

      const centerX = this.canvas.width / 2 - scaleWidth / 2
      const centerY = this.canvas.height / 2 - scaleHeight / 2

      this.context.drawImage(image, centerX, centerY, scaleWidth, scaleHeight)
      this.removeEvents()
      this.bindEvents()
      this.clearRef(image)
    }
  }

  // prevent memory out
  clearRef(ref) {
    if (ref instanceof Image) {
      ref.onload = null
    }
  }
}

export default ColorPickerTool
