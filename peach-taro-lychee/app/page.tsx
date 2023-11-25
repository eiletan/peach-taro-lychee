import Image from 'next/image'
import styles from './page.module.css'
import sectionData from "../assets/sections.json";

import "../css/App.css";
import "../css/HomePage.css";

export default function Home() {
  return (
    <div className="home-page-container">
        <p className="text home-title">Sample Title Here</p>
        {/* {sectionData.map((val) => {
            return <CardContainer header={val["header"]} footer={val["footer"]}></CardContainer>
        })} */}
    </div>
);
}
