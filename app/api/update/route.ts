import { CardChangeLog, ChangeLog, ListChangeLogItem } from "@/interfaces/ChangeLogInterfaces";
import { ListQueryItem , ListItem} from "@/interfaces/ListInterfaces";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const log: ChangeLog = await request.json();
    processChangeLog(log);
    // console.log(constructPostListQuery(log["addLog"]["list"]));
    // console.log(constructPostListItemQuery(log["updateLog"]["list"]));
    // console.log(constructPatchCardQuery(log["updateLog"]["card"]));
    // console.log(constructPostCardQuery(log["addLog"]["card"]));
    // console.log(constructDeleteCardQuery(log["deleteLog"]["card"]));
    // console.log(constructDeleteListItemQuery(log["deleteLog"]["listItems"]));
    return NextResponse.json({log});
}


async function postToDatabase(log: ChangeLog) {

}


function processChangeLog(log: ChangeLog) {
    // Remove entries that are both in the delete and add log
    let delCardIds: string[] = log["deleteLog"]["card"];
    let delListItemIds: string[] = log["deleteLog"]["listItems"];
    let updateCards: CardChangeLog[] = log["updateLog"]["card"];
    let addCardList: CardChangeLog[] = log["addLog"]["card"];
    let addListItemList: ListChangeLogItem[] = log["updateLog"]["list"];
    let addListList: ListChangeLogItem[] = log["addLog"]["list"];

    let newAddCard: CardChangeLog[] = [];

    addCardList.forEach((card: CardChangeLog) => {
        let indexOfId = delCardIds.indexOf(card["id"]);
        if (indexOfId != -1) {
            addListList = addListList.filter((list: ListChangeLogItem) => {
                list["ownerId"] != card["id"];
            });
            console.log("printing before updated cards");
            console.log(updateCards);
            updateCards = updateCards.filter((uCard: CardChangeLog) => {
                uCard["id"] != card["id"];
            });
            console.log("printing updated cards");
            console.log(updateCards);
            addListItemList = addListItemList.filter((list: ListChangeLogItem) => {
                list["ownerId"] != card["id"];
            })
            delCardIds.splice(indexOfId,1);
        } else {
            newAddCard.push(card);
        }
    });

    addListItemList.forEach((list: ListChangeLogItem) => {
        let listItems: ListItem[] = list["contents"];
        let newAddListItem: ListItem[] = [];
        listItems.forEach((listItem: ListItem) =>{
            let indexOfId = delListItemIds.indexOf(listItem["id"]);
            if (indexOfId != -1) {
                delListItemIds.splice(indexOfId,1);
            } else {
                newAddListItem.push(listItem);
            }
        })
        list["contents"] = newAddListItem;
    });


    log["addLog"]["card"] = newAddCard;
    log["addLog"]["list"] = addListList;
    log["updateLog"]["card"] = updateCards;
    log["updateLog"]["list"] = addListItemList;
    console.log("printing addcard");
    console.log(log["addLog"]["card"]);
    console.log("printing addlist");
    console.log(log["addLog"]["list"]);
    console.log("printing updatecard");
    console.log(log["updateLog"]["card"]);
    console.log("printing updatelist");
    console.log(log["updateLog"]["list"]);
    console.log("printing deletecard");
    console.log(log["deleteLog"]["card"]);
    console.log("printing deletelistitems");
    console.log(log["deleteLog"]["listItems"]);
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