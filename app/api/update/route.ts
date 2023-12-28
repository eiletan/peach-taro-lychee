import { ChangeLog, ListChangeLogItem } from "@/interfaces/ChangeLogInterfaces";
import { ListQueryItem , ListItem} from "@/interfaces/ListInterfaces";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const log: ChangeLog = await request.json();
    console.log(constructPostListQuery(log["addLog"]["list"]));
    console.log(constructPostListItemQuery(log["updateLog"]["list"]));
    return NextResponse.json({log});
}


async function postToDatabase(log: ChangeLog) {

}

function constructPostListQuery(lists: ListChangeLogItem[]) {
    let query: ListQueryItem[] = [];
    lists.forEach((list: ListChangeLogItem) => {
        let obj: ListQueryItem = {
            ownerId: list["ownerId"],
            id: list["id"]
        };
        query.push(obj);
    });
    return query;
}


function constructPostListItemQuery(lists: ListChangeLogItem[]) {
    let query: ListItem[] = [];
    lists.forEach((list: ListChangeLogItem) => {
        let contents: ListItem[] = list["contents"];
        query = [...query,...contents];
    });
    return query;
}