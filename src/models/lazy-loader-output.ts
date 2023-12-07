export class LazyLoaderOutput<T>{
    private _data: T[] = [];
    private _callback!: ((data: T[]) => void);

    constructor(callback: (data: T[]) => void) {
        this._callback = callback;
    }

    get data(): T[] {
        return this._data;
    }

    set data(value: T[]) {
        this._data = value;
        this._callback(this._data); 
        this.update(); // Call your update function here
    }

    update() {
        // console.log('Data updated: ', this._data);
    }
}