export function mockSystemTime() {
  jest.useFakeTimers('modern');
  const date = new Date();
  date.setSeconds(date.getSeconds() + 60);
  jest.setSystemTime(date);
}

export function useRealTime() {
  jest.useRealTimers();
}
