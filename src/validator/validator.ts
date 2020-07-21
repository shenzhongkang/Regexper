class Validator {
  root: HTMLElement;
  sourceField: HTMLTextAreaElement;
  targetField: HTMLTextAreaElement;
  sourceValue: string = '';
  targetValue: string = '';
  targetForm: HTMLFormElement;
  results: HTMLDivElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.sourceField = root.querySelector('#regexp-input') as HTMLTextAreaElement;
    this.targetField = root.querySelector('#validator-input') as HTMLTextAreaElement;
    this.targetForm = root.querySelector('#validator-form') as HTMLFormElement;
    this.results = root.querySelector('#validator-results') as HTMLDivElement;
  }

  // Event handler for submission of the test field.
  submitListener(event: Event) {
    event.returnValue = false;
    if (event.preventDefault) {
      event.preventDefault();
    }
    this.sourceValue = this.sourceField.value;
    this.targetValue = this.targetField.value;
    this.showResults();
  }

  // Binds all event listeners.
  bindListeners() {
    this.targetForm.addEventListener('submit', this.submitListener.bind(this));
  }

  // show testing results
  showResults() {
    if (!this.targetValue || !this.sourceValue) {
      return;
    }
    let result: boolean = new RegExp(this.sourceValue).test(this.targetValue);
    this.results.innerHTML = result ? `<p style="color: green">Pass Validator</p>` : `<p style="color: red">Unpass Validator</p>`;
  }
}

export default Validator;