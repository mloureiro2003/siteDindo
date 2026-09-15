import { TableRenderer } from "../components/tableRenderer.js";

export abstract class BaseController<T> {
    protected form: HTMLFormElement | null = null;
    protected submitButton: HTMLButtonElement | null = null;
    protected tableRenderer: TableRenderer<T> | null = null;
    protected editingItem: T | null = null;
    protected items: T[] = [];

    constructor(
        protected registerId: string, 
        protected searchId: string,
        protected formId: string, 
        protected tableId: string
    ) {}

    async init(): Promise<void> {
        this.form = document.getElementById(this.formId) as HTMLFormElement | null;
        if (!this.form || this.form.dataset.initialized === "true") return;

        this.form.dataset.initialized = "true";
        this.submitButton = this.form.querySelector('button[type="submit"]');

        this.form.addEventListener("submit", (event: SubmitEvent) =>  {
            event.preventDefault();
            event.stopPropagation();
            void this.save();
        });

        await this.refreshTable();
    }

    protected async refreshTable(): Promise<void> {
        const tableBody = document.getElementById(this.tableId) as HTMLTableSectionElement | null;
        if (!tableBody) return;

        this.tableRenderer = new TableRenderer<T>(
            tableBody,
            this.getTableColumns(),
            {
                onEdit: (item) => this.startEdit(item),
                onDelete: (item) => void this.remove(item),
            }
        );

        this.items = await this.getAllItems();
        this.tableRenderer.render(this.items);
        this.onItemsLoaded(this.items)
    }

    protected onItemsLoaded(item: T[]): void {}
    
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
            this.submitButton.textContent = "Salvar";
        }
    }

    protected abstract getTableColumns(): any[];
    protected abstract getAllItems(): Promise<T[]>;
    protected abstract save(): Promise<void>;
    protected abstract startEdit(item: T): void;
    protected abstract remove(item: T): Promise<void>;
}