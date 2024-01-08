import { CardChangeLog, ChangeLog, ListChangeLogItem, AddLog, UpdateLog, DeleteLog, deleteListItem } from "@/interfaces/ChangeLogInterfaces";
import { ListQueryItem , ListItem} from "@/interfaces/ListInterfaces";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const log: ChangeLog = await request.json();
    processChangeLog(log);
    const addLog: AddLog = log["addLog"];
    const updateLog: UpdateLog = log["updateLog"];
    const deleteLog: DeleteLog = log["deleteLog"];
    const addCardQuery = constructPostCardQuery(addLog["card"]);
    const addListQuery = constructPostListQuery(addLog["list"]);
    const addListItemQuery = constructPostListItemQuery(updateLog["list"]);
    const updateCardQuery = constructPatchCardQuery(updateLog["card"]);
    const deleteCardQuery = constructDeleteCardQuery(deleteLog["card"]);
    const deleteListItemQuery = constructDeleteListItemQuery(deleteLog["listItems"]);
    const cardIds: string[] = getAllCardIds(log);
    try {
        const [addCardCount, addListCount, addListItemCount, deleteCardCount, deleteListItemCount, updateCardCount] = await prisma.$transaction([
            prisma.card.createMany(addCardQuery),
            prisma.list.createMany(addListQuery),
            prisma.listItem.createMany(addListItemQuery),
            prisma.card.deleteMany(deleteCardQuery),
            prisma.listItem.deleteMany(deleteListItemQuery),
            prisma.$executeRawUnsafe(`${updateCardQuery}`),
        ]);
    } catch (error: any) {
        console.log("Error saving changes to database");
        console.log(error);
        return NextResponse.json({error: error.code, message: 'An error was encountered while saving your changes. Please reload the page and try again.'}, {status: 400});
    }
    // If POST was successful, update the card footers of each card that had changes
    try {
        const updateCards = await prisma.card.updateMany(constructUpdateCardFooterQuery(cardIds));
    } catch (error: any) {
        console.log("Error updating update times");
        console.log(error);
        return NextResponse.json({error: error.code, message: 'An error was encountered while saving your changes. Please reload the page and try again.'},{status: 500});
    }
    // TODO: Perform another query and return all cards that were updated
    let cards: any;
    try {
        cards = await prisma.card.findMany(constructFindCardsQuery(cardIds));
    } catch (error: any) {
        console.log("Error returning cards");
        console.log(error);
        return NextResponse.json({error: error.code, message: 'An error was encountered while saving your changes. Please reload the page and try again.'},{status: 500});
    }
    return NextResponse.json({cards}, {status: 201});
}


function getAllCardIds(log: ChangeLog) {
    let add: AddLog = log["addLog"];
    let update: UpdateLog = log["updateLog"];
    let deleted: DeleteLog = log["deleteLog"]; 
    let cardIds: Set<string> = new Set<string>();
    add["card"].forEach((card: CardChangeLog) => {
        cardIds.add(card["id"]);
    });
    update["card"].forEach((card: CardChangeLog) => {
        cardIds.add(card["id"]);
    })
    update["list"].forEach((list: ListChangeLogItem) => {
        if (list["ownerId"] != null) {
            cardIds.add(list["ownerId"]);
        }
    });
    deleted["listItems"].forEach((listItem: deleteListItem) => {
        if (listItem["cardId"] != null) {
            cardIds.add(listItem["cardId"]);
        }
    })
    let ret: string[] = Array.from(cardIds.values());
    return ret;
}

function constructFindCardsQuery(cardIds: string[]) {
    let prismaQuery: any = {
        where: {
            id: {
                in: cardIds
            },
        }
    }
    return prismaQuery;
}

function constructUpdateCardFooterQuery(cardIds: string[]) {
    let prismaQuery: any = {
        where: {
            id: {
                in: cardIds
            },
        },
        data: {
            footer: "Last Updated"
        }
    }
    return prismaQuery;
}

function processChangeLog(log: ChangeLog) {
    // Remove entries that are both in the delete and add log
    let delCardIds: string[] = log["deleteLog"]["card"];
    let delListItemIds: deleteListItem[] = log["deleteLog"]["listItems"];
    let updateCards: CardChangeLog[] = log["updateLog"]["card"];
    let addCardList: CardChangeLog[] = log["addLog"]["card"];
    let addListItemList: ListChangeLogItem[] = log["updateLog"]["list"];
    let addListList: ListChangeLogItem[] = log["addLog"]["list"];


    for (let h = delCardIds.length-1; h >= 0; h--) {
        // Check add cards log, lists associated with the cards also need to be deleted
        // Check update cards log, lists associated with the cards also need to be deleted
        let isOverlap: boolean = false;
        // fix by using reverse loops
        for (let i = addCardList.length-1; i >= 0; i--) {
            if (delCardIds[h] == addCardList[i]["id"]) {
                isOverlap = true;
                addCardList.splice(i,1);
            }
        }
        for (let j = addListList.length-1; j >= 0; j--) {
            if (delCardIds[h] == addListList[j]["ownerId"]) {
                isOverlap = true;
                addListList.splice(j,1);
            }
        }
        for (let k = updateCards.length-1; k >= 0; k--) {
            if (delCardIds[h] == updateCards[k]["id"]) {
                isOverlap = true;
                updateCards.splice(k,1);
            }
        }
        for (let l = addListItemList.length-1; l >= 0; l--) {
            if (delCardIds[h] == addListItemList[l]["ownerId"]) {
                isOverlap = true;
                addListItemList.splice(l,1);
            }
        }
        if (isOverlap) {
            delCardIds.splice(h,1);
        }
    }
    for (let n = delListItemIds.length-1; n >= 0; n--) {
        let isRemoved: boolean = false;
        for (let o = addListItemList.length-1; o >= 0; o--) {
            let listItems: ListItem[] = addListItemList[o]["contents"];
            for (let p = listItems.length-1; p >= 0; p--) {
                if (listItems[p]["id"] == delListItemIds[n]["id"]) {
                    isRemoved = true;
                    listItems.splice(p,1);
                    break;
                }
            }
            if (isRemoved) {
                break;
            }
        }
        if (isRemoved) {
            delListItemIds.splice(n,1);
        }
    }
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


function constructDeleteListItemQuery(listItems: deleteListItem[]) {
    let ids: string[] = [];
    listItems.forEach((item: deleteListItem) => {
        ids.push(item["id"]);
    });
    let prismaQuery: any = {
        where: {
            id: {
                in: ids
            }
        }
    }
    return prismaQuery;
}


function constructPatchCardQuery(cards: CardChangeLog[]) {
    // A raw query is necessary here
    if (cards.length == 0) {
        return "";
    }
    let query: string = `UPDATE Public."Card" SET header = CASE `;
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