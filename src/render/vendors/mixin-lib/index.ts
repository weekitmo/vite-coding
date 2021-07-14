import ReactWrapper from "./wrappers/react-wrapper"
import VueWrapper from "./wrappers/vue-wrapper"
import VueInReact, {
  babelReactResolver as __vueraReactResolver
} from "./resolvers/react-loader"
import config from "./config"
import ReactInVue from "./resolvers/vue-loader"

export {
  ReactWrapper,
  VueWrapper,
  __vueraReactResolver,
  VueInReact,
  ReactInVue,
  config
}
