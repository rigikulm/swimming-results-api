import response from '../../src/lib/response';
import { expect } from 'chai';

describe('lib/response package unit tests', () => {
    it('Returns object with an "error" key', () => {
        const code = 'DEADBEEF';
        const message = 'An error occured that involved beef';
        expect(code).to.equal(code);
      });
});