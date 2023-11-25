import React from 'react';
import "../css/Button.css";

interface ButtonProps {
    text: string,
    bgcolor: string,
    color: string,
    onClick: any,
    extraClass?: string
}

export default function Button(props: ButtonProps) {
    return (
        <div className={props?.extraClass ? `btn-container ${props.extraClass}` : `btn-container`}>
            <button className={`btn ${props.bgcolor} ${props.color}`} onClick={props.onClick}>{props.text}</button>
        </div>
    );
}