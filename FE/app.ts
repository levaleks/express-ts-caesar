const shiftSelectElement: HTMLSelectElement = document.querySelector('.shift');
const textInputElement: HTMLInputElement = document.querySelector('.original-text');
const textOutputElement: HTMLInputElement = document.querySelector('.result-text');

shiftSelectElement.addEventListener('change', onInputChange, false);
textInputElement.addEventListener('input', onInputChange, false);

async function onInputChange() {
  // console.log(shiftSelectElement.value, textInputElement.value);
  const text = encodeURIComponent(textInputElement.value);
  const shift = encodeURIComponent(shiftSelectElement.value);
  const resp = await fetch(`http://localhost:3001/encode?text=${text}&shift=${shift}`);
  const json = await resp.json();
  textOutputElement.value = json.encoded;
}