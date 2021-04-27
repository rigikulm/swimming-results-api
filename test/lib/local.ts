import { isLocal } from '../../src/lib/local';
import { expect } from 'chai';

const SAM_LOCAL = 'AWS_SAM_LOCAL';

describe('lib/local package unit tests', () => {
    beforeEach(() => {
        if (process.env.hasOwnProperty(SAM_LOCAL)) {
            delete process.env[SAM_LOCAL];
        }
    });

    it('Should return false when AWS_SAM_LOCAL is not set', () => {
        const result = isLocal();
        expect(result).to.be.false;
    });

    it('Should return true when AWS_SAM_LOCAL is set', () => {
        process.env[SAM_LOCAL] = 'true';
        const result = isLocal();
        expect(result).to.be.true;
    });
});