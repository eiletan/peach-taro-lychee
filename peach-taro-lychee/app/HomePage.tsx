'use client';
import React from 'react';
import {useState} from 'react';
import sectionData from "../assets/sections.json"
import CardContainer from "../components/CardContainer"
import List from '../components/List'
import Button from '../components/Button';



import "../css/App.css";
import "../css/HomePage.css";

export default function HomePage() {

const [isEdit,setIsEdit] = useState<boolean>(false);
  const sections: any = sectionData;

  const list: Element | JSX.Element = <List isEdit={isEdit} list={[]}></List>;

  const flexx: any = <div className="grid grid-cols-1 grid-container">{list}</div>

  const cardTest: Element | JSX.Element = <CardContainer id={123} header="Furina" content={flexx} footer="Last Updated" extraClass="card-content" isEdit={isEdit}></CardContainer>;

  const cardTest2: Element | JSX.Element = <CardContainer id={12} header="Focalors" content={flexx} footer="Last Updated" extraClass="card-content" isEdit={isEdit}></CardContainer>;

  const cardTest3: Element | JSX.Element = <CardContainer id={1} header="Oratrice Mecanique D'Analyse Cardinale" footer="Last Updated" content={flexx} extraClass="card-content" isEdit={isEdit}></CardContainer>;

  const flexContainer: any = <div className="grid grid-cols-1 md:grid-cols-2">
    <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest}</div>}</div>
    <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest2}</div>}</div>
    <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest3}</div>}</div>
    </div>

  return (
    <div className="home-page-container">
        <Button text={isEdit ? "Stop Editing" : "Edit"} bgcolor="bg-blue-700" color="text-slate-50" onClick={() => setIsEdit(prevIsEdit => !prevIsEdit)}></Button>
        <p className="text home-title">Peach Taro Lychee</p>
        {sections.map((val: {header: string, footer: string}) => {
            return <CardContainer id={1} header={val["header"]} footer={val["footer"]} content={flexContainer} isEdit={false}></CardContainer>
        })}
    </div>
    );
}