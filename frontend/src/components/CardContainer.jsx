import {React} from 'react';

// A bootstrap card that acts as a content container for the website
// Pass in header as props.header - this prop is required
// Pass in content as props.content - this prop is required
export default function CardContainer(props) {

    return (
        <div className="container-md card-container">
            <div class="card">
                <div class="card-header">
                    {props.header ? props.header : "No card header provided"}
                </div>
                <div class="card-body">
                    {props.content ? props.content : "No card content provided"}
                </div>
            </div>
        </div>
    );
}