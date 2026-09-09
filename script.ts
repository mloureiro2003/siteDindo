import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDD1ZbaF-yECjINVeTRvYvGx1MBgWDLVoc",
  authDomain: "sietdindo.firebaseapp.com",
  projectId: "sietdindo",
  storageBucket: "sietdindo.firebasestorage.app",
  messagingSenderId: "812370145647",
  appId: "1:812370145647:web:d0b3ea0684a87b4d31789a"
};

const app = initializeApp(firebaseConfig);

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
    <select class="ing-unidade" style="flex: 1;" required>
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
  const area = document.getElementById('area-report');
  if (area) {
    area.innerHTML = `<h3>Relatório ${type.toUpperCase()}</h3><p>Conteúdo do relatório gerado dinamicamente via JS...</p>`;
  }
}

(window as any).showSection = showSection;
(window as any).showSubView = showSubView;
(window as any).addIngredientRow = addIngredientRow;
(window as any).removeIngredientRow = removeIngredientRow;
(window as any).gerarRelatorio = generateReport;

document.addEventListener('DOMContentLoaded', () => {
  // Instancia repositórios e controllers
  const unitRepo = new MeasuringUnitRepository();
  const unitController = new UnidadeMedidaController(unitRepo);

  // Renderização inicial
  unitController.renderTable();
});