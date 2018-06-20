import { assert } from 'chai';
import { describe, it, before } from 'mocha';
import CaesarCipher from '../src/caesar';

describe('Test the CaesarCipher class', function() {

  /*********************************************************************************************************************
   * Test constructor
   ********************************************************************************************************************/

  /**
   * Negative cases.
   */

  describe('Test constructor with invalid types of arguments', function() {
    describe('Test "offset"', function() {
      const invalidOffsetTypes: { name: string, value: any }[] = [
        { name: 'decimal', value: Number.MIN_VALUE },
        { name: 'string', value: '' },
        { name: 'symbol', value: Symbol('foo') },
        { name: 'boolean', value: true },
        { name: 'object', value: {} },
      ];

      invalidOffsetTypes.forEach((type) => {
        it(`should throw TypeError for ${type.name}`, function() {
          assert.throws(() => new CaesarCipher(type.value), TypeError);
        });
      });

      it('should throw RangeError for offset lower than 0', function() {
        assert.throws(() => new CaesarCipher(-1), RangeError);
      });
    });

    describe('Test "alphabet"', function() {
      const invalidAlphabetTypes: { name: string, value: any }[] = [
        { name: 'number', value: 0 },
        { name: 'empty string', value: '' },
        { name: 'symbol', value: Symbol('foo') },
        { name: 'boolean', value: true },
        { name: 'object', value: {} },
      ];

      invalidAlphabetTypes.forEach((type) => {
        it(`should throw TypeError for ${type.name}`, function() {
          assert.throws(() => new CaesarCipher(0, type.value), TypeError);
        });
      });
    });
  });

  /*********************************************************************************************************************
   * Test methods
   ********************************************************************************************************************/

  /**
   * Negative cases.
   */

  describe('Test methods with invalid types of arguments', function() {
    const invalidTypes: { name: string, value: any }[] = [
      { name: 'number', value: 0 },
      { name: 'symbol', value: Symbol('foo') },
      { name: 'boolean', value: true },
      { name: 'object', value: {} },
    ];

    invalidTypes.forEach((type) => {
      describe(`Test with ${type.name} as an argument`, function() {
        let caesarCipher: CaesarCipher;

        before(function () {
          caesarCipher = new CaesarCipher(0);
        });

        describe('Encode', function() {
          it('should throw TypeError', function() {
            assert.throws(() => caesarCipher.encode(type.value), TypeError);
          });
        });

        describe('Decode', function() {
          it('should throw TypeError', function() {
            assert.throws(() => caesarCipher.decode(type.value), TypeError);
          });
        });
      });
    });
  });

  /**
   * Positive cases.
   */

  describe('Test methods with valid types of arguments', function() {
    describe('Test with shift of 0', function() {
      let caesarCipher: CaesarCipher;

      before(function () {
        caesarCipher = new CaesarCipher(0);
      });

      describe('Encode', function() {
        it('should encode with shift of 0', function() {
          assert.strictEqual(caesarCipher.encode('abc'), 'ABC');
        });
      });

      describe('Decode', function() {
        it('should decode with shift of 1', function() {
          assert.strictEqual(caesarCipher.decode('abc'), 'ABC');
        });
      });
    });

    describe('Test with shift of 13', function() {
      let caesarCipher: CaesarCipher;

      before(function () {
        caesarCipher = new CaesarCipher(13);
      });

      describe('Encode', function() {
        it('should encode with shift of 13', function() {
          assert.strictEqual(caesarCipher.encode('abc'), 'NOP');
        });
      });

      describe('Decode', function() {
        it('should decode with shift of 13', function() {
          assert.strictEqual(caesarCipher.decode('nop'), 'ABC');
        });
      });
    });

    describe('Test with shift of 25', function() {
      let caesarCipher: CaesarCipher;

      before(function () {
        caesarCipher = new CaesarCipher(25);
      });

      describe('Encode', function() {
        it('should encode with shift of 25', function() {
          assert.strictEqual(caesarCipher.encode('abc'), 'ZAB');
        });
      });

      describe('Decode', function() {
        it('should decode with shift of 25', function() {
          assert.strictEqual(caesarCipher.decode('zab'), 'ABC');
        });
      });
    });
  });
});