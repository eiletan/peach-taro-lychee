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

  const cardTest: Element | JSX.Element = <CardContainer header="Furina" content={list} extraClass="card-content"></CardContainer>


  return (
    <div className="home-page-container">
        <p className="text home-title">Peach Taro Lychee</p>
        {sections.map((val: {header: string, footer: string}) => {
            return <CardContainer header={val["header"]} footer={val["footer"]} content={cardTest}></CardContainer>
        })}
    </div>
);
}
