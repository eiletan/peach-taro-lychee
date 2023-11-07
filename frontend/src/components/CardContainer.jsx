import {React} from 'react';
import "../css/CardContainer.css";

// A bootstrap card that acts as a content container for the website
// Pass in header as props.header - this prop is required
// Pass in footer as props.footer - this prop is optional
// Pass in content as props.content - this prop is required
export default function CardContainer(props) {

    return (
        <div className="container-md card-container">
            <div class="card">
                <div className="card-header card-container-header text">
                    {props.header ? props.header : "No card header provided"}
                </div>
                <div className="card-body card-container-body text">
                    {props.content ? props.content : "No card content provided"}
                </div>
                {props.footer ? 
                <div className="card-footer card-container-footer text">
                    {props.footer}
                </div> 
                : 
                null}
            </div>
        </div>
    );
}