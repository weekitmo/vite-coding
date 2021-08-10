interface Listenable<T> {
  get value(): T

  changeNotify: ChangeNotifier<T>
}

export default class ValueNotifier<T> implements Listenable<T> {
  private _value: T
  public changeNotify: ChangeNotifier<T>
  constructor(option: T) {
    this._value = option
    this.changeNotify = new ChangeNotifier<T>()
  }
  get value(): T {
    return this._value
  }

  set value(newValue: T) {
    if (this._value == newValue) {
      return
    }

    this._value = newValue
    this.changeNotify.notifyListeners(this._value)
  }
}

type VoidCallback<T> = (data: T) => void

class ChangeNotifier<T> {
  private _listeners = new Set<VoidCallback<T>>()

  addListener(entry: VoidCallback<T>) {
    this._listeners.add(entry)
  }

  removeListener(entry: VoidCallback<T>) {
    this._listeners.delete(entry)
  }

  dispose() {
    this._listeners.clear()
    this._listeners = null
  }

  notifyListeners(v: T) {
    for (const subscriber of this._listeners) {
      subscriber(v)
    }
  }
}
