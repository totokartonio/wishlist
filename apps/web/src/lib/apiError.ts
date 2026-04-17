export class ApiError extends Error {
  status: number;

  constructor(status: number) {
    super(`HTTP error: ${status}`);
    this.status = status;
  }
}
