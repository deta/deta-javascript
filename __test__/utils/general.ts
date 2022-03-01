export function mockSystemTime() {
  jest.useFakeTimers('modern');
  const date = new Date();
  jest.setSystemTime(date);
}

export function useRealTime() {
  jest.useRealTimers();
}
