import { Formatter } from "./Formatter";

export class GenericFormatter<T> implements Formatter<T> {
    format(data: T): any {
      return JSON.stringify(data);
    }
  }