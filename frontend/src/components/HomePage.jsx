import {React} from 'react';
import '../css/HomePage.css';
import CardContainer from './CardContainer';
import sectionData from "../assets/sections.json";

export default function HomePage() {
    
    return (
        <div className="home-page-container">
            <p className="text home-title">Sample Title Here</p>
            {sectionData.map((val) => {
                return <CardContainer header={val["header"]} footer={val["footer"]}></CardContainer>
            })}
        </div>
    );
}