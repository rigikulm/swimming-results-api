// Utility functions for when running the code locally

export function isLocal(): boolean {
    return process.env.hasOwnProperty('AWS_SAM_LOCAL');
}