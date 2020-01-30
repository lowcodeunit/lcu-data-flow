export class ConnectionStringModel {
    /**
     * Connection key name
     */
    public Key: string;

    /**
     * Connection value
     */
    public Value: string;

    constructor(key: string, value: string) {
        this.Key = key;
        this.Value = value;
    }
}
