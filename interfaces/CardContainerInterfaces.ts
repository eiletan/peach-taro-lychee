export interface CardContainerProps {
    header: string,
    content: any,
    id: string,
    isEdit: boolean,
    updateHeaderFunction?: any,
    deleteFunction?: any,
    footer?: string
    extraClass?: string,
}


export enum CardType {
    section = "SECTION",
    content = "CONTENT"
}