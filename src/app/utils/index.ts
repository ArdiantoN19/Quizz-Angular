// Password must have at least 1 capital character, 1 small character, and 1 number
export const patternPassword: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/