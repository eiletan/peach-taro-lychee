"use client";

import React from 'react';
import {useState, useRef, useEffect} from 'react';
import Button from './Button';

import "../css/List.css"


interface ListProps {
    isEdit: boolean
    extraClass?: string
}

interface ListItem {
    id: string,
    content: string | null
}


// A component that is a list that can be edited through user input
export default function List(props: ListProps) {
    const [newListItem, setNewListItem] = useState<string | null>(null);
    const [list,setList] = useState<ListItem[]>([]);
    const [id, setId] = useState<string|null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const uid: string = generateUID();
        setId(uid);
    },[]);

    function handleSubmit(e: any) {
        e.preventDefault();
        const listItemToBeAdded: ListItem = {
            "id": generateUID(),
            "content": newListItem
        }
        setList(list => {
            return [
                ...list,
                listItemToBeAdded
            ]
        });
    }

    function generateUID() {
        return Math.random().toString(36).slice(-6);
    }

    function renderList() {
        if (list.length == 0 && !props.isEdit) {
            let listItem = <p className="list-none text" id={generateUID()}>{"Click Edit to get started!"}</p>;
            let group = <div className="list-item-group m-6">{listItem}</div>;
            return [group];
        }
        return list.map((item) => {
            let listItem = <p className="list-none text" id={item["id"]}>{item["content"]}</p>;
            let deleteButton = <Button text="Delete" bgcolor="bg-red-500" color="text-slate-50" onClick={() => deleteListItem(item["id"])}></Button>
            let group = <div className="list-item-group m-6">{listItem}{props.isEdit && deleteButton}</div>;
            return group;
        })
    }

    function deleteListItem(id: string) {
        let newList = [];
        for (let item of list) {
            if (item["id"] !== id) {
                newList.push(item);
            }
        }
        setList(newList);
    }
    


    return (
        <div className={props.extraClass ? `sm:container list-container ${props.extraClass}` : `sm:container list-container`} ref={listRef}>
            {renderList()}
            {props.isEdit 
            &&
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="label-container">
                        <label htmlFor={`${id}-form-input`}>Add item</label>
                    </div>
                    
                    <input 
                        type="text" 
                        className="form-control" 
                        id={`${id}-form-input`} 
                        placeholder="New item" 
                        onChange={(e) => {setNewListItem(e.target.value)}} 
                        required>
                    </input>
                </div>
                <Button text="Add" bgcolor="bg-green-700" color="text-slate-50" onClick={null}></Button>
                
            </form>
            }
        </div>
    );
}
 