import {React, useState, useRef, useEffect} from 'react';

// A component that is a list that can be edited through user input
// Pass in editing status with props.isEdit - this prop is required
export default function List(props) {
    // This state variable controls whether the list can be edited or not, and is determined by props.isEdit
    const [isEdit, setIsEdit] = useState(false);
    const [newListItem, setNewListItem] = useState(null);
    const [list,setList] = useState([]);
    const [id, setId] = useState(null);
    const listRef = useRef();

    useEffect(() => {
        setIsEdit(props.isEdit);
        const uid = generateUID();
        setId(uid);
    },[]);

    useEffect(() => {
        console.log(list);
    }, [list]);

    function handleSubmit(e) {
        e.preventDefault();
        setList(list => {
            return [
                ...list,
                {
                    "id": generateUID(),
                    "content": newListItem
                }
            ]
        });
    }

    function generateUID() {
        return Math.random().toString(36).slice(-6);
    }

    function renderList() {
        return list.map((item) => {
            let listItem = <p className="list-item text" id={item["id"]}>{item["content"]}</p>;
            let deleteButton = <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick= {() => {
                                        deleteListItem(item["id"]);
                                    }}
                                >
                                    Delete
                                </button>
            let group = <div className="list-item-group">{listItem}{isEdit && deleteButton}</div>;
            return group;
        })
    }

    function deleteListItem(id) {
        let newList = [];
        for (let item of list) {
            if (item["id"] !== id) {
                newList.push(item);
            }
        }
        console.log(newList);
        setList(newList);
    }
    


    return (
        <div className={props.extraClass ? `container-fluid list-container ${props.extraClass}` : `container-fluid list-container`} ref={listRef}>
            {renderList()}
            {isEdit 
            && 
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor={`${id}-form-input`}>Add item</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id={`${id}-form-input`} 
                        placeholder="New item" 
                        onChange={(e) => {setNewListItem(e.target.value)}} 
                        required>
                    </input>
                </div>
                <button type="submit" className="btn btn-primary">Add</button>
            </form>}
        </div>
    );
}
 