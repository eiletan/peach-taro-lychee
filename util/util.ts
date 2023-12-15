export function generateUID(): string {
    return Math.random().toString(36).slice(-6);
}