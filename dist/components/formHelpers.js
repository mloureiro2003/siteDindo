import { generateCode } from "./codeGenerator.js";
/**
 * Wires a code input to auto-suggest a short code from `sourceInput` (e.g. a description
 * field), using `generateCode`. The suggestion stops updating as soon as the person types
 * into the code field themselves, and never overwrites the field while `isEditing()` is true
 * (editing an existing item keeps its original code).
 */
export function attachAutoCode(codeInput, sourceInput, getExistingCodes, isEditing) {
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
        if (isEditing() || userEdited)
            return;
        codeInput.value = sourceInput.value.trim()
            ? generateCode(sourceInput.value, getExistingCodes())
            : "";
    });
    return {
        reset() {
            userEdited = false;
            codeInput.value = "";
        },
    };
}
/**
 * Replaces every option of a <select> except the placeholder (value="").
 * Keeps the current selection when it still exists.
 */
export function fillSelect(select, options) {
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
//# sourceMappingURL=formHelpers.js.map