'use client'

import React from 'react'
import Styles from './SideBar.module.css'
import { Offcanvas } from 'react-bootstrap'
import { useState } from 'react'


export const SideBar = ({children}) => {
    console.log(children)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <div className={Styles["hamburger-lines"]} onClick={handleShow}>
              <span className={Styles["line"]}></span>
              <span className={Styles["line"]}></span>
              <span className={Styles["line"]}></span>
          </div>
  
        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Настройки</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {children}
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
}
