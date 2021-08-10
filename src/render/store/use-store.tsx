import ValueNotifier from "./value-notifier"

class UserModel {
  constructor(public name: string, public age: number) {}
}

export class Store {
  static message: ValueNotifier<string> = new ValueNotifier("Hello word")
  static list: ValueNotifier<any[]> = new ValueNotifier([])
  static user: ValueNotifier<UserModel> = new ValueNotifier(
    new UserModel("", 0)
  )
}
