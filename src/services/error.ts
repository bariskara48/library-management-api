class CustomError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = "CustomError";
  }
}

export default CustomError;
