import React from "react"

export default props => {
  return (
    <div className="m-auto py-4 bg-gray-100 rounded-xl shadow-sm max-w-xs flex justify-center flex-col items-center mx-2 my-2">
      <h1>This is a react component</h1>
      <span>this message is from vue → {props.message}</span>
      <button className="app-normal-button" onClick={props.reset}>
        react组件按钮
      </button>
    </div>
  )
}
