<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue"
import { useWeightSmoothing } from "@render/vendors/algorithm/smoothing"
export default defineComponent({
  name: "3d-preview",

  setup: () => {
    const requestText = ref(`获取权限`)
    const selector = str => {
      const el = document.querySelector(str) as HTMLElement
      return el
    }

    const handler = () => {
      // Fix ios
      if (
        window.DeviceOrientationEvent &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === "granted") {
              register()
            } else {
              requestText.value = `denied`
            }
          })
          .catch(err => {
            requestText.value = `Unsupport`
          })
      } else if (window.DeviceOrientationEvent) {
        register()
      } else {
        requestText.value = `Unsupport`
      }
    }

    const maxOffset = 30
    let isRegistered = false
    const clamp = (number, lower, upper) => {
      number = number <= upper ? number : upper
      number = number >= lower ? number : lower
      return number
    }

    onBeforeUnmount(() => {
      window.removeEventListener("deviceorientation", deviceOrientationHandler)
    })
    const init = { x: 0, y: 0, z: 0 }

    let topEl: HTMLElement | null = null
    let bottomEl: HTMLElement | null = null
    onMounted(() => {
      topEl = selector(".top")
      bottomEl = selector(".bottom")
    })
    const smoothingBeta = useWeightSmoothing()
    const smoothingAlpha = useWeightSmoothing()
    const smoothingGamma = useWeightSmoothing()
    const deviceOrientationHandler = (event: DeviceOrientationEvent) => {
      // 以竖屏正面为正方形，垂直屏幕为Z轴，水平为X，垂直为Y，alpha 为Z beta为X gamma 为Y
      // beta -180-180 gamma:-90~90 alpha:0~360
      const { beta, gamma, alpha } = event
      // const x = event.beta;
      // const y = event.gamma;
      // const z = event.alpha;
      const betaS = smoothingBeta(beta)
      const alphaS = smoothingAlpha(alpha)
      const gammaS = smoothingGamma(gamma)

      if (!isRegistered) {
        init.x = beta
        init.y = gamma
        init.z = alpha
      }
      console.log(beta, gamma, alpha, init.x, `=>`, betaS, gammaS, alphaS)

      // const dx = clamp(gamma, -maxOffset, maxOffset);
      if (topEl && bottomEl) {
        const dx = clamp(gammaS / 3, -maxOffset, maxOffset)
        const dy = clamp((betaS - init.x) / 6, -maxOffset, maxOffset)
        topEl.style.transform = `translate(${dx / 2}px, ${dy / 2}px)`
        bottomEl.style.transform = `translate(${dx}px, ${dy}px)`
      }
    }

    const register = () => {
      if (isRegistered) return

      window.addEventListener("deviceorientation", deviceOrientationHandler)

      isRegistered = true
      requestText.value = `SUCCESS`
    }

    return {
      handler,
      requestText
    }
  }
})
</script>

<template>
  <div class="d3-container mx-1 my-1">
    <div class="top"></div>
    <div class="middle"></div>
    <div class="bottom"></div>
  </div>

  <n-button type="primary" class="mx-1 my-1 permission" @click="handler">
    {{ requestText }}
  </n-button>
</template>

<style scoped lang="scss">
.d3-container {
  position: relative;
  width: calc(100vw - 60px);
  height: 42.5vw;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("@render/assets/3d1/fore.png");
    background-size: 100%;
    background-repeat: no-repeat;
    z-index: 300;
  }
  .middle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("@render/assets/3d1/mid.png");
    background-size: 100%;
    background-repeat: no-repeat;
    z-index: 200;
  }
  .bottom {
    position: absolute;
    top: -30px;
    left: -30px;
    width: calc(100% + 60px);
    height: calc(42.5vw + 60px);
    background: url("@render/assets/3d1/back.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    z-index: 100;
  }
}
</style>
