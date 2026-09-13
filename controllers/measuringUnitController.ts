import { db } from "../services/firebase";
import { MeasuringUnitRepository } from "../repositories/measuringUnitRepository";
import { Code } from "../models/code";

const unitRepository = new MeasuringUnitRepository(db);

export function initUnitForm(): void {
  const formUnit = document.getElementById("form-unit") as HTMLFormElement | null;
  if (!formUnit || formUnit.dataset.initialized === "true") return;
  
  formUnit.dataset.initialized = "true";

  formUnit.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();
    event.stopPropagation(); // Stop parent bubbling

    const codeInput = document.getElementById("unit-code") as HTMLInputElement | null;
    const descriptionInput = document.getElementById("unit-description") as HTMLInputElement | null;

    if (!codeInput || !descriptionInput) {
      alert("Erro: Campos de input não encontrados no DOM.");
      return;
    }

    const codeValue = codeInput.value.trim().toLowerCase();
    const description = descriptionInput.value.trim();

    if (!codeValue || !description) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
        const unit = await unitRepository.create(description, new Code(codeValue));
        alert(`Cadastrado com sucesso! Código: ${unit.getCode().getValue()}`);
        formUnit.reset();
    } catch (error: any) {
        console.error("FIRESTORE ERROR (unit)", error);
        alert(`Error ao salvar no Firebase: ${error.message || error}`);
    }

  });
}