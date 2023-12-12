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
  const list2: Element | JSX.Element = <List ownerId={"123"} id={"1337a"} isEdit={isEdit} list={lists?.[1]?.["listItems"]} handleSubmit={addListItem} onChange={listOnChange} delete={deleteListItem}></List>;
  const list3: Element | JSX.Element = <List ownerId={"1234"} id={"1337ab"} isEdit={isEdit} list={lists?.[2]?.["listItems"]} handleSubmit={addListItem} onChange={listOnChange} delete={deleteListItem}></List>;
  const flexx: any = <div className="grid grid-cols-1 grid-container">{list1}</div>;
  const flexx2: any = <div className="grid grid-cols-1 grid-container">{list2}</div>;
  const flexx3: any = <div className="grid grid-cols-1 grid-container">{list3}</div>;


  let testArr: Request[] = [
    {
      id: "123",
      header: "Furina",
      footer: "Last Updated",
      extraClass: "card-content",
      content: flexx2
    },
    {
      id: "1234",
      header: "Focalors",
      footer: "Last Updated",
      extraClass: "card-content",
      content: flexx3
    }
  ];

  let testListsArr: ListObj[] = [
    {
      ownerId: "1234567",
      id: "1235141abc", 
      listItems: [], 
      currentNewItem: ""
    },
    {
      ownerId: "123",
      id: "1337a", 
      listItems: [], 
      currentNewItem: ""
    },
    {
      ownerId: "1234",
      id: "1337ab", 
      listItems: [
        {
          id: "abcdfeqrqoiu",
          ownerId: "1337ab",
          content: "The Hydro Archon"
      }], 
      currentNewItem: ""
    }    
  ];

  useEffect(() => {
    setRequests(testArr);
    setLists(testListsArr);
  },[]);



  // const cardTest: Element | JSX.Element = <CardContainer id={123} header="Furina" content={flexx} footer="Last Updated" extraClass="card-content" isEdit={isEdit}></CardContainer>;

  // const cardTest2: Element | JSX.Element = <CardContainer id={12} header="Focalors" content={flexx} footer="Last Updated" extraClass="card-content" isEdit={isEdit}></CardContainer>;

  // const cardTest3: Element | JSX.Element = <CardContainer id={1} header="Oratrice Mecanique D'Analyse Cardinale" footer="Last Updated" content={flexx} extraClass="card-content" isEdit={isEdit}></CardContainer>;

  // const flexContainer: any = <div className="grid grid-cols-1 md:grid-cols-2">
  //   <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest}</div>}</div>
  //   <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest2}</div>}</div>
  //   <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest3}</div>}</div>
  //   </div>

  function addListItem(e: any, ownerId: string) {
    e.preventDefault();
    let newLists = [...lists];
    for (let l of newLists) {
      if (l["id"] == ownerId) {
        console.log(l);
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
    console.log(newLists);
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
    console.log(newList);
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
    for (let item of requests) {
      if (item["id"] !== id) {
        newList.push(item);
      }
    }
    setRequests(newList);
  }

  function addCard() {
    let newCard: Request = {
      id: generateUID(),
      header: "New Card",
      footer: "Last Updated",
      extraClass: "card-content",
      content: flexx
    }
    let newList: Request[] = [...requests,newCard];
    setRequests(newList);
  }

  function generateContentCards() {
    if (requests.length == 0) {
      return <div className="container">
        <p className="text">Click on the edit button to get started!</p>
      </div>
    } else {
      let addCardButton: Element | JSX.Element = <Button text="Add Card" bgcolor="bg-green-700" color="text-slate-50" onClick={addCard}></Button>;
      let flexContainerDiv: Element | JSX.Element = <div className="flex flex-col items-center justify-center">{addCardButton}</div>
      return <div className="grid grid-cols-1 md:grid-cols-2">
        {requests.map((val: Request) => {
          const list: Element | JSX.Element = <List id={generateUID()} isEdit={isEdit} list={[]} handleSubmit={addListItem} onChange={listOnChange} delete={deleteListItem}></List>;
          const flexx: any = <div className="grid grid-cols-1 grid-container">{list}</div>
          return <div className="flex flex-col flex-auto">
            <div className="flex-auto">
              <CardContainer key={val.id} id={val.id} header={val.header} content={flexx} footer={val.footer} extraClass={val.extraClass} updateHeaderFunction={updateHeader} deleteFunction={deleteCard} isEdit={isEdit}></CardContainer>
            </div>
          </div>
        })}
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
        {/* {sections.map((val: {header: string, footer: string}) => {
            return <CardContainer key={1} id={"1"} header={val["header"]} footer={val["footer"]} content={generateContentCards()} isEdit={false}></CardContainer>
        })} */}
    </div>
    );
}