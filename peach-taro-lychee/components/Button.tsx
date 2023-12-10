import React from 'react';
import "@/css/Button.css";
import { ButtonProps } from '@/interfaces/ButtonInterfaces';

export default function Button(props: ButtonProps) {
    return (
        <div className={props?.extraClass ? `btn-container ${props.extraClass}` : `btn-container`}>
            <button className={`btn rounded-lg ${props.bgcolor} ${props.color}`} onClick={props.onClick}>{props.text}</button>
        </div>
    );
}