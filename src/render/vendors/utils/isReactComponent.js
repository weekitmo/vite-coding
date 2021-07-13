export default function isReactComponent(component) {
  if (typeof component === "object" && !isReactForwardReference(component)) {
    return false;
  }

  return true;
}

function isReactForwardReference(component) {
  return (
    component.$$typeof &&
    component.$$typeof.toString() === "Symbol(react.forward_ref)"
  );
}
