import { normalizeText } from "./html.js";

const enhanced = new WeakSet<HTMLSelectElement>();
let counter = 0;

/**
 * Turns a native <select> into a searchable dropdown (type to filter, arrows + Enter to pick).
 * The <select> stays in the DOM as the source of truth, so `select.value`, `fillSelect`,
 * "change" listeners and `required` keep working. Options added later (fillSelect) and values
 * set from code (`select.value = "x"`) are picked up automatically.
 */
export function makeSearchable(select: HTMLSelectElement): void {
    if (enhanced.has(select) || !select.parentNode) return;
    enhanced.add(select);

    const id = `ss-${++counter}`;

    const wrapper = document.createElement("div");
    wrapper.className = "ss";
    wrapper.style.position = "relative";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "ss-input";
    input.autocomplete = "off";
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", `${id}-list`);
    input.setAttribute("aria-autocomplete", "list");
    const ariaLabel = select.getAttribute("aria-label");
    if (ariaLabel) input.setAttribute("aria-label", ariaLabel);

    const list = document.createElement("ul");
    list.className = "ss-list";
    list.id = `${id}-list`;
    list.setAttribute("role", "listbox");
    list.hidden = true;

    select.parentNode.insertBefore(wrapper, select);
    wrapper.append(input, list, select);

    // Visually hidden but still present, so `required` validation and labels keep working.
    select.tabIndex = -1;
    select.style.cssText =
        "position:absolute;left:0;bottom:0;width:1px;height:1px;opacity:0;pointer-events:none;";
    select.addEventListener("focus", () => input.focus());

    let visible: HTMLOptionElement[] = [];
    let activeIndex = -1;

    const selectedLabel = (): string => {
        const option = select.selectedOptions[0];
        return option && option.value !== "" ? option.textContent ?? "" : "";
    };

    const syncInput = (): void => {
        input.value = selectedLabel();
        input.placeholder = select.options[0]?.value === "" ? select.options[0].textContent ?? "" : "";
    };

    const setActive = (index: number): void => {
        const items = list.querySelectorAll<HTMLElement>("li");
        items.forEach((li, i) => li.classList.toggle("active", i === index));
        activeIndex = index;
        const current = items[index];
        if (current) {
            current.scrollIntoView({ block: "nearest" });
            input.setAttribute("aria-activedescendant", current.id);
        }
    };

    const renderList = (term: string): void => {
        const normalized = normalizeText(term.trim());
        visible = Array.from(select.options).filter(
            (option) => option.value !== "" && normalizeText(option.textContent ?? "").includes(normalized)
        );

        list.replaceChildren();
        if (visible.length === 0) {
            const empty = document.createElement("li");
            empty.className = "ss-empty";
            empty.textContent = "Nenhum resultado";
            list.appendChild(empty);
            activeIndex = -1;
            return;
        }

        visible.forEach((option, i) => {
            const li = document.createElement("li");
            li.id = `${id}-opt-${i}`;
            li.setAttribute("role", "option");
            li.textContent = option.textContent;
            if (option.value === select.value) li.classList.add("selected");
            // mousedown (not click) so it runs before the input loses focus
            li.addEventListener("mousedown", (event) => {
                event.preventDefault();
                choose(option.value);
            });
            list.appendChild(li);
        });

        const selectedIndex = visible.findIndex((option) => option.value === select.value);
        setActive(selectedIndex >= 0 ? selectedIndex : 0);
    };

    const open = (term = ""): void => {
        renderList(term);
        list.hidden = false;
        input.setAttribute("aria-expanded", "true");
    };

    const close = (): void => {
        list.hidden = true;
        input.setAttribute("aria-expanded", "false");
    };

    function choose(value: string): void {
        const changed = select.value !== value;
        select.value = value;
        syncInput();
        close();
        if (changed) select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    input.addEventListener("focus", () => {
        input.select();
        open();
    });
    input.addEventListener("click", () => {
        if (list.hidden) open();
    });
    input.addEventListener("input", () => open(input.value));

    input.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (list.hidden) {
                open();
                return;
            }
            if (visible.length === 0) return;
            const step = event.key === "ArrowDown" ? 1 : -1;
            setActive((activeIndex + step + visible.length) % visible.length);
        } else if (event.key === "Enter") {
            if (!list.hidden) {
                event.preventDefault(); // don't submit the form while picking
                const option = visible[activeIndex];
                if (option) choose(option.value);
            }
        } else if (event.key === "Escape") {
            close();
            syncInput();
        }
    });

    input.addEventListener("blur", () => {
        close();
        // Emptying the box clears the selection; any other leftover text is discarded.
        if (input.value.trim() === "" && select.value !== "") {
            choose("");
        } else {
            syncInput();
        }
    });

    // Keep the box in sync when options are (re)filled or the value is set from code.
    new MutationObserver(() => {
        syncInput();
        if (!list.hidden) renderList(input.value === selectedLabel() ? "" : input.value);
    }).observe(select, { childList: true });

    const valueDescriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
    if (valueDescriptor?.get && valueDescriptor.set) {
        Object.defineProperty(select, "value", {
            configurable: true,
            get() {
                return valueDescriptor.get!.call(this);
            },
            set(newValue: string) {
                valueDescriptor.set!.call(this, newValue);
                syncInput();
            },
        });
    }

    select.form?.addEventListener("reset", () => setTimeout(syncInput, 0));

    syncInput();
}

export function makeAllSearchable(root: ParentNode = document): void {
    root.querySelectorAll<HTMLSelectElement>("select").forEach(makeSearchable);
}
