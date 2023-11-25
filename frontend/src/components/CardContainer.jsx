import {React} from 'react';
import "../css/CardContainer.css";

// A bootstrap card that acts as a content container for the website
// Pass in header as props.header - this prop is required
// Pass in content as props.content - this prop is required
// Pass in footer as props.footer - this prop is optional
// Pass in additional className as props.extraClass - this prop is optional
export default function CardContainer(props) {

    return (
        <div className={props.extraClass ? `container-md card-container ${props.extraClass}` : "container-md card-container"}>
            <div className="card">
                <div className="card-header card-container-header">
                    <span className="text">
                        {props.header ? props.header : "No card header provided"}
                    </span>
                </div>
                <div className="card-body card-container-body">
                    {props.content ? props.content : "No card content provided"}
                </div>
                {props.footer ? 
                <div className="card-footer card-container-footer">
                    <span className="text">
                        {props.footer}
                    </span>
                </div> 
                : 
                null}
            </div>
        </div>
    );
}