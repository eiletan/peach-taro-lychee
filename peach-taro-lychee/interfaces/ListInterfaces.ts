export interface ListItem {
    id: string,
    ownerId: string,
    content: string | null
}

export interface ListObj {
    id: string,
    listItems: ListItem[],
    currentNewItem: string
}


export interface ListProps {
    id: string,
    list: ListItem[],
    isEdit: boolean,
    handleSubmit: any,
    onChange: any,
    delete: any,
    extraClass?: string
}