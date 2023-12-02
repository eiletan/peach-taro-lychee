'use client';
import React from 'react';
import {useState} from 'react';
import Button from './Button';
import "../css/CreateCardModal.css"


interface CreateCardModalProps {
    header: string,
    isActive: boolean
}


export default function CreateCardModal(props: CreateCardModalProps) {
    

    return (
        <>
        {props.isActive &&
            <div className="modal-container h-screen w-screen flex items-center justify-center absolute top-0">
                <div className="md:container modal-content">
                    <div className="modal-content-header">
                        <p className="text modal-content-header-text">
                            {props.header}
                        </p>
                    </div>
                </div>
            </div>
        }
        </>
    );
}