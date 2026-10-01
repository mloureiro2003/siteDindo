export class TableRenderer {
    tableBody;
    columns;
    actions;
    constructor(tableBody, columns, actions) {
        this.tableBody = tableBody;
        this.columns = columns;
        this.actions = actions;
    }
    render(items) {
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
            actionsCell.append(this.createButton("Editar", "btn-edit", () => this.actions.onEdit(item)), this.createButton("Excluir", "btn-delete", () => this.actions.onDelete(item)));
            row.appendChild(actionsCell);
            this.tableBody.appendChild(row);
        }
    }
    createButton(label, className, onClick) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.textContent = label;
        button.addEventListener("click", onClick);
        return button;
    }
}
//# sourceMappingURL=tableRenderer.js.map