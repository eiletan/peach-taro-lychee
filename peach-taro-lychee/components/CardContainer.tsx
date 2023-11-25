import React from 'react';
import "../css/CardContainer.css";

interface CardContainerProps {
    header: string,
    content: any,
    footer?: string
    extraClass?: string
}


// Pass in content as props.content - this prop is required
// Pass in footer as props.footer - this prop is optional
// Pass in additional className as props.extraClass - this prop is optional
export default function CardContainer(props: CardContainerProps) {

    return (
        <div className={props.extraClass ? `md:container card-container ${props.extraClass}` : "md:container card-container"}>
            <div className="rounded-lg card">
                <div className="card-header card-container-header rounded-tl-lg rounded-tr-lg">
                    <span className="text">
                        {props.header ? props.header : "No card header provided"}
                    </span>
                </div>
                <div className="card-body card-container-body">
                    {props.content ? props.content : "No card content provided"}
                </div>
                {props.footer ? 
                <div className="card-footer card-container-footer rounded-bl-lg rounded-br-lg">
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