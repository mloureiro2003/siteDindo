import { escapeHtml, sanitizeHtml } from "../components/html.js";
const REPORT_TITLES = {
    receita: "Relatório por receita",
    tipo: "Relatório por tipo de receita",
    ingrediente: "Relatório por ingrediente",
    quantidade: "Relatório por quantidade e unidade",
};
const FILTER_LABELS = {
    receita: "Receita:",
    tipo: "Tipo de receita:",
    ingrediente: "Ingrediente:",
    quantidade: "Unidade de medida:",
};
const numberFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
/** "2 mililitros" for measurable units, or just the unit description when it takes no quantity. */
function formatMeasure(line) {
    const quantity = line.getQuantity();
    const unit = line.getUnit();
    if (quantity === null)
        return unit.getUnit();
    return `${numberFormat.format(quantity)} ${unit.getUnit()}`;
}
export class ReportController {
    recipeRepository;
    area = null;
    filterWrapper = null;
    filterLabel = null;
    filterSelect = null;
    type = "receita";
    filter = "";
    recipes = [];
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }
    init() {
        this.area = document.getElementById("area-relatorio");
        this.filterWrapper = document.getElementById("report-filter");
        this.filterLabel = document.getElementById("report-filter-label");
        this.filterSelect = document.getElementById("report-filter-item");
        document.querySelectorAll("button[data-report]").forEach((button) => {
            button.addEventListener("click", () => {
                void this.generate(button.dataset.report);
            });
        });
        this.filterSelect?.addEventListener("change", () => {
            this.filter = this.filterSelect.value;
            this.render();
        });
        document.getElementById("btn-print")?.addEventListener("click", () => window.print());
    }
    async generate(type) {
        if (!this.area)
            return;
        this.type = type;
        this.filter = "";
        this.area.innerHTML = "<p><em>Carregando relatório...</em></p>";
        try {
            this.recipes = (await this.recipeRepository.getAll())
                .sort((a, b) => a.getRecipe().localeCompare(b.getRecipe()));
            this.fillFilter();
            this.render();
        }
        catch (error) {
            console.error(error);
            this.area.innerHTML = `<p class="error">Erro ao gerar relatório: ${escapeHtml(String(error.message || error))}</p>`;
        }
    }
    render() {
        if (!this.area)
            return;
        const recipes = this.filteredRecipes();
        const body = this.recipes.length === 0
            ? "<p>Nenhuma receita cadastrada.</p>"
            : this.buildBody(this.type, recipes);
        this.area.innerHTML = `<h3>${REPORT_TITLES[this.type]}</h3>${body}`;
    }
    // ---------- Filter ----------
    fillFilter() {
        if (!this.filterWrapper || !this.filterLabel || !this.filterSelect)
            return;
        const options = this.filterOptions();
        this.filterLabel.textContent = FILTER_LABELS[this.type];
        this.filterSelect.innerHTML =
            `<option value="">Todos</option>` +
                options.map((o) => `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join("");
        this.filterSelect.value = "";
        this.filterWrapper.hidden = false;
    }
    filterOptions() {
        const items = new Map();
        for (const recipe of this.recipes) {
            switch (this.type) {
                case "receita":
                    items.set(recipe.getCode().getCode(), recipe.getRecipe());
                    break;
                case "tipo": {
                    const name = recipe.getRecipeType().getRecipeType();
                    items.set(name, name);
                    break;
                }
                case "ingrediente":
                    for (const line of recipe.getIngredients()) {
                        const ingredient = line.getIngredient();
                        items.set(ingredient.getCode().getCode(), ingredient.getIngredient());
                    }
                    break;
                case "quantidade":
                    for (const line of recipe.getIngredients()) {
                        const unit = line.getUnit();
                        items.set(unit.getCode().getCode(), `${unit.getUnit()} (${unit.getCode().getCode()})`);
                    }
                    break;
            }
        }
        return [...items.entries()]
            .map(([value, label]) => ({ value, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }
    /** Filters whole recipes (reports "receita" and "tipo"). */
    filteredRecipes() {
        if (!this.filter)
            return this.recipes;
        switch (this.type) {
            case "receita":
                return this.recipes.filter((r) => r.getCode().getCode() === this.filter);
            case "tipo":
                return this.recipes.filter((r) => r.getRecipeType().getRecipeType() === this.filter);
            default:
                return this.recipes;
        }
    }
    /** Filters individual ingredient lines (reports "ingrediente" and "quantidade"). */
    lineMatches(line) {
        if (!this.filter)
            return true;
        switch (this.type) {
            case "ingrediente":
                return line.getIngredient().getCode().getCode() === this.filter;
            case "quantidade":
                return line.getUnit().getCode().getCode() === this.filter;
            default:
                return true;
        }
    }
    // ---------- Reports ----------
    buildBody(type, recipes) {
        switch (type) {
            case "receita": return this.byRecipe(recipes);
            case "tipo": return this.byType(recipes);
            case "ingrediente": return this.byIngredient(recipes);
            case "quantidade": return this.byQuantity(recipes);
        }
    }
    byRecipe(recipes) {
        return recipes.map((recipe) => {
            const ingredients = recipe.getIngredients().map((line) => {
                const measure = escapeHtml(formatMeasure(line));
                const name = escapeHtml(line.getIngredient().getIngredient());
                return line.getQuantity() === null
                    ? `<li>${name}, ${measure}</li>`
                    : `<li>${measure} de ${name}</li>`;
            }).join("");
            const steps = recipe.getSteps()
                ? `<div class="report-steps">${sanitizeHtml(recipe.getSteps())}</div>`
                : "<p><em>Sem modo de preparo.</em></p>";
            return `
                <article class="report-item">
                    <h4>${escapeHtml(recipe.getRecipe())} <small>(${escapeHtml(recipe.getCode().getCode())})</small></h4>
                    <p><strong>Tipo:</strong> ${escapeHtml(recipe.getRecipeType().getRecipeType())}</p>
                    <p><strong>Ingredientes</strong></p>
                    <ul>${ingredients || "<li><em>Nenhum ingrediente.</em></li>"}</ul>
                    <p><strong>Modo de preparo</strong></p>
                    ${steps}
                </article>`;
        }).join("");
    }
    byType(recipes) {
        const groups = new Map();
        for (const recipe of recipes) {
            const key = recipe.getRecipeType().getRecipeType();
            groups.set(key, [...(groups.get(key) ?? []), recipe]);
        }
        return [...groups.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([typeName, list]) => `
                <article class="report-item">
                    <h4>${escapeHtml(typeName)} <small>(${list.length})</small></h4>
                    <ul>${list.map((recipe) => `<li>${escapeHtml(recipe.getRecipe())} - ${recipe.getIngredients().length} ingrediente(s)</li>`).join("")}</ul>
                </article>`)
            .join("");
    }
    byIngredient(recipes) {
        const groups = new Map();
        for (const recipe of recipes) {
            for (const line of recipe.getIngredients()) {
                if (!this.lineMatches(line))
                    continue;
                const ingredient = line.getIngredient();
                const key = ingredient.getCode().getCode();
                const entry = groups.get(key) ?? {
                    name: ingredient.getIngredient(),
                    group: ingredient.getFoodGroup().getFoodGroup(),
                    usages: [],
                };
                entry.usages.push({
                    recipe: recipe.getRecipe(),
                    measure: formatMeasure(line),
                });
                groups.set(key, entry);
            }
        }
        if (groups.size === 0)
            return "<p>Nenhuma receita possui ingredientes.</p>";
        return [...groups.values()]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((entry) => `
                <article class="report-item">
                    <h4>${escapeHtml(entry.name)} <small>${escapeHtml(entry.group)}</small></h4>
                    <ul>${entry.usages.map((usage) => `<li>${escapeHtml(usage.recipe)} - ${escapeHtml(usage.measure)}</li>`).join("")}</ul>
                </article>`)
            .join("");
    }
    byQuantity(recipes) {
        const groups = new Map();
        for (const recipe of recipes) {
            for (const line of recipe.getIngredients()) {
                if (!this.lineMatches(line))
                    continue;
                const unit = line.getUnit();
                const key = unit.getCode().getCode();
                const entry = groups.get(key) ?? { label: `${unit.getUnit()} (${key})`, rows: [] };
                entry.rows.push({
                    ingredient: line.getIngredient().getIngredient(),
                    recipe: recipe.getRecipe(),
                    quantity: line.getQuantity(),
                });
                groups.set(key, entry);
            }
        }
        if (groups.size === 0)
            return "<p>Nenhuma receita possui ingredientes.</p>";
        return [...groups.values()]
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((entry) => `
                <article class="report-item">
                    <h4>${escapeHtml(entry.label)}</h4>
                    <table>
                        <thead><tr><th>Ingrediente</th><th>Receita</th><th>Quantidade</th></tr></thead>
                        <tbody>${entry.rows
            .sort((a, b) => a.ingredient.localeCompare(b.ingredient) || a.recipe.localeCompare(b.recipe))
            .map((row) => `<tr><td>${escapeHtml(row.ingredient)}</td><td>${escapeHtml(row.recipe)}</td><td>${row.quantity === null ? "-" : numberFormat.format(row.quantity)}</td></tr>`)
            .join("")}</tbody>
                    </table>
                </article>`)
            .join("");
    }
}
//# sourceMappingURL=reportController.js.map