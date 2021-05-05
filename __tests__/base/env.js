describe('test suite', () => {
  test('can load PROJECT_KEY', () => {
    expect(process.env.PROJECT_KEY).toBeDefined();
    expect(process.env.PROJECT_KEY.trim()).not.toEqual('');
  });

  test('can load DB_NAME', () => {
    expect(process.env.DB_NAME).toBeDefined();
    expect(process.env.DB_NAME.trim()).not.toEqual('');
  });
});
