export const validation = {
  required: value => (value || typeof value === 'number' ? undefined : 'Required'),
  maxLength: (max) => value => (
    value && value.length > max ? `Must be ${max} characters or less` : undefined),
  maxLength15: () => this.maxLength(15),
  // maxLength5: () => this.maxLength(5),
  minLength:  (min) => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined,
  minLength2: () => this.minLength(2),
  number: value =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined,
  minValue: min => value =>
  value && value < min ? `Must be at least ${min}` : undefined,
  minValue13: () => this.minValue(13),
  email: value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address' : undefined,
  tooYoung: value =>
    value && value < 13
      ? 'You do not meet the minimum age requirement!'
      : undefined,
  aol: value =>
    value && /.+@aol\.com/.test(value)
        ? 'Really? You still use AOL for your email?'
        : undefined,
  alphaNumeric : value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
      ? 'Only alphanumeric characters'
      : undefined,
  phoneNumber: value =>
    value && !/^(0|[1-9][0-9]{9})$/i.test(value)
      ? 'Invalid phone number, must be 10 digits'
      : undefined
}

