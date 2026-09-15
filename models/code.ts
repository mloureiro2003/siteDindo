export class Code {
  constructor(private code: string) {}

  getCode(): string {
    return this.code;
  }

  setCode(newCode: string): void {
    this.code = newCode;
  }
}