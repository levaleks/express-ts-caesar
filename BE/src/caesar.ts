/**
 * @desc Variation of Caesar cipher.
 *
 * @see {@link https://en.wikipedia.org/wiki/Caesar_cipher}
 */
export default class CaesarCipher {
  private shift: number;
  private alphabet: string;

  /**
   * @desc Class constructor.
   *
   * @throws {TypeError}
   * @throws {RangeError}
   */
  constructor(shift: number, alphabet: string = 'abcdefghijklmnopqrstuvwxyz') {
    if (!Number.isInteger(shift)) {
      throw new TypeError('Shift must be an integer');
    }

    if (shift < 0) {
      throw new RangeError('Shift must be a positive integer');
    }

    if (!alphabet.length) {
      throw new TypeError('Alphabet must be a non-empty string');
    }

    this.shift = shift;
    this.alphabet = alphabet.trim();
  }

  /**
   * @desc Encode or decode text. PAY ATTENTION to the return value - it will be always in upper case.
   */
  private convertText(operation: 'encode'|'decode', text: string): string {
    return text.replace(new RegExp(`[${this.alphabet}]`, 'gi'), (letter) => {
      if (this.alphabet.includes(letter.toLowerCase())) {
        const indexOfProvidedLetter: number = this.alphabet.indexOf(letter.toLowerCase());

        let indexOfConvertedLetter: number;

        if (operation === 'encode') {
          indexOfConvertedLetter = (indexOfProvidedLetter + this.shift) % this.alphabet.length;
        } else {
          indexOfConvertedLetter = (indexOfProvidedLetter - this.shift + this.alphabet.length) % this.alphabet.length;
        }

        const convertedLetter: string = this.alphabet[indexOfConvertedLetter];

        return convertedLetter.toUpperCase();
      }

      return letter;
    });
  }

  /**
   * @desc Encode method.
   *
   * @example
   * // returns 'BCD'
   * (new CaesarCipher(1)).encode('abc');
   */
  encode(text: string): string {
    return this.convertText('encode', text);
  }

  /**
   * @desc Decode method.
   *
   * @example
   * // returns 'ZAB'
   * (new CaesarCipher(1)).decode('abc');
   */
  decode(text: string): string {
    return this.convertText('decode', text);
  }
}