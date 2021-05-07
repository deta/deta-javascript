import DetaClass from './deta';

export function Deta(projectKey: string): DetaClass {
  const key = projectKey.trim();
  if (!key) {
    throw Error('Project key is not defined');
  }
  return new DetaClass(key);
}
