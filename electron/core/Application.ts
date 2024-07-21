export class Application {
    public static _instance: Application
    
    public static get getInstance() {
        if (!this._instance) {
            this._instance = new Application()
        }
        return this._instance
    }

    public init (): void {}
}