export default class Task {
  constructor(name) {
    this.name = name;
    this.pinned = false;
    this.element = document.createElement('div');
    this.element.classList.add('task');
    this.element.innerHTML = `
      ${name}
      <input type="checkbox">
    `;
    this.checkbox = this.element.querySelector('input');
    this.checkbox.addEventListener('change', this.checkboxHandler.bind(this));
  }

  checkboxHandler(change) {
    this.pinned = change.target.checked;
  }
}
