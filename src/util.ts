import { Item, Priced } from './types';

export function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined
}

export function isPriced(x: any): x is Priced {
  return x.hasOwnProperty('unitPrice');
}

export function round(x: number, decimalPlaces: number = 2) {
  const mult = Math.pow(10, decimalPlaces);
  return Math.round(x * mult) / mult;
}
