import { ListItem } from "./ListInterfaces"

export interface ChangeLog {
    deleteLog: DeleteLog,
    updateLog: UpdateLog,
    addLog: AddLog
}


export interface DeleteLog {
    card: string[],
    listItems: deleteListItem[]
}


export interface UpdateLog {
    card: CardChangeLog[],
    list: ListChangeLogItem[]
}

export interface AddLog {
    card: CardChangeLog[],
    list: ListChangeLogItem[]
}

export interface ListChangeLogItem {
    ownerId?: string | null,
    id: string,
    contents: ListItem[]
}

export interface CardChangeLog {
    id: string,
    header: string,
    footer: string
}


export interface deleteListItem {
    id: string,
    listId: string,
    cardId: string | null
}