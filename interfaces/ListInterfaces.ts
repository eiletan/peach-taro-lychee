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

export interface ListQueryItem {
    ownerId: string | null | undefined;
    id: string;
}


export interface ListProps {
    ownerId: string | null,
    id: string,
    list: ListItem[] | null,
    isEdit: boolean,
    handleSubmit: Function,
    onChange: Function,
    delete: Function,
    extraClass?: string
}