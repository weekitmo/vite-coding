<template>
  <router-view class="router-view" v-slot="{ Component }">
    <!-- <component :is="Component" v-if="!route.meta.keepAlive" /> -->
    <component :is="Component" />
    <!-- <transition :name="transitionName">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition> -->
  </router-view>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue"
import { useRouter } from "vue-router"
export default {
  name: "App",

  setup() {
    const router = useRouter()
    onMounted(() =>
      console.log(
        router.currentRoute.value.name,
        router.currentRoute.value.meta.keepAlive
      )
    )
    const state = reactive({
      transitionName: "slide-left"
    })
    router.beforeEach((to, from) => {
      if (to.meta.index > from.meta.index) {
        state.transitionName = "slide-left" // 向左滑动
      } else if (to.meta.index < from.meta.index) {
        // 由次级到主级
        state.transitionName = "slide-right"
      } else {
        state.transitionName = "" // 同级无过渡效果
      }
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
}
#app {
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

.router-view {
  width: 100%;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: 0 auto;
  -webkit-overflow-scrolling: touch;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  height: 100%;
  will-change: transform;
  transition: all 280ms;
  position: absolute;
  backface-visibility: hidden;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
