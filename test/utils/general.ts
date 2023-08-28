import sinon, { SinonFakeTimers } from 'sinon';

let clock: SinonFakeTimers | undefined;

export function mockSystemTime(): void {
  const date = new Date();
  date.setSeconds(date.getSeconds() + 60);
  clock = sinon.useFakeTimers(date);
}

export function useRealTime(): void {
  if (clock) {
    clock.restore();
  }
}