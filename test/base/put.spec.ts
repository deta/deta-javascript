import { expect } from 'chai';
import { Base } from '../../src/index.node';
import { DetaType } from '../../src/types/basic';
import { PutOptions } from '../../src/types/base/request';
import { Day } from '../../src/utils/date';
import { BaseGeneral } from '../../src/constants/general';
import { mockSystemTime, useRealTime } from '../utils/general';
import { BASE_NAME } from '../utils/constants';

const db = Base(BASE_NAME);

describe('Base#put', () => {
    before(() => {
        mockSystemTime();
    });

    after(() => {
        useRealTime();
    });

    it('by only passing data, without key', async () => {
        const testCases = [
            [{name: 'alex', age: 77}, {name: 'alex', age: 77}],
            ['hello, worlds', {value: 'hello, worlds'}],
            [7, {value: 7}]
        ];

        for (const [input, expected] of testCases) {
            const data = await db.put(input);
            expect(data).to.deep.include(expected);
            const deleteRes = await db.delete(data?.key as string);
            expect(deleteRes).to.be.null;
        }
    });

    it('by passing data and key in object itself', async () => {
        const input = { name: 'alex', age: 77, key: 'put_one' };
        const data = await db.put(input);
        expect(data).to.deep.equal(input);
        const deleteRes = await db.delete(data?.key as string);
        expect(deleteRes).to.be.null;
    });

    it('by passing data as first parameter and key as second parameter', async () => {
        const testCases = [
            [{ name: 'alex', age: 77 }, 'put_two', { name: 'alex', age: 77, key: 'put_two' }],
            ['hello, worlds', 'put_three', { value: 'hello, worlds', key: 'put_three' }],
            [7, 'put_four', { value: 7, key: 'put_four' }],
            [['a', 'b', 'c'], 'put_my_abc', { value: ['a', 'b', 'c'], key: 'put_my_abc' }],
            [{ key: 'put_hello', value: ['a', 'b', 'c'] }, 'put_my_abc', { value: ['a', 'b', 'c'], key: 'put_my_abc' }],
            [{ key: 'put_hello', world: ['a', 'b', 'c'] }, 'put_my_abc', { world: ['a', 'b', 'c'], key: 'put_my_abc' }]
        ];

        for (const [value, key, expected] of testCases) {
            const data = await db.put(value, key as string);
            expect(data).to.deep.equal(expected);
            const deleteRes = await db.delete(data?.key as string);
            expect(deleteRes).to.be.null;
        }
    });

    it('put data with expireIn option', async () => {
        const value = { name: 'alex', age: 77 };
        const key = 'put_two';
        const options = { expireIn: 5 };
        const expected = { 
            name: 'alex', 
            age: 77, 
            key, 
            [BaseGeneral.TTL_ATTRIBUTE]: new Day().addSeconds(5).getEpochSeconds() 
        };

        const data = await db.put(value, key, options);
        expect(data).to.deep.equal(expected);
        const deleteRes = await db.delete(data?.key as string);
        expect(deleteRes).to.be.null;
    });

    it('put data with expireAt option', async () => {
        const value = 'hello, worlds';
        const key = 'put_three';
        const options = { expireAt: new Date() };
        const expected = { 
            value: 'hello, worlds', 
            key, 
            [BaseGeneral.TTL_ATTRIBUTE]: new Day().getEpochSeconds() 
        };

        const data = await db.put(value, key, options);
        expect(data).to.deep.equal(expected);
        const deleteRes = await db.delete(data?.key as string);
        expect(deleteRes).to.be.null;
    });

    it('by passing data as first parameter, key as second parameter and invalid options as third parameter', async () => {
        const testCases = [
            [['a', 'b', 'c'], 'put_my_abc', { expireIn: 5, expireAt: new Date() }, new Error("can't set both expireIn and expireAt options")],
            [['a', 'b', 'c'], 'put_my_abc', { expireIn: 'invalid' }, new Error('option expireIn should have a value of type number')],
            [['a', 'b', 'c'], 'put_my_abc', { expireAt: 'invalid' }, new Error('option expireAt should have a value of type number or Date')],
            [['a', 'b', 'c'], 'put_my_abc', { expireIn: new Date() }, new Error('option expireIn should have a value of type number')],
            [['a', 'b', 'c'], 'put_my_abc', { expireIn: {} }, new Error('option expireIn should have a value of type number')],
            [['a', 'b', 'c'], 'put_my_abc', { expireIn: [] }, new Error('option expireIn should have a value of type number')],
            [['a', 'b', 'c'], 'put_my_abc', { expireAt: {} }, new Error('option expireAt should have a value of type number or Date')],
            [['a', 'b', 'c'], 'put_my_abc', { expireAt: [] }, new Error('option expireAt should have a value of type number or Date')],
        ];

        for (const [value, key, options, expected] of testCases) {
          try {
              const data = await db.put(value as DetaType, key as string, options as PutOptions);
              expect(data).to.be.null;
          } catch (err) {
              if (expected instanceof Error) {
                  expect(err.message).to.equal(expected.message);
              }
          }
        }
    });
});
