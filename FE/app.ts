import caesarCipher, { CipherOperations, CipherOptions } from '../BE/src/caesarCipher';
import 'babel-polyfill';

/**
 * Helpers
 */

/**
 * @desc Render HTML.
 */
const render: Function = (template: string|Function, node: HTMLElement): void => {
  if (!node) {
    return;
  }

  node.innerHTML = typeof template === 'function' ? template() : template;
};

/**
 * @desc Simple debounce function.
 */
const debounce: Function = (callback: Function, time: number = 250) => {
  let timeoutId: number;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(
      () => {
        callback(...args);
      },
      time,
    );
  };
};

/**
 * App
 */

/**
 * Set alphabet.
 */

const alphabets: { name: string, letters: string }[] = [
  { name: 'English', letters: 'abcdefghijklmnopqrstuvwxyz' },
  { name: 'Russian', letters: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя' },
];

let currentAlphabet = alphabets[0];

const app: Function = (): string => {
  return `
    <div class="main">
      <h1 class="topic">Caesar Demo</h1>

      <form class="form">
        <!-- Operation -->
        <label class="form__label">
          <span class="form__label-name">Operation</span>

          <select name="operation" class="form__control js-operation">
            <option value="${CipherOperations.Encode}">Encode</option>
            <option value="${CipherOperations.Decode}">Decode</option>
          </select>
        </label>
        <!-- /Operation -->

        <!-- Alphabet -->
        <label class="form__label">
          <span class="form__label-name">Alphabet</span>

          <select name="alphabet" class="form__control js-alphabet">
         ${alphabets
    .map(a => `
                 <option
                   value="${a.letters}"
                   ${a.name === currentAlphabet.name ? 'selected' : ''}
                 >
                   ${a.name}
                 </option>`)
    .join('')}
          </select>
        </label>
        <!-- /Alphabet -->

        <!-- Shift -->
        <label class="form__label">
          <span class="form__label-name">Shift</span>

          <select name="shift" class="form__control js-shift">
            ${Array.from(
    { length: currentAlphabet.letters.length },
    (_, i) => `<option value="${i}">${i}</option>`)
    .join('')}
          </select>
        </label>
        <!-- /Shift -->

        <!-- Original text -->
        <label class="form__label">
          <span class="form__label-name">Original text</span>

          <textarea class="form__control js-original-text original-text"></textarea>
        </label>
        <!-- /Original text -->

        <!-- Result text -->
        <label class="form__label">
          <span class="form__label-name">Result text</span>

          <textarea class="form__control js-result-text result-text" readonly></textarea>
        </label>
        <!-- /Result text -->
      </form>

      <div class="js-indicator"></div>
    </div>
  `;
};

/**
 * @desc Render App.
 */
render(app, document.querySelector('#app'));

/**
 * @desc Init cipher.
 */

const cipherOptions: CipherOptions = {
  operation: CipherOperations.Encode,
  shift: 0,
  text: '',
};

/**
 * Get elements.
 */

const operationSelectElement: HTMLSelectElement = document.querySelector('.js-operation');
const alphabetSelectElement: HTMLSelectElement = document.querySelector('.js-alphabet');
const shiftSelectElement: HTMLSelectElement = document.querySelector('.js-shift');
const textInputElement: HTMLInputElement = document.querySelector('.js-original-text');
const textOutputElement: HTMLInputElement = document.querySelector('.js-result-text');
const indicatorElement: HTMLElement = document.querySelector('.js-indicator');

/**
 * @desc Convert text and write result to the textarea.
 */
const convertText = debounce(async (options: CipherOptions) => {
  if (options.text) {
    indicatorElement.classList.add('spinner');

    const response = await fetch('http://localhost:3000/transform', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    textOutputElement.value = data.data;

    indicatorElement.classList.remove('spinner');
  } else {
    textOutputElement.value = '';
  }
});

/**
 * Handlers.
 */

const onInputChange = (): void => {
  cipherOptions.operation = <CipherOperations>operationSelectElement.value;
  cipherOptions.text = textInputElement.value;

  convertText(cipherOptions);
};

const onSettingsChange = (): void => {
  if (currentAlphabet.letters !== alphabetSelectElement.value) {
    currentAlphabet = alphabets
      .find(alphabet => alphabet.letters === alphabetSelectElement.value);

    shiftSelectElement.options.length = 0;

    // tslint:disable-next-line no-increment-decrement
    for (let i = 0; i < currentAlphabet.letters.length; i++) {
      shiftSelectElement.options.add(new Option(String(i), String(i), i === 0, i === 0));
    }
  }

  cipherOptions.shift = Number(shiftSelectElement.value);
  cipherOptions.alphabet = alphabetSelectElement.value;

  convertText(cipherOptions);
};

/**
 * Attach events.
 */

operationSelectElement.addEventListener('change', onInputChange, false);
alphabetSelectElement.addEventListener('change', onSettingsChange, false);
shiftSelectElement.addEventListener('change', onSettingsChange, false);
textInputElement.addEventListener('input', onInputChange, false);
