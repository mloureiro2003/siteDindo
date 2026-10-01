import { generateCode } from "./codeGenerator.js";

export interface AutoCodeHandle {
  /** Clears the field and forgets any manual edit, so the next description auto-fills again. */
  reset(): void;
}

/**
 * Wires a code input to auto-suggest a short code from `sourceInput` (e.g. a description
 * field), using `generateCode`. The suggestion stops updating as soon as the person types
 * into the code field themselves, and never overwrites the field while `isEditing()` is true
 * (editing an existing item keeps its original code).
 */
export function attachAutoCode(
  codeInput: HTMLInputElement,
  sourceInput: HTMLInputElement,
  getExistingCodes: () => string[],
  isEditing: () => boolean
): AutoCodeHandle {
  let userEdited = false;

  codeInput.addEventListener("input", () => {
    userEdited = true;
    const { selectionStart, selectionEnd } = codeInput;
    codeInput.value = codeInput.value.toUpperCase();
    if (selectionStart !== null && selectionEnd !== null) {
      codeInput.setSelectionRange(selectionStart, selectionEnd);
    }
  });

  sourceInput.addEventListener("input", () => {
    if (isEditing() || userEdited) return;
    codeInput.value = sourceInput.value.trim()
      ? generateCode(sourceInput.value, getExistingCodes())
      : "";
  });

  return {
    reset(): void {
      userEdited = false;
      codeInput.value = "";
    },
  };
}

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Replaces every option of a <select> except the placeholder (value="").
 * Keeps the current selection when it still exists.
 */
export function fillSelect(select: HTMLSelectElement, options: SelectOption[]): void {
  const previous = select.value;
  select.querySelectorAll('option:not([value=""])').forEach((option) => option.remove());

  for (const { value, label } of options) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  }

  if (previous && options.some((option) => option.value === previous)) {
    select.value = previous;
  }
}
