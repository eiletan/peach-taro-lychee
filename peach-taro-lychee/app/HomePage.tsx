'use client';
import React from 'react';
import {useState, useEffect} from 'react';
import sectionData from "../assets/sections.json"
import CardContainer from "../components/CardContainer"
import List from '../components/List'
import Button from '../components/Button';
import { generateUID } from '../util/util';



import "../css/App.css";
import "../css/HomePage.css";

interface Request {
  id: string,
  header: string,
  footer: string,
  extraClass: string,
  content: any
}

export default function HomePage() {

  const [isEdit,setIsEdit] = useState<boolean>(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const sections: any = sectionData;

  const list: Element | JSX.Element = <List isEdit={isEdit} list={[]}></List>;

  const flexx: any = <div className="grid grid-cols-1 grid-container">{list}</div>


  let testArr: Request[] = [
    {
      id: "123",
      header: "Furina",
      footer: "Last Updated",
      extraClass: "card-content",
      content: flexx
    },
    {
      id: "1234",
      header: "Focalors",
      footer: "Last Updated",
      extraClass: "card-content",
      content: flexx
    },
    {
      id: "12345",
      header: "Oratrice Mecanique D'Analyse Cardinale",
      footer: "Last Updated",
      extraClass: "card-content",
      content: flexx
    },
  ];

  useEffect(() => {
    setRequests(testArr);
  },[]);



  // const cardTest: Element | JSX.Element = <CardContainer id={123} header="Furina" content={flexx} footer="Last Updated" extraClass="card-content" isEdit={isEdit}></CardContainer>;

  // const cardTest2: Element | JSX.Element = <CardContainer id={12} header="Focalors" content={flexx} footer="Last Updated" extraClass="card-content" isEdit={isEdit}></CardContainer>;

  // const cardTest3: Element | JSX.Element = <CardContainer id={1} header="Oratrice Mecanique D'Analyse Cardinale" footer="Last Updated" content={flexx} extraClass="card-content" isEdit={isEdit}></CardContainer>;

  // const flexContainer: any = <div className="grid grid-cols-1 md:grid-cols-2">
  //   <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest}</div>}</div>
  //   <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest2}</div>}</div>
  //   <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest3}</div>}</div>
  //   </div>


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
          const list: Element | JSX.Element = <List isEdit={isEdit} list={[]}></List>;
          const flexx: any = <div className="grid grid-cols-1 grid-container">{list}</div>
          return <div className="flex flex-col flex-auto">
            <div className="flex-auto">
              <CardContainer key={val.id} id={val.id} header={val.header} content={flexx} footer={val.footer} extraClass={val.extraClass} deleteFunction={deleteCard} isEdit={isEdit}></CardContainer>
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
        {sections.map((val: {header: string, footer: string}) => {
            return <CardContainer key={1} id={"1"} header={val["header"]} footer={val["footer"]} content={generateContentCards()} isEdit={false}></CardContainer>
        })}
    </div>
    );
}