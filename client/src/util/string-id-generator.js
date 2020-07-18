
/**
 * Generator class to get a sequence of grid cell names:
 * e.g. a b c ... z A ... Z aa ab ...
 * 
 * Usage:
 * let stringIdGenerator = new StringIdGenerator();
 * for (let i = 0; i < gridWidth; i++) {
 *   horizontalIndices.push(stringIdGenerator.next());
 * }
 */
export default class StringIdGenerator {
  // tslint:disable-next-line: variable-name
  _chars;
  // tslint:disable-next-line: variable-name
  _nextId;

  constructor() {
    this._chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this._nextId = [0];
  }

  next() {
    const r = [];
    for (const char of this._nextId) {
      r.unshift(this._chars[char]);
    }
    this._increment();
    return r.join('');
  }

  _increment() {
    for (let i = 0; i < this._nextId.length; i++) {
      const val = ++this._nextId[i];
      if (val >= this._chars.length) {
        this._nextId[i] = 0;
      } else {
        return;
      }
    }
    this._nextId.push(0);
  }

  *[Symbol.iterator]() {
    while (true) {
      yield this.next();
    }
  }
}
