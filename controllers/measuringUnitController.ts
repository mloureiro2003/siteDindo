import { BaseController } from "./baseController.js";
import { MeasuringUnitRepository } from "../repositories/measuringUnitRepository.js";
import { MeasuringUnit } from "../models/measuringUnit.js";
import { Code } from "../models/code.js";

export class MeasuringUnitController extends BaseController<MeasuringUnit> {
  private codeInput: HTMLInputElement | null = null;
  private valueInput: HTMLInputElement | null = null;

  constructor(private repository: MeasuringUnitRepository) {
    // Passa os IDs dos elementos HTML diretamente para a classe base
    super("unit-register", "unit-search", "form-unit", "table-units");
  }

  override async init(): Promise<void> {
    this.codeInput = document.getElementById("unit-code") as HTMLInputElement | null;
    this.valueInput = document.getElementById("unit-unit") as HTMLInputElement | null;
    
    // Executa a inicialização padrão (eventos do form + renderização da tabela)
    await super.init();
  }

  protected getTableColumns() {
    return [
      { getValue: (unit: MeasuringUnit) => unit.getCode().getCode() },
      { getValue: (unit: MeasuringUnit) => unit.getUnit() },
    ];
  }

  protected async getAllItems(): Promise<MeasuringUnit[]> {
    return await this.repository.getAll();
  }

  protected async save(): Promise<void> {
    if (!this.codeInput || !this.valueInput) return;

    const codeValue = this.codeInput.value.trim().toUpperCase();
    const value = this.valueInput.value.trim();
    if (!codeValue || !value) return alert("Preencha todos os campos.");

    const newCode = new Code(codeValue);
    const newUnit = new MeasuringUnit(newCode, value)

    try {
      if (this.editingItem && this.editingItem.getCode().getCode() !== codeValue) {
        await this.repository.delete(this.editingItem);
      }

      await this.repository.save(newUnit);
      alert(`Unidade "${value}" salva com sucesso!`);
      
      this.cancelEdit();
      this.showViews();
      await this.refreshTable();
    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message || error}`);
    }
  }

  protected startEdit(unit: MeasuringUnit): void {
    if (!this.codeInput || !this.valueInput) return;

    this.editingItem = unit;
    this.codeInput.value = unit.getCode().getCode();
    this.valueInput.value = unit.getUnit();

    if (this.submitButton) {
      this.submitButton.textContent = "Atualizar Unidade";
    }

    this.showViews();
    this.codeInput.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  protected async remove(unit: MeasuringUnit): Promise<void> {
    if (!confirm(`Excluir a unidade "${unit.getUnit()}"?`)) return;

    try {
      await this.repository.delete(unit);
      this.cancelEdit();
      await this.refreshTable();
    } catch (error: any) {
      alert(`Erro ao excluir: ${error.message || error}`);
    }
  }
}