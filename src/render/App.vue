<template>
  <div class="logo-box">
    <img
      style="height: 200px"
      src="./assets/electron.png"
      alt="Electron logo"
    />
    <img alt="Vue logo" src="./assets/logo.png" />
  </div>
  <HelloWorld msg="Electron@12、Vue@3、Vite@2" />
  <span>{{ count }}</span>
  <react :component="rComponent" :message="message" :reset="onCallback"></react>
  <div class="sizebox"></div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import ReactFc from "./components/react/fc.tsx";
import { ReactWrapper } from "./vendors/index";

export default {
  name: "App",
  components: {
    HelloWorld,
    react: ReactWrapper,
  },
  data() {
    return {
      rComponent: ReactFc,
      message: ``,
      baseMessage: `vue component use react`,
      count: 0,
    };
  },
  created() {
    this.message = this.baseMessage;
  },
  methods: {
    onCallback() {
      console.log(`click ${this.message}`);
      this.count++;
      this.message = this.baseMessage + this.count;
    },
  },
};
</script>

<style>
.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
}
.sizebox {
  padding: 10px;
}
</style>
