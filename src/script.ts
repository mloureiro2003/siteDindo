import Quill from "quill";
import { db } from "./services/firebase.js";
import { FoodGroupRepository } from "./repositories/foodGroupRepository.js";
import { MeasuringUnitRepository } from "./repositories/measuringUnitRepository.js";
import { RecipeTypeRepository } from "./repositories/recipeTypeRepository.js";
import { IngredientRepository } from "./repositories/ingredientRepository.js";
import { RecipeRepository } from "./repositories/recipeRepository.js";
import { FoodGroupController } from "./controllers/foodGroupController.js";
import { MeasuringUnitController } from "./controllers/measuringUnitController.js";
import { RecipeTypeController } from "./controllers/recipeTypeController.js";
import { IngredientController } from "./controllers/ingredientController.js";
import { RecipeController } from "./controllers/recipeController.js";
import { ReportController } from "./controllers/reportController.js";
import { makeAllSearchable } from "./components/searchableSelect.js";

// Sections whose dropdowns depend on other collections are reloaded when shown,
// so items created in another section appear without refreshing the page.
const reloadOnShow = new Map<string, () => Promise<void>>();

function showSection(sectionId: string): void {
  document.querySelectorAll<HTMLElement>(".section-view").forEach((section) => {
    section.classList.toggle("active", section.id === sectionId);
  });

  document.querySelectorAll<HTMLButtonElement>("nav button[data-section]").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === sectionId);
  });

  void reloadOnShow.get(sectionId)?.();
}

function initNavigation(): void {
  document.querySelectorAll<HTMLButtonElement>("nav button[data-section]").forEach((button) => {
    button.addEventListener("click", () => showSection(button.dataset.section!));
  });
}

function initRecipeEditor(): Quill | null {
  if (!document.getElementById("editor-recipe-steps")) return null;

  return new Quill("#editor-recipe-steps", {
    theme: "snow",
    placeholder: "Descreva o passo a passo da receita...",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    },
  });
}

function initValidationFeedback(): void {
  document
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[type="text"], textarea')
    .forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.toggle("invalid", input.required && input.value.trim() === "");
      });
    });

  document.querySelectorAll<HTMLFormElement>("form").forEach((form) => {
    form.addEventListener("reset", () => {
      form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
    });
  });
}

async function start(): Promise<void> {
  initNavigation();
  initValidationFeedback();
  makeAllSearchable();

  // One repository instance per collection, shared by every controller.
  const foodGroupRepository = new FoodGroupRepository(db);
  const measuringUnitRepository = new MeasuringUnitRepository(db);
  const recipeTypeRepository = new RecipeTypeRepository(db);
  const ingredientRepository = new IngredientRepository(db, foodGroupRepository);
  const recipeRepository = new RecipeRepository(db, recipeTypeRepository, ingredientRepository, measuringUnitRepository);

  const quill = initRecipeEditor();

  const foodGroupController = new FoodGroupController(foodGroupRepository);
  const unitController = new MeasuringUnitController(measuringUnitRepository);
  const recipeTypeController = new RecipeTypeController(recipeTypeRepository);
  const ingredientController = new IngredientController(ingredientRepository, foodGroupRepository);
  const recipeController = new RecipeController(
    recipeRepository, recipeTypeRepository, ingredientRepository, measuringUnitRepository, quill
  );
  const reportController = new ReportController(recipeRepository);

  reloadOnShow.set("sec-ingredient", () => ingredientController.reload());
  reloadOnShow.set("sec-recipe", () => recipeController.reload());

  reportController.init();

  await Promise.all([
    foodGroupController.init(),
    unitController.init(),
    recipeTypeController.init(),
    ingredientController.init(),
    recipeController.init(),
  ]);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void start());
} else {
  void start();
}