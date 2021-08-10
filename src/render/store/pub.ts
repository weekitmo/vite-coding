// const queue = {};
// export const broadcast = (name, state) => {
//   if (!queue[name]) return;
//   queue[name].forEach((fn) => fn(state));
// };
// export const subScribe = (name, cb) => {
//   if (!queue[name]) queue[name] = [];
//   queue[name].push(cb);
// };
// export const unSubScribe = (name, cb) => {
//   if (!queue[name]) return;
//   const index = queue[name].indexOf(cb);
//   if (index !== -1) queue[name].splice(index, 1);
// };
type Subscriber<T> = (data: T) => void
export type ModelHook<T = any, P = any> = (hookArg: P) => T

export class Container<T = unknown> {
  constructor(public hook: ModelHook<T>) {}
  subscribers = new Set<Subscriber<T>>()
  data!: T

  notify() {
    for (const subscriber of this.subscribers) {
      subscriber(this.data)
    }
  }
}
