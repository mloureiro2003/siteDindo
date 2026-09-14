import { BaseController } from "./baseController.js";
import { MeasuringUnitRepository } from "../repositories/measuringUnitRepository.js";
import { MeasuringUnit } from "../models/measuringUnit.js";
import { Code } from "../models/code.js";

export class MeasuringUnitController extends BaseController<MeasuringUnit> {
  private codeInput: HTMLInputElement | null = null;
  private descriptionInput: HTMLInputElement | null = null;

  constructor(private repository: MeasuringUnitRepository) {
    // Passa os IDs dos elementos HTML diretamente para a classe base
    super("unit-register", "unit-search", "form-unit", "table-units");
  }

  override async init(): Promise<void> {
    this.codeInput = document.getElementById("unit-code") as HTMLInputElement | null;
    this.descriptionInput = document.getElementById("unit-value") as HTMLInputElement | null;
    
    // Executa a inicialização padrão (eventos do form + renderização da tabela)
    await super.init();
  }

  protected getTableColumns() {
    return [
      { getValue: (unit: MeasuringUnit) => unit.getCode().getValue() },
      { getValue: (unit: MeasuringUnit) => unit.getValue() },
    ];
  }

  protected async getAllItems(): Promise<MeasuringUnit[]> {
    return await this.repository.getAll();
  }

  protected async save(): Promise<void> {
    if (!this.codeInput || !this.descriptionInput) return;

    const codeValue = this.codeInput.value.trim().toUpperCase();
    const description = this.descriptionInput.value.trim();
    if (!codeValue || !description) return alert("Preencha todos os campos.");

    const newCode = new Code(codeValue);
    const newUnit = new MeasuringUnit(newCode, description)

    try {
      if (this.editingItem && this.editingItem.getCode().getValue() !== codeValue) {
        await this.repository.delete(this.editingItem);
      }

      await this.repository.save(newUnit);
      alert(`Unidade "${description}" salva com sucesso!`);
      
      this.cancelEdit();
      this.showViews();
      await this.refreshTable();
    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message || error}`);
    }
  }

  protected startEdit(unit: MeasuringUnit): void {
    if (!this.codeInput || !this.descriptionInput) return;

    this.editingItem = unit;
    this.codeInput.value = unit.getCode().getValue();
    this.descriptionInput.value = unit.getValue();

    if (this.submitButton) {
      this.submitButton.textContent = "Atualizar Unidade";
    }

    this.showViews();
    this.codeInput.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  protected async remove(unit: MeasuringUnit): Promise<void> {
    if (!confirm(`Excluir a unidade "${unit.getValue()}"?`)) return;

    try {
      await this.repository.delete(unit);
      this.cancelEdit();
      await this.refreshTable();
    } catch (error: any) {
      alert(`Erro ao excluir: ${error.message || error}`);
    }
  }
}