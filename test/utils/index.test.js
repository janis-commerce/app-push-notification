import {
  isArray,
  isFunction,
  isObject,
  isString,
  isBoolean,
  isNumber,
  promiseWrapper,
  prepareEventsToSubscribe,
} from '../../lib/utils';

describe('utils', () => {
  describe('messaging utils', () => {
    describe('prepareEventsToSubscribe', () => {
      it('should return an array of events', () => {
        const events = prepareEventsToSubscribe(['event1', 'event2', 3, null]);
        expect(events).toEqual(['event1', 'event2']);
      });

      it('should return an empty array if no events are provided', () => {
        const events = prepareEventsToSubscribe();
        expect(events).toEqual([]);
      });

      it('should return an array of events if a single event is provided', () => {
        const events = prepareEventsToSubscribe('event1');
        expect(events).toEqual(['event1']);
      });
    });
  });
  describe('utils from apps helpers', () => {
    describe('isArray returns a boolean', () => {
      it('returns true if receive a valid array', () => {
        expect(isArray(['array', 1])).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isArray('array')).toBe(false);
      });
    });

    describe('isFunction returns a boolean', () => {
      it('returns true if receive a valid function', () => {
        const mockedFunction = jest.fn();

        expect(isFunction(mockedFunction)).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isFunction('function')).toBe(false);
      });
    });

    describe('isObject returns a boolean', () => {
      it('returns true if receive a valid object', () => {
        const mockedObject = {name: 'push-notification', version: '1.0.0'};

        expect(isObject(mockedObject)).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isObject('object')).toBe(false);
      });
    });

    describe('isString returns a boolean', () => {
      it('returns true if receive a valid object', () => {
        expect(isString('string')).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isString(null)).toBe(false);
      });
    });

    describe('isNumber returns a boolean', () => {
      it('returns true if receive a valid number', () => {
        expect(isNumber(10)).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isNumber(null)).toBe(false);
      });
    });

    describe('isBoolean returns a boolean', () => {
      it('returns true if receive a valid number', () => {
        expect(isBoolean(true)).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isBoolean(null)).toBe(false);
      });
    });

    describe('promiseWrapper', () => {
      describe('return error', () => {
        it('with promise called catch', async () => {
          const promise = await promiseWrapper(
            Promise.reject(new Error('called catch')),
          );
          expect(promise).toEqual(expect.any(Array));
          const [data, error] = promise;
          expect(data).toBe(null);
          expect(error).toEqual(expect.any(Object));
        });
      });

      describe('return data', () => {
        it('with promise correct', async () => {
          const prom = () =>
            new Promise((resolve) => resolve({name: 'Janis Picking'}));
          const promise = await promiseWrapper(prom());
          const [data, error] = promise;
          expect(promise).toEqual(expect.any(Array));
          expect(data).toEqual(expect.any(Object));
          expect(error).toBe(null);
        });
      });
    });
  });
});
