/**
 * date-input.js - Polished, accessible, human-friendly date input controller
 * 
 * Formats "DD / MM / YYYY" naturally while typing, handles backspacing
 * across delimiters, supports pasting, and preserves cursor positions.
 */

export class DateInputController {
  constructor(inputElement, options = {}) {
    this.input = inputElement;
    this.onChange = options.onChange || (() => {});
    this.onSubmit = options.onSubmit || (() => {});
    
    if (!this.input) return;

    this.init();
  }

  init() {
    this.input.setAttribute('inputmode', 'numeric');
    this.input.setAttribute('autocomplete', 'off');
    this.input.setAttribute('autocorrect', 'off');
    this.input.setAttribute('spellcheck', 'false');
    this.input.setAttribute('placeholder', 'DD / MM / YYYY');

    this.bindEvents();
  }

  bindEvents() {
    this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
    this.input.addEventListener('input', (e) => this.handleInput(e));
    this.input.addEventListener('paste', (e) => this.handlePaste(e));
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.onSubmit(this.getDateParts());
      return;
    }

    // Natural backspace: if user backspaces right after a slash or space, delete the digit behind it
    if (e.key === 'Backspace') {
      const { selectionStart, selectionEnd, value } = this.input;
      if (selectionStart === selectionEnd && selectionStart > 0) {
        const precedingText = value.slice(0, selectionStart);
        if (precedingText.endsWith(' / ')) {
          e.preventDefault();
          const updated = value.slice(0, selectionStart - 3) + value.slice(selectionEnd);
          this.setFormattedValue(updated, selectionStart - 3);
          this.onChange(this.getDigits());
        } else if (precedingText.endsWith(' /') || precedingText.endsWith('/ ')) {
          e.preventDefault();
          const updated = value.slice(0, selectionStart - 2) + value.slice(selectionEnd);
          this.setFormattedValue(updated, selectionStart - 2);
          this.onChange(this.getDigits());
        }
      }
    }
  }

  handleInput(e) {
    const rawValue = this.input.value;
    const digits = rawValue.replace(/\D/g, '').slice(0, 8);
    const formatted = this.formatDigits(digits);

    this.input.value = formatted;
    this.onChange(digits);
  }

  handlePaste(e) {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    const digits = pasted.replace(/\D/g, '').slice(0, 8);
    this.input.value = this.formatDigits(digits);
    this.onChange(digits);
  }

  formatDigits(digits) {
    if (!digits) return '';
    if (digits.length <= 2) {
      return digits.length === 2 ? `${digits} / ` : digits;
    }
    if (digits.length <= 4) {
      const dd = digits.slice(0, 2);
      const mm = digits.slice(2);
      return mm.length === 2 ? `${dd} / ${mm} / ` : `${dd} / ${mm}`;
    }
    const dd = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);
    return `${dd} / ${mm} / ${yyyy}`;
  }

  setFormattedValue(value, cursorPosition) {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    this.input.value = this.formatDigits(digits);
    if (cursorPosition !== undefined) {
      const pos = Math.min(cursorPosition, this.input.value.length);
      this.input.setSelectionRange(pos, pos);
    }
  }

  getDigits() {
    return this.input.value.replace(/\D/g, '');
  }

  getDateParts() {
    const digits = this.getDigits();
    if (digits.length < 8) {
      return { isValidFormat: false, day: null, month: null, year: null, raw: digits };
    }
    const day = parseInt(digits.slice(0, 2), 10);
    const month = parseInt(digits.slice(2, 4), 10);
    const year = parseInt(digits.slice(4, 8), 10);

    return {
      isValidFormat: true,
      day,
      month,
      year,
      raw: digits
    };
  }

  focus() {
    this.input.focus();
  }

  clear() {
    this.input.value = '';
    this.onChange('');
  }

  disable() {
    this.input.disabled = true;
  }

  enable() {
    this.input.disabled = false;
  }
}

