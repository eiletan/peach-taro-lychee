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

    let newDelCards: string[] = [];
    let newDelListItemIds: string[] = [];
    let newAddCards: CardChangeLog[] = [];
    let newAddListList: ListChangeLogItem[] = [];
    let newUpdateCards: CardChangeLog[] = [];
    let newAddListItemList: ListChangeLogItem[] = [];

    if (delCardIds.length == 0) {
        newAddCards = addCardList;
        newAddListList = addListList;
        newUpdateCards = updateCards;
        newAddListItemList = addListItemList; 
    }


    let leakedListItemIds: string[] = [];

    delCardIds.forEach((cardId: string) => {
        // Check add cards log, lists associated with the cards also need to be deleted
        // Check update cards log, lists associated with the cards also need to be deleted
        let isOverlap: boolean = false;
        addCardList.forEach((card: CardChangeLog) => {
            if (cardId == card["id"]) {
                isOverlap = true;
            } else {
                newAddCards.push(card);
            }
        });
        addListList.forEach((list: ListChangeLogItem) => {
            if (cardId == list["ownerId"]) {
                isOverlap = true;
            } else {
                newAddListList.push(list);
            }
        });
        updateCards.forEach((card: CardChangeLog) => {
            if (cardId == card["id"]) {
                isOverlap = true;
            } else {
                newUpdateCards.push(card);
            }
        });
        addListItemList.forEach((list: ListChangeLogItem) => {
            if (cardId == list["ownerId"]) {
                isOverlap = true;
                let idArr: string[] = [];
                for (let i = 0; i < list["contents"].length; i++) {
                    idArr.push(list["contents"][i]["id"]);
                }
                leakedListItemIds = [...leakedListItemIds,...idArr];
            } else {
                newAddListItemList.push(list);
            }
        });
        if (!isOverlap) {
            newDelCards.push(cardId);
        }
    });

    // console.log("enter");
    // console.log(delListItemIds);
    // console.log(leakedListItemIds);
    // delListItemIds = delListItemIds.filter((listItemId: string) => {
    //     leakedListItemIds.indexOf(listItemId) == -1
    // });
    // console.log(delListItemIds);
    // console.log("exit");
    
    delListItemIds.forEach((listItemId: string) => {
        let isRemoved: boolean = false;
        newAddListItemList.forEach((list: ListChangeLogItem) => {
            let listItems: ListItem[] = list["contents"];
            let temp: ListItem[] = [];
            for (let i = 0; i < listItems.length; i++) {
                if (listItems[i]["id"] != listItemId) {
                    temp.push(listItems[i]);
                } else {
                    isRemoved = true;
                }
            }
            list["contents"] = temp;
        });
        if (!isRemoved) {
            newDelListItemIds.push(listItemId);
        }
    });


    log["addLog"]["card"] = newAddCards;
    log["addLog"]["list"] = newAddListList;
    log["updateLog"]["card"] = newUpdateCards;
    log["updateLog"]["list"] = newAddListItemList;
    log["deleteLog"]["card"] = newDelCards;
    log["deleteLog"]["listItems"] = newDelListItemIds;
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