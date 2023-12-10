export interface ListItem {
    id: string,
    content: string | null
}


export interface ListProps {
    list: ListItem[],
    isEdit: boolean,
    extraClass?: string
}