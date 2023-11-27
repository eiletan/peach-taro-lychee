'use client';
import React from 'react';
import {useState} from 'react';
import Button from './Button';
import "../css/CardContainer.css";

interface CardContainerProps {
    header: string,
    content: any,
    id: number,
    isEdit: boolean,
    deleteFunction?: any,
    footer?: string
    extraClass?: string
}


// Pass in content as props.content - this prop is required
// Pass in footer as props.footer - this prop is optional
// Pass in additional className as props.extraClass - this prop is optional
export default function CardContainer(props: CardContainerProps) {
    const [header, setHeader] = useState<string>(props.header);
    const [id, setId] = useState<number>(props.id);



    return (
        <div className={props.extraClass ? `md:container card-container ${props.extraClass}` : "md:container card-container"}>
            <div className="rounded-lg card">
                <div className="card-header card-container-header rounded-tl-lg rounded-tr-lg border-b-2 border-zinc-500">
                    {props.isEdit ? 
                    <form>
                        <div className="form-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                id={`${id}-form-input`} 
                                placeholder={header} 
                                onChange={(e) => {setHeader(e.target.value)}} 
                                required>
                            </input>
                        </div>
                    </form>
                    : 
                    <span className="text">
                        {header ? header : "No card header provided"}
                    </span>}
                </div>
                <div className="card-body card-container-body">
                    {props.content ? props.content : "No card content provided"}
                </div>
                {props.footer ? 
                <div className="card-footer card-container-footer rounded-bl-lg rounded-br-lg border-t-2 border-zinc-500">
                    {props.isEdit ? 
                    <Button text="Delete" bgcolor="bg-red-700" color="text-slate-50" onClick={() => props.deleteFunction(id)}></Button>
                    :
                    <span className="text">
                        {props.footer}
                    </span>}
                </div> 
                : 
                null}
            </div>
        </div>
    );
}