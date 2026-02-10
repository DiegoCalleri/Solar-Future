'use client'
import React from 'react'
import { EditPoint } from '../EditPoint/EditPoint'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { create, openPopup } from '../../redux/features/counter/counterSlice'
import { Popup } from "../Popup/Popup"
import { EditorPanel } from "../EditorPanel/EditorPanel"
import Styles from './Editor.module.css'

export const Editor = ({ name, data }) => {
  const dispatch = useDispatch()

  const openPopups = () => {
    dispatch(openPopup());
    dispatch(create())
  };

  return (
    <>
      <div className={Styles["editor__container"]}>
        {data &&
          data.map((item, id) => {
            return <EditPoint data={item} name={name} key={id} />
          })
        }
      </div>
      <div>
        <Button variant="success" onClick={openPopups}>Добавить</Button>
      </div>
      <Popup >
        <EditorPanel data={data} name={name} />
      </Popup>
    </>
  )
}
