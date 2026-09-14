export interface TableColumn<T> {
  getValue: (item: T) => string;
}

export interface TableActions<T> {
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  editLabel?: string;
  deleteLabel?: string;
}

export class TableRenderer<T> {
  private tableBody: HTMLTableSectionElement;
  private columns: TableColumn<T>[];
  private actions: TableActions<T>;

  constructor(
    tableBody: HTMLTableSectionElement,
    columns: TableColumn<T>[],
    actions: TableActions<T> = {}
  ) {
    this.tableBody = tableBody;
    this.columns = columns;
    this.actions = actions;
  }

  render(items: T[]): void {
    this.tableBody.innerHTML = "";
    for (const item of items) {
      this.tableBody.appendChild(this.buildRow(item));
    }
  }

  private buildRow(item: T): HTMLTableRowElement {
    const row = document.createElement("tr");

    for (const column of this.columns) {
      const cell = document.createElement("td");
      cell.textContent = column.getValue(item);
      row.appendChild(cell);
    }

    if (this.actions.onEdit || this.actions.onDelete) {
      row.appendChild(this.buildActionsCell(item));
    }

    return row;
  }

  private buildActionsCell(item: T): HTMLTableCellElement {
    const cell = document.createElement("td");

    if (this.actions.onEdit) {
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.textContent = this.actions.editLabel ?? "Editar";
      editButton.addEventListener("click", () => this.actions.onEdit!(item));
      cell.appendChild(editButton);
    }

    if (this.actions.onDelete) {
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn-danger";
      deleteButton.textContent = this.actions.deleteLabel ?? "Excluir";
      deleteButton.addEventListener("click", () => this.actions.onDelete!(item));
      cell.appendChild(deleteButton);
    }

    return cell;
  }
}