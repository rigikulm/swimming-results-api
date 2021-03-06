// Defines constants and types for the supported Swimming events

export enum SwimmingEvents {
    FREE50SCYD = 'Free50SCYD',
    FREE100SCYD = 'Free100SCYD',
    FREE200SCYD = 'Free200SCYD',
    FREE50SCM = 'Free50SCM',
    FREE100SCM = 'Free100SCM',
    FREE200SCM = 'Free200SCM',
    FREE50LCM = 'Free50LCM',
    FREE100LCM = 'Free100LCM',
    FREE200LCM = 'Free200LCM',
    BACK50SCYD = 'Back50SCYD',
    BACK100SCYD = 'Back100SCYD',
    BACK200SCYD = 'Back200SCYD',
    BACK50SCM = 'Back50SCM',
    BACK100SCM = 'Back100SCM',
    BACK200SCM = 'Back200SCM',
    BACK50LCM = 'Back50LCM',
    BACK100LCM = 'Back100LCM',
    BACK200LCM = 'Back200LCM',
    BREAST50SCYD = 'Breast50SCYD',
    BREAST100SCYD = 'Breast100SCYD',
    BREAST200SCYD = 'Breast200SCYD',
    BREAST50SCM = 'Breast50SCM',
    BREAST100SCM = 'Breast100SCM',
    BREAST200SCM = 'Breast200SCM',
    BREAST50LCM = 'Breast50LCM',
    BREAST100LCM = 'Breast100LCM',
    BREAST200LCM = 'Breast200LCM',
    FLY50SCYD = 'Fly50SCYD',
    FLY100SCYD = 'Fly100SCYD',
    FLY200SCYD = 'Fly200SCYD',
    FLY50SCM = 'Fly50SCM',
    FLY100SCM = 'Fly100SCM',
    FLY200SCM = 'Fly200SCM',
    FLY50LCM = 'Fly50LCM',
    FLY100LCM = 'Fly100LCM',
    FLY200LCM = 'Fly200LCM'
};

//export type SwimmingEventType = `${SwimmingEvents}`;
export type SwimmingEventType = keyof typeof SwimmingEvents

export function isSwimmingEvent(arg: unknown): arg is SwimmingEventType {
    return (typeof arg === 'string' && arg in SwimmingEvents);
}