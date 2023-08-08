export interface Formatter<T> {
    format(data: T): any;
}