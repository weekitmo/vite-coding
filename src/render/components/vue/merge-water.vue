<template>
  <div class="water-widget flex flex-col items-center">
    <canvas id="water"></canvas>
    <n-button type="primary" class="mx-1 my-1" @click="reset">重置</n-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core"

let MOUSE_INFLUENCE = 5,
  GRAVITY_X = 0,
  GRAVITY_Y = 0,
  MOUSE_REPEL = false,
  GROUPS = [20, 20, 20],
  GROUP_COLOURS = ["rgba(97,160,232"]

window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback: Function) {
    return setTimeout(callback, 1000 / 60)
  }

const fluid = (function () {
  let ctx = null,
    width,
    height,
    num_x,
    num_y,
    particles = [],
    grid = [],
    meta_ctx = null,
    threshold = 220,
    play = false,
    spacing = 45,
    radius = 30,
    limit = radius * 0.66,
    textures = [],
    num_particles

  let mouse = {
    down: false,
    x: 0,
    y: 0
  }

  let process_image = function () {
    let imageData = meta_ctx.getImageData(0, 0, width, height),
      pix = imageData.data

    for (let i = 0, n = pix.length; i < n; i += 4) {
      pix[i + 3] < threshold && (pix[i + 3] /= 6)
    }

    ctx.putImageData(imageData, 0, 0)
  }

  let run = function () {
    //let time = new Date().getTime();
    meta_ctx.clearRect(0, 0, width, height)

    for (let i = 0, l = num_x * num_y; i < l; i++) grid[i].length = 0

    let i = num_particles
    while (i--) particles[i].first_process()
    i = num_particles
    while (i--) particles[i].second_process()

    process_image()

    if (mouse.down) {
      ctx.canvas.style.cursor = "none"

      ctx.fillStyle = "rgba(97, 160, 232, 0.05)"
      ctx.beginPath()
      ctx.arc(mouse.x, mouse.y, radius * MOUSE_INFLUENCE, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = "rgba(97, 160, 232, 0.05)"
      ctx.beginPath()
      ctx.arc(mouse.x, mouse.y, (radius * MOUSE_INFLUENCE) / 3, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
    } else ctx.canvas.style.cursor = "default"

    if (play) window.requestAnimFrame(run)
  }

  let Particle = function (type, x, y) {
    this.type = type
    this.x = x
    this.y = y
    this.px = x
    this.py = y
    this.vx = 0
    this.vy = 0
  }

  Particle.prototype.first_process = function () {
    let g =
      grid[Math.round(this.y / spacing) * num_x + Math.round(this.x / spacing)]

    if (g) g.close[g.length++] = this

    this.vx = this.x - this.px
    this.vy = this.y - this.py

    if (mouse.down) {
      let dist_x = this.x - mouse.x
      let dist_y = this.y - mouse.y
      let dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y)
      if (dist < radius * MOUSE_INFLUENCE) {
        let cos = dist_x / dist
        let sin = dist_y / dist
        this.vx += MOUSE_REPEL ? cos : -cos
        this.vy += MOUSE_REPEL ? sin : -sin
      }
    }

    this.vx += GRAVITY_X
    this.vy += GRAVITY_Y
    this.px = this.x
    this.py = this.y
    this.x += this.vx
    this.y += this.vy
  }

  Particle.prototype.second_process = function () {
    let force = 0,
      force_b = 0,
      cell_x = Math.round(this.x / spacing),
      cell_y = Math.round(this.y / spacing),
      close = []

    for (let x_off = -1; x_off < 2; x_off++) {
      for (let y_off = -1; y_off < 2; y_off++) {
        let cell = grid[(cell_y + y_off) * num_x + (cell_x + x_off)]
        if (cell && cell.length) {
          for (let a = 0, l = cell.length; a < l; a++) {
            let particle = cell.close[a]
            if (particle != this) {
              let dfx = particle.x - this.x
              let dfy = particle.y - this.y
              let distance = Math.sqrt(dfx * dfx + dfy * dfy)
              if (distance < spacing) {
                let m = 1 - distance / spacing
                force += Math.pow(m, 2)
                force_b += Math.pow(m, 3) / 2
                particle.m = m
                particle.dfx = (dfx / distance) * m
                particle.dfy = (dfy / distance) * m
                close.push(particle)
              }
            }
          }
        }
      }
    }

    force = (force - 3) * 0.5

    for (let i = 0, l = close.length; i < l; i++) {
      let neighbor = close[i]

      let press = force + force_b * neighbor.m
      if (this.type != neighbor.type) press *= 0.35

      let dx = neighbor.dfx * press * 0.5
      let dy = neighbor.dfy * press * 0.5

      neighbor.x += dx
      neighbor.y += dy
      this.x -= dx
      this.y -= dy
    }

    if (this.x < limit) this.x = limit
    else if (this.x > width - limit) this.x = width - limit

    if (this.y < limit) this.y = limit
    else if (this.y > height - limit) this.y = height - limit

    this.draw()
  }

  Particle.prototype.draw = function () {
    let size = radius * 2

    meta_ctx.drawImage(
      textures[this.type],
      this.x - radius,
      this.y - radius,
      size,
      size
    )
  }

  return {
    init: function (canvasId, w, h) {
      particles = []
      grid = []
      textures = []

      let canvas = document.getElementById(canvasId) as HTMLCanvasElement
      ctx = canvas.getContext("2d")
      canvas.height = h || window.innerHeight
      canvas.width = w || window.innerWidth
      width = canvas.width
      height = canvas.height

      let meta_canvas = document.createElement("canvas")
      meta_canvas.width = width
      meta_canvas.height = height
      meta_ctx = meta_canvas.getContext("2d")

      for (let i = 0; i < GROUPS.length; i++) {
        let colour

        if (GROUP_COLOURS[i]) {
          colour = GROUP_COLOURS[i]
        } else {
          colour = "hsla(" + Math.round(Math.random() * 360) + ", 80%, 60%"
        }

        textures[i] = document.createElement("canvas")
        textures[i].width = radius * 2
        textures[i].height = radius * 2
        let nctx = textures[i].getContext("2d")

        let grad = nctx.createRadialGradient(
          radius,
          radius,
          1,
          radius,
          radius,
          radius
        )

        grad.addColorStop(0, colour + ",1)")
        grad.addColorStop(1, colour + ",0)")
        nctx.fillStyle = grad
        nctx.beginPath()
        nctx.arc(radius, radius, radius, 0, Math.PI * 2, true)
        nctx.closePath()
        nctx.fill()
      }

      canvas.onmousedown = function (e) {
        mouse.down = true
        return false
      }

      canvas.onmouseup = function (e) {
        mouse.down = false
        return false
      }

      canvas.onmousemove = function (e) {
        let rect = canvas.getBoundingClientRect()
        mouse.x = e.clientX - rect.left
        mouse.y = e.clientY - rect.top
        return false
      }

      num_x = Math.round(width / spacing) + 1
      num_y = Math.round(height / spacing) + 1

      for (let i = 0; i < num_x * num_y; i++) {
        grid[i] = {
          length: 0,
          close: []
        }
      }

      for (let i = 0; i < GROUPS.length; i++) {
        for (let k = 0; k < GROUPS[i]; k++) {
          particles.push(
            new Particle(
              i,
              radius + Math.random() * (width - radius * 2),
              radius + Math.random() * (height - radius * 2)
            )
          )
        }
      }

      num_particles = particles.length

      play = true
      run()
    },

    stop: function () {
      play = false
    }
  }
})()

onMounted(() => {
  fluid.init("water", 800, 376)
})

const reset = () => {
  fluid.stop()
  setTimeout(function () {
    fluid.init("c", 800, 376)
  }, 100)
}
</script>

<style scoped></style>
