'use client';
import React from 'react';
import {useState, useEffect} from 'react';
import sectionData from "@/assets/sections.json"
import CardContainer from "@/components/CardContainer"
import List from '@/components/List'
import Button from '@/components/Button';
import { generateUID } from '@/util/util';
import { Request } from '@/interfaces/RequestInterfaces';
import { ListItem, ListObj } from '@/interfaces/ListInterfaces';


import "../css/App.css";
import "../css/HomePage.css";

export default function HomePage() {

  const [isEdit,setIsEdit] = useState<boolean>(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [lists, setLists] = useState<ListObj[]>([]);
  const sections: any = sectionData;

  const list1: Element | JSX.Element = <List ownerId={"1234567"} id={"1235141abc"} isEdit={isEdit} list={lists?.[0]?.["listItems"]} handleSubmit={addListItem} onChange={listOnChange} delete={deleteListItem}></List>;
  const flexx: any = <div className="grid grid-cols-1 grid-container">{list1}</div>;

  let testList: ListObj[] = [
    {
      ownerId: "1234567",
      id: "1235141abc",
      listItems: [],
      currentNewItem: ""
    }
  ];

  useEffect(() => {
    setLists(testList);
  },[]);


  function addListItem(e: any, ownerId: string) {
    e.preventDefault();
    e.target.reset();
    let newLists = [...lists];
    for (let l of newLists) {
      if (l["id"] == ownerId) {
        let listItems: ListItem[] = l["listItems"];
        const listItemToBeAdded: ListItem = {
          "id": generateUID(),
          "ownerId": ownerId,
          "content": l["currentNewItem"]
        }
        listItems.push(listItemToBeAdded);
        l["listItems"] = listItems;
        break;
      }
    }
    setLists(newLists);
  }


  function listOnChange(ownerId: string, content: string) {
    let newList = [...lists];
    for (let list of newList) {
      if (list["id"] == ownerId) {
        list["currentNewItem"] = content;
        break;
      }
    }
    console.log(content);
    setLists(newList);
  }


  function deleteListItem(id: string, ownerId: string) {
    let newList = [...lists];
    for (let list of newList) {
        if (list["id"] == ownerId) {
          console.log(list);
          let listItems: ListItem[] = list["listItems"];
          let newListList = [];
          for (let item of listItems) {
            if (item["id"] !== id) {
              newListList.push(item);
            }
          }
          list["listItems"] = newListList;
        }
    }
    setLists(newList);
  }


  function updateHeader(id: string, newHeader: string) {
    let updateRequest = [...requests];
    for (let request of updateRequest) {
      if (request["id"] == id) {
        request["header"] = newHeader;
        break;
      }
    }
  }


  function deleteCard(id: string) {
    let newList = [];
    let card;
    
    for (let item of requests) {
      if (item["id"] !== id) {
        newList.push(item);
      } else {
        card = item;
      }
    }
    let newListList = [];
    console.log(lists);
    for (let list of lists) {
      if (list["ownerId"] !== card["id"]) {
        newListList.push(list);
      }
    }
    console.log(newListList);
    setLists(newListList);
    setRequests(newList);
  }

  function addCard() {
    let id = generateUID();
    let listId = generateUID();
    let newCard: Request = {
      id: id,
      header: "New Card",
      footer: "Last Updated",
      extraClass: "card-content",
      content: null
    }
    let newList: Request[] = [...requests,newCard];
    let newCardList: ListObj = {
      ownerId: id,
      id: listId,
      listItems: [],
      currentNewItem: ""
    }
    setRequests(newList);
    setLists([...lists,newCardList]);
  }

  function generateContentCardsHelper() {
    return requests.map((val: Request) => {
      let listObj: ListObj;
      for (let list of lists) {
        if (list["ownerId"] == val["id"]) {
          listObj = list;
        }
      }
      const list: Element | JSX.Element = <List ownerId={val["id"]} id={listObj["id"]} isEdit={isEdit} list={listObj["listItems"]} handleSubmit={addListItem} onChange={listOnChange} delete={deleteListItem}></List>;
      const flexx: any = <div className="grid grid-cols-1 grid-container">{list}</div>
      return <div className="flex flex-col flex-auto">
            <div className="flex-auto">
              <CardContainer key={val.id} id={val.id} header={val.header} content={flexx} footer={val.footer} extraClass={val.extraClass} updateHeaderFunction={updateHeader} deleteFunction={deleteCard} isEdit={isEdit}></CardContainer>
            </div>
          </div>
    });
  }

  function generateContentCards() {
    if (requests.length == 0 && !isEdit) {
      return <div className="container">
        <p className="text">Click on the edit button to get started!</p>
      </div>
    } else {
      let addCardButton: Element | JSX.Element = <Button text="Add Card" bgcolor="bg-green-700" color="text-slate-50" onClick={addCard}></Button>;
      let flexContainerDiv: Element | JSX.Element = <div className="flex flex-col items-center justify-center">{addCardButton}</div>
      return <div className="grid grid-cols-1 md:grid-cols-2">
        {generateContentCardsHelper()}
        {isEdit &&
        flexContainerDiv
        }
        </div>;
    }
  }

  

  return (
    <div className="home-page-container">
        <Button text={isEdit ? "Stop Editing And Save Changes" : "Edit"} bgcolor="bg-blue-700" color="text-slate-50" onClick={() => setIsEdit(prevIsEdit => !prevIsEdit)}></Button>
        <p className="text home-title">Peach Taro Lychee</p>
        <CardContainer key={"123456"} id={"123456"} header={sections[0]["header"]} footer={sections[0]["footer"]} content={generateContentCards()} isEdit={false}></CardContainer>
        <CardContainer key={"1234567"} id={"1234567"} header={sections[1]["header"]} footer={sections[1]["footer"]} content={flexx} isEdit={false}></CardContainer>
    </div>
    );
}