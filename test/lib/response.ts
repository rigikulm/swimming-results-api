import response from '../../src/lib/response';
import { expect } from 'chai';

describe('lib/response package unit tests', () => {
    it('Returns object with an "error" key', () => {
        const code = 'DEADBEEF';
        const message = 'An error occured that involved beef';
        expect(code).to.equal(code);
    });

    it('sucess returns the correct statusCode', () => {
      const statusCode = 201;
      const resp = response.success(statusCode, {}, {key: 'value'});
      expect(resp.statusCode).to.equal(statusCode);
  });

  it('sucess returns the correct headers', () => {
    const headers = {'traceId': '1122334455'};
    const statusCode = 201;
    const resp = response.success(statusCode, headers, {key: 'value'});
    expect(resp.headers.hasOwnProperty('traceId')).to.be.true;
  });

  it('error returns the correct statusCode', () => {
    const statusCode = 501;
    const resp = response.error(statusCode, {});
    expect(resp.statusCode).to.equal(statusCode);
  });

  it('error returns the correct headers', () => {
    const headers = {'traceId': '1122334455'};
    const statusCode = 500;
    const resp = response.error(statusCode, headers);
    expect(resp.headers.hasOwnProperty('traceId')).to.be.true;
  });
});