import cuid from "cuid";

export function generateUID(): string {
    return cuid();
}

export function convertTimestamp(timestamp: string) {
    let date: Date = new Date(timestamp);
    let converted: string = date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
    return converted;
}