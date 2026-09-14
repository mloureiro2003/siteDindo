import { MeasuringUnitRepository } from "../repositories/measuringUnitRepository.js";
import { MeasuringUnit } from "../models/measuringUnit.js";
import { Code } from "../models/code.js";
import { TableRenderer } from "../components/tableRenderer.js";

export class MeasuringUnitController {
  private repository: MeasuringUnitRepository;
  private tableRenderer: TableRenderer<MeasuringUnit> | null = null;
  private editingUnit: MeasuringUnit | null = null;
  private form: HTMLFormElement | null = null;
  private codeInput: HTMLInputElement | null = null;
  private descriptionInput: HTMLInputElement | null = null;
  private submitButton: HTMLButtonElement | null = null;

  constructor(repository: MeasuringUnitRepository) {
    this.repository = repository;
  }

  async init(): Promise<void> {
    this.form = document.getElementById("form-unit") as HTMLFormElement | null;
    this.codeInput = document.getElementById("unit-code") as HTMLInputElement | null;
    this.descriptionInput = document.getElementById("unit-description") as HTMLInputElement | null;

    const tableBody = document.getElementById("table-units") as HTMLTableSectionElement | null;
    if (tableBody) {
      this.tableRenderer = new TableRenderer<MeasuringUnit>(
        tableBody,
        [
          { getValue: (unit) => unit.getCode().getValue() },
          { getValue: (unit) => unit.getValue() },
        ],
        {
          onEdit: (unit) => this.startEdit(unit),
          onDelete: (unit) => void this.remove(unit),
        }
      );
    }

    if (!this.form || this.form.dataset.initialized === "true") return;
    this.form.dataset.initialized = "true";
    this.submitButton = this.form.querySelector('button[type="submit"]');

    this.form.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();
      event.stopPropagation();
      void this.save();
    });

    await this.refreshTable();
  }

  private async save(): Promise<void> {
    if (!this.codeInput || !this.descriptionInput) {
      alert("Erro: Campos de input não encontrados no DOM.");
      return;
    }

    const codeValue = this.codeInput.value.trim().toUpperCase();
    const description = this.descriptionInput.value.trim();

    if (!codeValue || !description) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const newCode = new Code(codeValue);

    try {
      if (this.editingUnit && this.editingUnit.getCode().getValue() !== codeValue) {
        await this.repository.delete(this.editingUnit);
      }

      await this.repository.create(description, newCode);
      alert(`Unidade "${description}" salva com sucesso!`);
      this.cancelEdit();
      await this.refreshTable();
      this.navigateToList();
    } catch (error: any) {
      console.error("FIRESTORE ERROR (unit):", error);
      alert(`Erro ao salvar unidade: ${error.message || error}`);
    }
  }

  private async refreshTable(): Promise<void> {
    if (!this.tableRenderer) return;

    let units: MeasuringUnit[] = [];
    try {
      units = await this.repository.getAll();
    } catch (error: any) {
      console.error("FIRESTORE ERROR (units getAll):", error);
      return;
    }

    this.tableRenderer.render(units);
  }

  private startEdit(unit: MeasuringUnit): void {
    if (!this.codeInput || !this.descriptionInput) return;

    this.editingUnit = unit;
    this.codeInput.value = unit.getCode().getValue();
    this.descriptionInput.value = unit.getValue();

    if (this.submitButton) {
      this.submitButton.textContent = "Atualizar Unidade";
    }

    this.navigateToForm();
    this.codeInput.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  private cancelEdit(): void {
    this.editingUnit = null;
    this.form?.reset();

    if (this.submitButton) {
      this.submitButton.textContent = "Salvar Unidade";
    }
  }

  private async remove(unit: MeasuringUnit): Promise<void> {
    const confirmed = confirm(`Excluir a unidade "${unit.getValue()}" (${unit.getCode().getValue()})?`);
    if (!confirmed) return;

    try {
      await this.repository.delete(unit);
      this.cancelEdit();
      await this.refreshTable();

    } catch (error: any) {
      console.error("FIRESTORE ERROR (unit delete):", error);
      alert(`Erro ao excluir unidade: ${error.message || error}`);
    }
  }

  private navigateToForm(): void {
    if (typeof (window as any).showSubView === "function") {
      (window as any).showSubView("unit-register");
    } else {
      const register = document.getElementById("unit-register");
      const search = document.getElementById("unit-search");
      if (register) register.style.display = "block";
      if (search) search.style.display = "none";
    }
  }

  private navigateToList(): void {
    if (typeof (window as any).showSubView === "function") {
      (window as any).showSubView("unit-search");
    } else {
      const register = document.getElementById("unit-register");
      const search = document.getElementById("unit-search");
      if (register) register.style.display = "none";
      if (search) search.style.display = "block";
    }
  }
}