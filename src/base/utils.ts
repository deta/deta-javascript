import { Day } from '../utils/date';
import { Action, ActionTypes } from '../types/action';
import { ArrayType, BasicType } from '../types/basic';

export default class BaseUtils {
  public trim(): Action {
    return new Action(ActionTypes.Trim);
  }

  public increment(value: number = 1): Action {
    return new Action(ActionTypes.Increment, value);
  }

  public append(value: BasicType | ArrayType): Action {
    return new Action(
      ActionTypes.Append,
      Array.isArray(value) ? value : [value]
    );
  }

  public prepend(value: BasicType | ArrayType): Action {
    return new Action(
      ActionTypes.Prepend,
      Array.isArray(value) ? value : [value]
    );
  }
}

interface TTLResponse {
  ttl?: number;
  error?: Error;
}

/**
 * getTTL computes and returns ttl value based on expireIn and expireAt params.
 * expireIn and expireAt are optional params.
 *
 * @param {number} [expireIn]
 * @param {Date | number} [expireAt]
 * @returns {TTLResponse}
 */
export function getTTL(
  expireIn?: number,
  expireAt?: Date | number
): TTLResponse {
  if (!expireIn && !expireAt) {
    return {};
  }

  if (expireIn && expireAt) {
    return { error: new Error("can't set both expireIn and expireAt") };
  }

  if (expireIn) {
    return { ttl: new Day().addSeconds(expireIn).getEpochSeconds() };
  }

  if (expireAt && expireAt instanceof Date) {
    return { ttl: new Day(expireAt).getEpochSeconds() };
  }

  return { ttl: expireAt };
}
