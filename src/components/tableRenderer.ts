export interface TableColumn<T> {
  getValue: (item: T) => string | number;
}

export interface TableActions<T> {
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

export class TableRenderer<T> {
  constructor(
    private tableBody: HTMLTableSectionElement,
    private columns: TableColumn<T>[],
    private actions: TableActions<T>
  ) {}

  render(items: T[]): void {
    this.tableBody.replaceChildren();

    if (items.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = this.columns.length + 1;
      cell.className = "empty";
      cell.textContent = "Nenhum registro encontrado.";
      row.appendChild(cell);
      this.tableBody.appendChild(row);
      return;
    }

    for (const item of items) {
      const row = document.createElement("tr");

      for (const column of this.columns) {
        const cell = document.createElement("td");
        cell.textContent = String(column.getValue(item)); // textContent: no HTML injection
        row.appendChild(cell);
      }

      const actionsCell = document.createElement("td");
      actionsCell.className = "actions";
      actionsCell.append(
        this.createButton("Editar", "btn-edit", () => this.actions.onEdit(item)),
        this.createButton("Excluir", "btn-delete", () => this.actions.onDelete(item))
      );
      row.appendChild(actionsCell);

      this.tableBody.appendChild(row);
    }
  }

  private createButton(label: string, className: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
  }
}
