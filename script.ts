import { MeasuringUnitRepository } from "./repositories/measuringUnitRepository.js";
import Quill from "quill";
import { db } from "./services/firebase.js";
import { MeasuringUnitController } from "./controllers/measuringUnitController.js";

// Navigation Handlers
function showSection(sectionId: string): void {
  document.querySelectorAll<HTMLElement>('.section-view').forEach((sec) => {
    sec.classList.remove('active');
  });
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
}

function showSubView(subViewId: string): void {
  const targetSubView = document.getElementById(subViewId);
  if (targetSubView && targetSubView.parentElement) {
    targetSubView.parentElement.querySelectorAll<HTMLElement>('.sub-view').forEach((sub) => {
      sub.style.display = 'none';
    });
    targetSubView.style.display = 'block';
  }
}

// Dynamic Recipe Row Handlers
function addIngredientRow(): void {
  const container = document.getElementById('list-ingredients-recipe');
  if (!container) return;

  const newRow = document.createElement('div');
  newRow.className = 'ingredient-row';
  newRow.innerHTML = `
    <input type="text" placeholder="Cód" style="width: 80px;" class="ing-cod">
    <select class="ing-select" style="flex: 2;" required>
      <option value="">Selecione o ingrediente...</option>
    </select>
    <input type="number" step="0.01" placeholder="Qtd" style="width: 100px;" class="ing-qtd" required>
    <select class="ing-unit" style="flex: 1;" required>
      <option value="">Unidade...</option>
    </select>
    <button type="button" onclick="removeIngredientRow(this)">X</button>
  `;
  container.appendChild(newRow);
}

function removeIngredientRow(btn: HTMLButtonElement): void {
  btn.parentElement?.remove();
}

function generateReport(type: string): void {
  const area = document.getElementById('area-relatorio');
  if (area) {
    area.innerHTML = `<h3>Relatório ${type.toUpperCase()}</h3><p>Conteúdo do relatório gerado dinamicamente via JS...</p>`;
  }
}

// Expose navigation functions to window object for inline HTML handlers
(window as any).showSection = showSection;
(window as any).showSubView = showSubView;
(window as any).addIngredientRow = addIngredientRow;
(window as any).removeIngredientRow = removeIngredientRow;
(window as any).generateReport = generateReport;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Quill Editor first, so the recipe controller can read its content
  let quillEditor: InstanceType<typeof Quill> | null = null;
  const editorContainer = document.getElementById('editor-recipe-steps');

  if (editorContainer) {
    quillEditor = new Quill('#editor-recipe-steps', {
      theme: 'snow',
      placeholder: 'Descreva o passo a passo da receita...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['clean']
        ]
      }
    });
  }

  // 2. Initialize all form handlers - each one now actually persists to Firestore
  const unitController = new MeasuringUnitController(new MeasuringUnitRepository(db));
  void unitController.init();
  //initIngredientForm();
  //initRecipeTypeForm();
  //initRecipeForm(quillEditor);

  // 3. Form Input Validation UI Feedback
  const textInputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[type="text"], textarea');
  textInputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (input.hasAttribute('required') && input.value.trim() === '') {
        input.style.borderColor = '#bc4749';
      } else {
        input.style.borderColor = '#cccccc';
      }
    });
  });
});