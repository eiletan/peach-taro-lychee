export interface ListItem {
    id: string,
    ownerId: string,
    content: string | null
}

export interface ListObj {
    ownerId: string | null;
    id: string,
    listItems: ListItem[],
    currentNewItem: string
}


export interface ListProps {
    ownerId: string | null,
    id: string,
    list: ListItem[] | null,
    isEdit: boolean,
    handleSubmit: any,
    onChange: any,
    delete: any,
    extraClass?: string
}