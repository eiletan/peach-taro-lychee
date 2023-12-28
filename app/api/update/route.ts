import { CardChangeLog, ChangeLog, ListChangeLogItem } from "@/interfaces/ChangeLogInterfaces";
import { ListQueryItem , ListItem} from "@/interfaces/ListInterfaces";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const log: ChangeLog = await request.json();
    console.log(constructPostListQuery(log["addLog"]["list"]));
    console.log(constructPostListItemQuery(log["updateLog"]["list"]));
    console.log(constructPatchCardQuery(log["updateLog"]["card"]));
    return NextResponse.json({log});
}


async function postToDatabase(log: ChangeLog) {

}



function constructPostCardQuery(cards: CardChangeLog[]) {
    let prismaQuery: any = {
        data: cards
    }
    return prismaQuery;
}


function constructPostListQuery(lists: ListChangeLogItem[]) {
    let listForQuery: ListQueryItem[] = [];
    lists.forEach((list: ListChangeLogItem) => {
        let obj: ListQueryItem = {
            ownerId: list["ownerId"],
            id: list["id"]
        };
        listForQuery.push(obj);
    });
    let prismaQuery: any = {
        data: listForQuery
    }
    return prismaQuery;
}


function constructPostListItemQuery(lists: ListChangeLogItem[]) {
    let listForQuery: ListItem[] = [];
    lists.forEach((list: ListChangeLogItem) => {
        let contents: ListItem[] = list["contents"];
        listForQuery = [...listForQuery,...contents];
    });
    let prismaQuery: any = {
        data: listForQuery
    }
    return prismaQuery;
}


function constructDeleteCardQuery(cardIds: string[]) {
    let prismaQuery: any = {
        where: {
            id: {
                in: cardIds
            }
        }
    }
    return prismaQuery;
}


function constructDeleteListItemQuery(listItems: string[]) {
    let prismaQuery: any = {
        where: {
            id: {
                in: listItems
            }
        }
    }
    return prismaQuery;
}


function constructPatchCardQuery(cards: CardChangeLog[]) {
    // A raw query is necessary here
    let query: string = `UPDATE Card SET header = CASE `;
    cards.forEach((card: CardChangeLog) => {
        query = query + `WHEN id = '${card["id"]}' THEN '${card["header"]}' `
    });
    query = query + `END, footer = CASE `;
    cards.forEach((card: CardChangeLog) => {
        query = query + `WHEN id = '${card["id"]}' THEN '${card["footer"]}' `
    });
    query = query + `END WHERE id IN (`;
    cards.forEach((card: CardChangeLog) => {
        query = query + `'${card["id"]}', `
    })
    query = query.substring(0,query.length-2) + `)`; 
    return query;
}