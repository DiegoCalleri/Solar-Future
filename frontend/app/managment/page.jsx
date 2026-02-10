'use client'
import Link from 'next/link'
import React from 'react'
import Styles from './page.module.css'
import { Card } from 'react-bootstrap'

export default function page() {
  const data = [
    {
      "name": "Пользователи",
      "description": "Добавление, обновление и удалеление данных пользователя",
      "link": "/managment/users"
    },
    {
      "name": "Управляющие сигналы",
      "description": "Добавление, обновление и удалеление данных по управляющим сигналам",
      "link": "/managment/digital_pins"
    },
    {
      "name": "Аналоговые датчики",
      "description": "Добавление, обновление и удалеление данных по сенсорам",
      "link": "/managment/analog_sensors"
    }
  ]


  return (
    <>
      <div className={Styles["managment__container"]}>
        {
          data.map((item, index) => {
            return (
              <Link href={item.link} className={Styles["managment__link"]} key={index}>
                <Card className={Styles["managment__card"]}>
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            )
          })
        }
      </div>
    </>
  )
}
