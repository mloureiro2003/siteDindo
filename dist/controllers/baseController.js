import { TableRenderer } from "../components/tableRenderer.js";
import { normalizeText } from "../components/html.js";
export class BaseController {
    registerId;
    searchId;
    formId;
    tableId;
    repository;
    form = null;
    submitButton = null;
    defaultSubmitLabel = "Salvar";
    tableRenderer = null;
    editingItem = null;
    items = [];
    constructor(registerId, searchId, formId, tableId, repository) {
        this.registerId = registerId;
        this.searchId = searchId;
        this.formId = formId;
        this.tableId = tableId;
        this.repository = repository;
    }
    async init() {
        this.form = document.getElementById(this.formId);
        if (!this.form || this.form.dataset.initialized === "true")
            return;
        this.form.dataset.initialized = "true";
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.defaultSubmitLabel = this.submitButton?.textContent?.trim() || "Salvar";
        this.bindElements();
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();
            void this.save();
        });
        await this.reload();
    }
    /** Reloads dropdown sources and the table. Call it when the section becomes visible. */
    async reload() {
        if (!this.form)
            return;
        try {
            await this.loadLookups();
            await this.refreshTable();
        }
        catch (error) {
            console.error(error);
            alert(`Erro ao carregar dados: ${error.message || error}`);
        }
    }
    async refreshTable() {
        this.items = (await this.getAllItems())
            .slice()
            .sort((a, b) => a.getCode().getCode().localeCompare(b.getCode().getCode()));
        this.renderTable();
        this.onItemsLoaded(this.items);
    }
    renderTable() {
        const tableBody = document.getElementById(this.tableId);
        if (!tableBody)
            return;
        if (!this.tableRenderer) {
            this.tableRenderer = new TableRenderer(tableBody, this.getTableColumns(), {
                onEdit: (item) => this.startEdit(item),
                onDelete: (item) => void this.remove(item),
            });
        }
        this.tableRenderer.render(this.getVisibleItems());
    }
    getVisibleItems() {
        return this.items;
    }
    async getAllItems() {
        return await this.repository.getAll();
    }
    async save() {
        const newItem = this.buildEntityFromForm();
        if (!newItem)
            return;
        const duplicate = this.findDuplicate(newItem);
        if (duplicate) {
            alert(duplicate);
            return;
        }
        if (this.submitButton)
            this.submitButton.disabled = true;
        try {
            await this.repository.update(this.editingItem, newItem);
            alert(`${this.getEntityLabel(newItem)} salvo com sucesso!`);
            this.cancelEdit();
            await this.refreshTable();
        }
        catch (error) {
            alert(`Erro ao salvar: ${error.message || error}`);
        }
        finally {
            if (this.submitButton)
                this.submitButton.disabled = false;
        }
    }
    startEdit(item) {
        this.editingItem = item;
        this.populateForm(item);
        if (this.submitButton) {
            this.submitButton.textContent = `Atualizar ${this.getEntityLabel(item)}`;
        }
        this.showViews();
        this.form?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    async remove(item) {
        if (!confirm(`Excluir ${this.getEntityLabel(item)}?`))
            return;
        try {
            await this.repository.delete(item);
            if (this.editingItem && this.editingItem.getCode().getCode() === item.getCode().getCode()) {
                this.cancelEdit();
            }
            await this.refreshTable();
        }
        catch (error) {
            alert(`Erro ao excluir: ${error.message || error}`);
        }
    }
    showViews() {
        const register = document.getElementById(this.registerId);
        const search = document.getElementById(this.searchId);
        if (register)
            register.style.display = "block";
        if (search)
            search.style.display = "block";
    }
    cancelEdit() {
        this.editingItem = null;
        this.form?.reset();
        if (this.submitButton) {
            this.submitButton.textContent = this.defaultSubmitLabel;
        }
    }
    findDuplicate(newItem) {
        const editingCode = this.editingItem?.getCode().getCode();
        const newCode = newItem.getCode().getCode().toUpperCase();
        const normalize = (text) => normalizeText(text.trim()).toLowerCase();
        const newName = normalize(this.getName(newItem));
        for (const item of this.items) {
            const code = item.getCode().getCode();
            if (code === editingCode)
                continue; // the item being edited can keep its own code/name
            if (code.toUpperCase() === newCode) {
                return `Já existe um registro com o código "${code}".`;
            }
            if (normalize(this.getName(item)) === newName) {
                return `Já existe um registro com o nome "${this.getName(item)}".`;
            }
        }
        return null;
    }
    /** Hooks for subclasses. */
    bindElements() { }
    async loadLookups() { }
    onItemsLoaded(_items) { }
}
//# sourceMappingURL=baseController.js.map