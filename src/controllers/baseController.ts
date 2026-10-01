import { TableRenderer, type TableColumn } from "../components/tableRenderer.js";
import type { BaseRepository, HasCode } from "../repositories/baseRepository.js";
import { normalizeText } from "../components/html.js";

export abstract class BaseController<T extends HasCode> {
    protected form: HTMLFormElement | null = null;
    protected submitButton: HTMLButtonElement | null = null;
    protected defaultSubmitLabel = "Salvar";
    protected tableRenderer: TableRenderer<T> | null = null;
    protected editingItem: T | null = null;
    protected items: T[] = [];
    protected abstract getName(item: T): string;

    constructor(
        protected registerId: string,
        protected searchId: string,
        protected formId: string,
        protected tableId: string,
        protected repository: BaseRepository<T>
    ) {}

    async init(): Promise<void> {
        this.form = document.getElementById(this.formId) as HTMLFormElement | null;
        if (!this.form || this.form.dataset.initialized === "true") return;

        this.form.dataset.initialized = "true";
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.defaultSubmitLabel = this.submitButton?.textContent?.trim() || "Salvar";

        this.bindElements();

        this.form.addEventListener("submit", (event: SubmitEvent) => {
            event.preventDefault();
            event.stopPropagation();
            void this.save();
        });

        await this.reload();
    }

    /** Reloads dropdown sources and the table. Call it when the section becomes visible. */
    async reload(): Promise<void> {
        if (!this.form) return;

        try {
            await this.loadLookups();
            await this.refreshTable();
        } catch (error: any) {
            console.error(error);
            alert(`Erro ao carregar dados: ${error.message || error}`);
        }
    }

    protected async refreshTable(): Promise<void> {
        this.items = (await this.getAllItems())
            .slice()
            .sort((a, b) => a.getCode().getCode().localeCompare(b.getCode().getCode()));

        this.renderTable();
        this.onItemsLoaded(this.items);
    }

    protected renderTable(): void {
        const tableBody = document.getElementById(this.tableId) as HTMLTableSectionElement | null;
        if (!tableBody) return;

        if (!this.tableRenderer) {
            this.tableRenderer = new TableRenderer<T>(tableBody, this.getTableColumns(), {
                onEdit: (item) => this.startEdit(item),
                onDelete: (item) => void this.remove(item),
            });
        }

        this.tableRenderer.render(this.getVisibleItems());
    }

    protected getVisibleItems(): T[] {
        return this.items;
    }

    protected async getAllItems(): Promise<T[]> {
        return await this.repository.getAll();
    }

    protected async save(): Promise<void> {
        const newItem = this.buildEntityFromForm();
        if (!newItem) return;

        const duplicate = this.findDuplicate(newItem);
        if (duplicate) {
            alert(duplicate);
            return;
        }

        if (this.submitButton) this.submitButton.disabled = true;

        try {
            await this.repository.update(this.editingItem, newItem);
            alert(`${this.getEntityLabel(newItem)} salvo com sucesso!`);
            this.cancelEdit();
            await this.refreshTable();
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message || error}`);
        } finally {
            if (this.submitButton) this.submitButton.disabled = false;
        }
    }

    protected startEdit(item: T): void {
        this.editingItem = item;
        this.populateForm(item);

        if (this.submitButton) {
            this.submitButton.textContent = `Atualizar ${this.getEntityLabel(item)}`;
        }

        this.showViews();
        this.form?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    protected async remove(item: T): Promise<void> {
        if (!confirm(`Excluir ${this.getEntityLabel(item)}?`)) return;

        try {
            await this.repository.delete(item);
            if (this.editingItem && this.editingItem.getCode().getCode() === item.getCode().getCode()) {
                this.cancelEdit();
            }
            await this.refreshTable();
        } catch (error: any) {
            alert(`Erro ao excluir: ${error.message || error}`);
        }
    }

    protected showViews(): void {
        const register = document.getElementById(this.registerId);
        const search = document.getElementById(this.searchId);
        if (register) register.style.display = "block";
        if (search) search.style.display = "block";
    }

    protected cancelEdit(): void {
        this.editingItem = null;
        this.form?.reset();
        if (this.submitButton) {
            this.submitButton.textContent = this.defaultSubmitLabel;
        }
    }

    protected findDuplicate(newItem: T): string | null {
        const editingCode = this.editingItem?.getCode().getCode();
        const newCode = newItem.getCode().getCode().toUpperCase();
        const normalize = (text: string) => normalizeText(text.trim()).toLowerCase();
        const newName = normalize(this.getName(newItem));

        for (const item of this.items) {
            const code = item.getCode().getCode();
            if (code === editingCode) continue; // the item being edited can keep its own code/name

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
    protected bindElements(): void {}
    protected async loadLookups(): Promise<void> {}
    protected onItemsLoaded(_items: T[]): void {}

    protected abstract getTableColumns(): TableColumn<T>[];
    protected abstract buildEntityFromForm(): T | null;
    protected abstract populateForm(item: T): void;
    protected abstract getEntityLabel(item: T): string;
}
