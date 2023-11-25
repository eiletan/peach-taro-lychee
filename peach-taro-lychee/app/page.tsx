import Image from 'next/image'
import styles from './page.module.css'
import sectionData from "../assets/sections.json"
import CardContainer from "../components/CardContainer"
import List from '../components/List'


import "../css/App.css";
import "../css/HomePage.css";

export default async function Home() {

  const sections: any = sectionData;

  const list: Element | JSX.Element = <List></List>;

  const flexx: any = <div className="grid grid-cols-1 grid-container">{list}</div>

  const cardTest: Element | JSX.Element = <CardContainer header="Furina" content={flexx} footer="Last Updated" extraClass="card-content"></CardContainer>;

  const cardTest2: Element | JSX.Element = <CardContainer header="Focalors" content={flexx} footer="Last Updated" extraClass="card-content"></CardContainer>;

  const cardTest3: Element | JSX.Element = <CardContainer header="Oratrice Mecanique D'Analyse Cardinale" footer="Last Updated" content={flexx} extraClass="card-content"></CardContainer>;

  const flexContainer: any = <div className="grid grid-cols-1 md:grid-cols-2">
    <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest}</div>}</div>
    <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest2}</div>}</div>
    <div className="flex flex-col flex-auto">{<div className="flex-auto">{cardTest3}</div>}</div>
    </div>



  return (
    <div className="home-page-container">
        <p className="text home-title">Peach Taro Lychee</p>
        {sections.map((val: {header: string, footer: string}) => {
            return <CardContainer header={val["header"]} footer={val["footer"]} content={flexContainer}></CardContainer>
        })}
    </div>
);
}
