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
                if (listItems[p]["id"] == delListItemIds[n]) {
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
    // delListItemIds.forEach((listItemId: string) => {
    //     let isRemoved: boolean = false;
    //     newAddListItemList.forEach((list: ListChangeLogItem) => {
    //         let listItems: ListItem[] = list["contents"];
    //         let temp: ListItem[] = [];
    //         for (let i = 0; i < listItems.length; i++) {
    //             if (listItems[i]["id"] != listItemId) {
    //                 temp.push(listItems[i]);
    //             } else {
    //                 isRemoved = true;
    //             }
    //         }
    //         list["contents"] = temp;
    //     });
    //     if (!isRemoved) {
    //         newDelListItemIds.push(listItemId);
    //     }
    // });

    console.log("");
    console.log(JSON.stringify(log,null,4));
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