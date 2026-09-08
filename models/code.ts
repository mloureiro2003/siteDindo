export class Code {
  constructor(private value: string) {}

  getValue(): string {
    return this.value;
  }

  setValue(newValue: string): void {
    this.value = newValue;
  }
}