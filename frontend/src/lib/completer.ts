export class Completer<T> {
  public readonly promise: Promise<T>;
  public resolve: (value: PromiseLike<T> | T) => void = () => {};
  public reject: (reason?: any) => void = () => {};

  public isResolved: boolean = false;
  public isRejected: boolean = false;
  public isCompleted: boolean = false;

  public constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    this.promise
      .then(() => (this.isResolved = true))
      .catch(() => (this.isRejected = true))
      .finally(() => (this.isCompleted = true));
  }
}

