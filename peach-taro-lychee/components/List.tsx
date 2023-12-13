"use client";

import React from 'react';
import {useState, useRef, useEffect} from 'react';
import Button from './Button';
import { generateUID } from '@/util/util';
import { ListItem, ListProps } from '@/interfaces/ListInterfaces';

import "@/css/List.css"



// A component that is a list that can be edited through user input
export default function List(props: ListProps) {


    function renderList() {
        if ((props?.list?.length == 0 || props?.list?.length === undefined) && !props.isEdit) {
            let lid = generateUID();
            let listItem = <p className="list-none text" id={lid} key={lid}>{"Click Edit to get started!"}</p>;
            let group = <div className="list-item-group m-6">{listItem}</div>;
            return [group];
        }
        return props?.list?.map((item) => {
            let listItem = <p className="list-none text" id={item["id"]} key={item["id"]}>{item["content"]}</p>;
            let deleteButton = <Button text="Delete" bgcolor="bg-red-500" color="text-slate-50" onClick={() => props.delete(item["id"], props.id)}></Button>
            let group = <div className="list-item-group m-6">{listItem}{props.isEdit && deleteButton}</div>;
            return group;
        })
    }



    return (
        <div className={props.extraClass ? `sm:container list-container ${props.extraClass}` : `sm:container list-container`}>
            {renderList()}
            {props.isEdit 
            &&
            <form onSubmit={(e) => props.handleSubmit(e, props.id)}>
                <div className="form-group">
                    <div className="label-container">
                        <label htmlFor={`${props.id}-form-input`}>Add item</label>
                    </div>
                    
                    <input 
                        type="text" 
                        className="form-control" 
                        id={`${props.id}-form-input`} 
                        placeholder="New item" 
                        onChange={(e) => {props.onChange(props.id,e.target.value)}} 
                        required>
                    </input>
                </div>
                <Button text="Add" bgcolor="bg-green-700" color="text-slate-50" onClick={null}></Button>
                
            </form>
            }
        </div>
    );
}
 