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

  it('DRIVE_NAME', () => {
    const driveName = process?.env?.DRIVE_NAME?.trim();

    expect(driveName).toBeDefined();
    expect(driveName).not.toEqual('');
  });
});
