/**
 * scene1.js - Scene 1: The Entrance / Unlock Experience
 * 
 * Manages the quiet opening screen, date validation for 11/11/2005,
 * gentle feedback handling, and the cinematic handoff transition.
 */

import { DateInputController } from './date-input.js';

export class Scene1 {
  constructor(options = {}) {
    this.container = document.querySelector('.scene1-container');
    this.stage = document.querySelector('.scene1-stage');
    this.form = document.querySelector('.scene1-form');
    this.inputWrapper = document.querySelector('.scene1-input-wrapper');
    this.inputElement = document.querySelector('.scene1-input');
    this.buttonElement = document.querySelector('.scene1-button');
    this.feedbackElement = document.querySelector('.scene1-feedback');
    this.ambientContainer = document.querySelector('.ambient-container');
    
    this.onComplete = options.onComplete || (() => {});
    this.isUnlocked = false;

    // Target date: 11 November 2005 (11 / 11 / 2005)
    // Kept strictly within private controller logic
    this.target = { day: 11, month: 11, year: 2005 };

    if (!this.stage || !this.form || !this.inputElement) {
      console.warn('Scene 1 elements not found in DOM.');
      return;
    }

    this.init();
  }

  init() {
    this.dateController = new DateInputController(this.inputElement, {
      onChange: () => this.handleInputChange(),
      onSubmit: (dateParts) => this.validate(dateParts)
    });

    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validate(this.dateController.getDateParts());
    });

    // Clear feedback if user clicks or focuses input again
    this.inputElement.addEventListener('focus', () => {
      this.clearFeedback();
    });

    // Helper hint pill: fills date when tapped
    const hintBtn = document.getElementById('scene1-hint-btn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        if (this.isUnlocked) return;
        this.inputElement.value = '11 / 11 / 2005';
        this.clearFeedback();
        this.dateController.input.value = '11 / 11 / 2005';
        this.validate({
          isValidFormat: true,
          day: 11,
          month: 11,
          year: 2005,
          raw: '11112005'
        });
      });
    }
  }

  handleInputChange() {
    if (this.feedbackElement.classList.contains('visible')) {
      this.clearFeedback();
    }
  }

  validate(dateParts) {
    if (this.isUnlocked) return;

    const { isValidFormat, day, month, year } = dateParts;

    const isMatch = (
      isValidFormat &&
      day === this.target.day &&
      month === this.target.month &&
      year === this.target.year
    );

    if (isMatch) {
      this.handleSuccess();
    } else {
      this.handleFailure();
    }
  }

  handleFailure() {
    // Show gentle feedback without revealing the correct answer
    this.feedbackElement.textContent = "Hmm… I don't think that's quite right. Try again.";
    this.feedbackElement.classList.add('visible');

    // Subtle gentle sway on the input container
    this.inputWrapper.classList.remove('sway');
    // Force DOM reflow to re-trigger CSS animation cleanly
    void this.inputWrapper.offsetWidth;
    this.inputWrapper.classList.add('sway');

    setTimeout(() => {
      this.inputWrapper.classList.remove('sway');
    }, 500);
  }

  clearFeedback() {
    this.feedbackElement.classList.remove('visible');
    this.inputWrapper.classList.remove('sway');
  }

  handleSuccess() {
    this.isUnlocked = true;
    this.clearFeedback();
    
    // Disable inputs to prevent redundant actions
    this.dateController.disable();
    this.buttonElement.disabled = true;

    // Trigger visual transitions
    this.stage.classList.add('unlocked');
    if (this.ambientContainer) {
      this.ambientContainer.classList.add('unlocked');
    }

    // Dispatch transition event for scene choreography
    const completionEvent = new CustomEvent('scene:complete', {
      detail: {
        scene: 1,
        name: 'entrance',
        completedAt: Date.now()
      }
    });

    window.dispatchEvent(completionEvent);
    this.onComplete({ scene: 1, completedAt: Date.now() });
  }

  reset() {
    this.isUnlocked = false;
    this.stage?.classList.remove('unlocked');
    if (this.ambientContainer) {
      this.ambientContainer.classList.remove('unlocked');
    }
    if (this.inputElement) {
      this.inputElement.value = '';
    }
    if (this.buttonElement) {
      this.buttonElement.disabled = false;
    }
    if (this.dateController) {
      this.dateController.enable();
      this.dateController.clear();
    }
    this.clearFeedback();
  }
}

