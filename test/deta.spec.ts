import { expect } from 'chai';
import { Deta } from '../src/index.node';

describe('Deta', () => {
  const testCases = [
    ['   ', new Error('Project key is not defined')],
    ['', new Error('Project key is not defined')],
    [null, new Error('Project key is not defined')],
    [undefined, new Error('Project key is not defined')],
  ];

  testCases.forEach(([name, expected]) => {
    it(`invalid project key Deta("${name}")`, () => {
      try {
        const deta = Deta(name as string);
        expect(deta).to.not.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });
});

describe('Deta#Base', () => {
  const testCases = [
    ['   ', new Error('Base name is not defined')],
    ['', new Error('Base name is not defined')],
    [null, new Error('Base name is not defined')],
    [undefined, new Error('Base name is not defined')],
  ];

  testCases.forEach(([name, expected]) => {
    it(`invalid base name Base("${name}")`, () => {
      try {
        const base = Deta().Base(name as string);
        expect(base).to.not.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });
});

describe('Deta#Drive', () => {
  const testCases = [
    ['   ', new Error('Drive name is not defined')],
    ['', new Error('Drive name is not defined')],
    [null, new Error('Drive name is not defined')],
    [undefined, new Error('Drive name is not defined')],
  ];

  testCases.forEach(([name, expected]) => {
    it(`invalid base name Drive("${name}")`, () => {
      try {
        const base = Deta().Drive(name as string);
        expect(base).to.not.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });
});
