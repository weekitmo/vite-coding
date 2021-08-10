import { useEffect, useState, useCallback } from "react"
import ValueNotifier from "./value-notifier"

interface ValueListenableCtor<T> {
  valueListenable: ValueNotifier<T>
  builder: (value: T, child: any) => JSX.Element
  child?: JSX.Element
}

export default function ValueListenableBuilder<T>(
  props: ValueListenableCtor<T>
) {
  const [_value, setValue] = useState(props.valueListenable.value)
  let child = null
  useEffect(() => {
    child = props.child ?? null
    props.valueListenable.changeNotify.addListener(_valueChanged)
    return () => {
      // dispose
      props.valueListenable.changeNotify.removeListener(_valueChanged)
    }
  }, [])

  const _valueChanged = useCallback(v => {
    setValue(v)
  }, [])

  return <>{props.builder(_value, child)}</>
}
