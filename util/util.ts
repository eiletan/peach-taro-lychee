import cuid from "cuid";

export function generateUID(): string {
    return cuid();
}