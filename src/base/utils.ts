import { Day } from '../utils/date';
import { isNumber } from '../utils/number';
import { Action, ActionTypes } from '../types/action';
import { ArrayType, BasicType } from '../types/basic';
import { isUndefinedOrNull } from '../utils/undefinedOrNull';

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
  if (isUndefinedOrNull(expireIn) && isUndefinedOrNull(expireAt)) {
    return {};
  }

  if (!isUndefinedOrNull(expireIn) && !isUndefinedOrNull(expireAt)) {
    return { error: new Error("can't set both expireIn and expireAt options") };
  }

  if (!isUndefinedOrNull(expireIn)) {
    if (!isNumber(expireIn)) {
      return {
        error: new Error('option expireIn should have a value of type number'),
      };
    }
    return { ttl: new Day().addSeconds(expireIn as number).getEpochSeconds() };
  }

  if (!(isNumber(expireAt) || expireAt instanceof Date)) {
    return {
      error: new Error(
        'option expireAt should have a value of type number or Date'
      ),
    };
  }

  if (expireAt instanceof Date) {
    return { ttl: new Day(expireAt).getEpochSeconds() };
  }

  return { ttl: expireAt as number };
}
