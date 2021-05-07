describe('can load env', () => {
  it('PROJECT_KEY', () => {
    const projectKey = process?.env?.PROJECT_KEY?.trim();

    expect(projectKey).toBeDefined();
    expect(projectKey).not.toEqual('');
  });

  it('DB_NAME', () => {
    const dbName = process?.env?.DB_NAME?.trim();

    expect(dbName).toBeDefined();
    expect(dbName).not.toEqual('');
  });
});
