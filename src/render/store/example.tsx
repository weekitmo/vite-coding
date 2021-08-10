import { useCallback } from "react"
import { useHistory } from "react-router-dom"
import { css } from "@emotion/css"
import ValueListenableBuilder from "./value-listenable-builder"
import { Store } from "./use-store"

const cssBlackText = css`
  color: #000;
`

export function Example(props) {
  console.log(`build example1`)
  const history = useHistory()
  const toNext = useCallback(() => {
    history.push("/")
  }, [history])

  const change = () => {
    Store.message.value = btoa(Math.random().toString())
  }

  const BuildWidget = ValueListenableBuilder<string>({
    valueListenable: Store.message,
    builder: (value, child) => {
      return (
        <div className="show-info">
          <span className={cssBlackText}>{value}</span>
        </div>
      )
    }
  })

  return (
    <div className="flex-col">
      {BuildWidget}

      <button className="justify-center base-btn align-center" onClick={change}>
        change
      </button>

      <button className="justify-center base-btn align-center" onClick={toNext}>
        to next
      </button>
    </div>
  )
}

export function ExampleNext(props) {
  console.log(`build example next`)
  const _builder = useCallback((value: string[], child) => {
    return (
      <ul className="show-info-ul">
        {value.map(item => (
          <li>
            <span className={cssBlackText}>{item}</span>
          </li>
        ))}
      </ul>
    )
  }, [])
  const toBack = () => {
    history.back()
  }

  const BuildWidget = ValueListenableBuilder<string[]>({
    valueListenable: Store.list,
    builder: _builder
  })

  const increment = () => {
    const temp = [...Store.list.value, `item${Store.list.value.length}`]

    Store.list.value = temp
  }

  const change = () => {
    Store.message.value = btoa(Math.random().toString())
  }
  return (
    <div className="flex-col">
      <ValueListenableBuilder<string>
        valueListenable={Store.message}
        builder={(value, child) => (
          <span className={cssBlackText}>{value}</span>
        )}
      />
      {BuildWidget}

      <button
        className="justify-center base-btn align-center"
        onClick={increment}>
        increment
      </button>

      <button className="justify-center base-btn align-center" onClick={change}>
        change
      </button>
      <button className="justify-center base-btn align-center" onClick={toBack}>
        back
      </button>
    </div>
  )
}
