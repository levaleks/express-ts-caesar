import { assert } from 'chai';
import { describe, it, before } from 'mocha';
import caesarCipher, { CipherOperations } from '../src/caesarCipher';

describe('Test the caesarCipher function', () => {

  /**
   * Test guards
   */

  describe('Test function with invalid types of options', () => {
    describe('Test "alphabet"', () => {
      it('should return value of "text" if "alphabet" is an empty string', () => {
        const textValue = 'abc';

        assert.strictEqual(
          caesarCipher({
            operation: CipherOperations.Encode,
            alphabet: '',
            shift: 0,
            text: textValue,
          }),
          textValue,
        );
      });
    });

    describe('Test "shift"', () => {
      const invalidOffsetTypes: { name: string, value: any }[] = [
        { name: 'decimal', value: Number.MIN_VALUE },
        { name: 'string', value: '' },
        { name: 'symbol', value: Symbol('foo') },
        { name: 'boolean', value: true },
        { name: 'object', value: {} },
      ];

      invalidOffsetTypes.forEach((type) => {
        it(`should throw TypeError for ${type.name}`, () => {
          assert.throws(
            () => caesarCipher({
              operation: CipherOperations.Decode,
              shift: type.value,
              text: 'abc',
            }),
            TypeError,
          );
        });
      });

      it('should throw RangeError for offset lower than 0', () => {
        assert.throws(
          () => caesarCipher({
            operation: CipherOperations.Encode,
            shift: -1,
            text: 'abc',
          }),
          RangeError,
        );
      });
    });
  });

  /**
   * Test functionality
   */

  describe('Test function with valid types of arguments', () => {
    describe('Test with shift of 0', () => {
      describe('Encode', () => {
        it('should encode with shift of 0', () => {
          assert.strictEqual(
            caesarCipher({ operation: CipherOperations.Encode, shift: 0, text: 'abc' }),
            'ABC',
          );
        });
      });

      describe('Decode', () => {
        it('should decode with shift of 0', () => {
          assert.strictEqual(
            caesarCipher({ operation: CipherOperations.Decode, shift: 0, text: 'abc' }),
            'ABC',
          );
        });
      });
    });

    describe('Test with shift of 13', () => {
      describe('Encode', () => {
        it('should encode with shift of 13', () => {
          assert.strictEqual(
            caesarCipher({ operation: CipherOperations.Encode, shift: 13, text: 'abc' }),
            'NOP',
          );
        });
      });

      describe('Decode', () => {
        it('should decode with shift of 13', () => {
          assert.strictEqual(
            caesarCipher({ operation: CipherOperations.Decode, shift: 13, text: 'nop' }),
            'ABC',
          );
        });
      });
    });

    describe('Test with shift of 25', () => {
      describe('Encode', () => {
        it('should encode with shift of 25', () => {
          assert.strictEqual(
            caesarCipher({ operation: CipherOperations.Encode, shift: 25, text: 'abc' }),
            'ZAB',
          );
        });
      });

      describe('Decode', () => {
        it('should decode with shift of 25', () => {
          assert.strictEqual(
            caesarCipher({ operation: CipherOperations.Decode, shift: 25, text: 'zab' }),
            'ABC',
          );
        });
      });
    });
  });
});
