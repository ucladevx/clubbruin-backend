class Message {
    username: string;
    message: string;
    timestamp: number;
    constructor(username: string, message: string, timestamp: number) {
        this.username = username
        this.message = message
        this.timestamp = timestamp
    }
}

export { Message }