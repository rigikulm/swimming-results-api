import {SwimResult, createSwimResult} from '../../src/models/swimming-result';
import { expect } from 'chai';
import { inspect } from 'util';

describe('models/swimming-result package unit tests', () => {
  it('Return a swimming result without a meet', () => {
    const body = {
      eventId: 'FREE50SCYD',
      eventTime: 11223344,
      eventDate: '2021-05-26'
    };

    let { result, error } = createSwimResult(JSON.stringify(body));
    console.log(result);
    expect(result).to.not.be.null;
    expect(error).to.be.undefined;
    if (result) {
      expect(result.eventId).to.equal(body.eventId);
    }
  });

  it('Return a swimming result with a meet', () => {
    const body = {
      eventId: 'FREE50SCYD',
      eventTime: 11223344,
      eventDate: '2021-05-26',
      meet: 'LAC May Time Trials'
    };

    let { result, error } = createSwimResult(JSON.stringify(body));
    expect(result).to.not.be.null;
    expect(error).to.be.undefined;
    expect(result!.eventId).to.equal(body.eventId);
    expect(result!.eventTime).to.equal(body.eventTime);
    expect(result!.meet).to.equal(body.meet);
  });

  it('Return an invalid eventDate error', () => {
    const body = {
      eventId: 'FREE50SCYD',
      eventTime: 11223344,
      eventDate: '05/26/2021',
      meet: 'LAC May Time Trials'
    };

    let { result, error } = createSwimResult(JSON.stringify(body));
    expect(result).to.be.null;
    expect(error).not.to.be.undefined;
    console.log(`error--> ${inspect(error)}`);
    expect(error.details[0].message).to.equal('"eventDate" must be in iso format');
    
    //expect(result).to.equal({});
  });

  it('Return an invalid eventId error', () => {
    const body = {
      eventId: 'FREE50SCFT',
      eventTime: 11223344,
      eventDate: '2021-05-26',
      meet: 'LAC May Time Trials'
    };

    let { result, error } = createSwimResult(JSON.stringify(body));
    expect(result).to.be.null;
    expect(error).not.to.be.undefined;
    console.log(`error--> ${inspect(error)}`);
    expect(error.details[0].message).to.equal('"eventId" contains an invalid value');
  });
});
