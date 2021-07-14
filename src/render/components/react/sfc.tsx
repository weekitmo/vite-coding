import React from "react";

export default (props) => {
  return (
    <div>
      <h1>I'm a react component</h1>
      <span>{props.message}</span>
      <button onClick={props.reset}>按钮</button>
    </div>
  );
};
