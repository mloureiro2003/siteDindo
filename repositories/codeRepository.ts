import { File } from "@services/file";
import { Code } from "@models/code";

export class CodeRepository {
  private static FILE_PATH = "code.json";

  getAll(): Code[] {
    const rawData: { value: string }[] = File.getFileContent(CodeRepository.FILE_PATH);
    return rawData.map(item => new Code(item.value));
  }

  create(value: string): Code {
    return new Code(value);
  }

  delete(codes: Code[], target: Code): Code[] {
    return codes.filter(code => code.getValue() !== target.getValue());
  }
}