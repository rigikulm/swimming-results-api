import { isSwimmingEvent, SwimmingEventType} from '../../src/lib/swimming-events';
import { expect } from 'chai';

describe('lib/swimming-events package unit tests', () => {
    it('Returns object with an "error" key', () => {
        const code = 'DEADBEEF';
        const message = 'An error occured that involved beef';
        expect(code).to.equal(code);
    });

    it('FREE50SCYD is a valid swimming event', () => {
        let eventId = 'FREE50SCYD';
        expect(isSwimmingEvent(eventId)).to.be.true;
    });

    it('FREE50LCYD is NOT a valid swimming event', () => {
        let eventId = 'FREE50LCYD';
        expect(isSwimmingEvent(eventId)).to.be.false;
    });

    it('free50SCYD is NOT a valid swimming event', () => {
        let eventId = 'free50SCYD';
        expect(isSwimmingEvent(eventId)).to.be.false;
    });

    it('A number is NOT a valid swimming event', () => {
        let eventId: number = 1;
        expect(isSwimmingEvent(eventId)).to.be.false;
    });

    it('A number is NOT a valid swimming event', () => {
        let eventId = 0;
        expect(isSwimmingEvent(eventId)).to.be.false;
    });

    it('BREAST200SCM is a valid swimming event', () => {
        let eventId = 'BREAST200SCM';
        expect(isSwimmingEvent(eventId)).to.be.true;
    });

    it('BACK200LCM is a valid swimming event', () => {
        let eventId = 'BACK200LCM';
        expect(isSwimmingEvent(eventId)).to.be.true;
    });

});