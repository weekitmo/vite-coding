import { ReactWrapper } from '../index'

export default function VueResolver (component) {
  return {
    components: { ReactWrapper },
    props: ['passedProps'],
    inheritAttrs: false,
    render (createElement) {
      return createElement(
        'react-wrapper',
        {
          props: {
            component,
            passedProps: this.$props.passedProps,
          },
          attrs: this.$attrs,
          on: this.$listeners,
        },
        this.$slots.default
      )
    },
  }
}
