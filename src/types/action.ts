export enum ActionTypes {
  Set = 'set',
  Trim = 'trim',
  Increment = 'increment',
  Append = 'append',
  Prepend = 'prepend',
}

export class Action {
  public readonly operation: ActionTypes;

  public readonly value: any;

  constructor(action: ActionTypes, value?: any) {
    this.operation = action;
    this.value = value;
  }
}
