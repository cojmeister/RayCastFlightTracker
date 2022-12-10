export class InvalidAPIKeyError extends Error {
  __proto__ = Error;
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, InvalidAPIKeyError.prototype);
  }
}

export class InvalidRequestError extends Error {
  __proto__ = Error;
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, InvalidAPIKeyError.prototype);
  }
}

export class TrackingNumberError extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, TrackingNumberError.prototype);
  }
}
