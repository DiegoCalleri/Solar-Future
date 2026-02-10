'use client'
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Styles from './Cover.module.css'


export const Cover = ({ imgPath, title, description, btnTitle }) => {

  return (
    <header>

      <div
        className={Styles["cover__img"]} style={{ backgroundImage: `url(${imgPath})` }}>
        <div className={Styles["cover__mask"]} style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
          <div className='d-flex justify-content-center align-items-center h-100'>
            <div className={Styles["cover__title"]}>
              <h1 className='mb-3'>{title}</h1>
              <h4 className='mb-3'>{description}</h4>
              <Button tag="a" size="lg">
                <a href="#order" className={Styles["cover__anchore"]}>
                  {btnTitle}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
