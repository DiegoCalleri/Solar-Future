'use client'
import { Card } from 'react-bootstrap'
import { ListGroup } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import Styles from './MyCard.module.css'
import { POST } from '../../../api/api-utils'
import { endpoints } from '../../../api/config'
import { useState, useEffect } from 'react'

export const MyCard = (props) => {
  const [state, setState] = useState()

  const handleClick = async (params) => {
    if (props.params == 'digital_pins') {
      const res = await POST(endpoints.switch, { ...props.data, switchOn: params })
      res.data == 200 ? setState(true) : setState(false)
      console.log(state)
    }
  }

  useEffect(() => {
    setInterval(async () => {
      if (props.params == 'analog_sensors') {
        const res = await POST(endpoints.sensorData, { "number": props.data.number,
          "host": props.data.host,
          "port": props.data.port
         })
        res ? setState(res.data) : res
      }
    }, 5000)
  }, [])

  return (
    <Card className={Styles["card"]}>
      <Card.Img variant="top" src={props.data.img} />
      <Card.Body>
        <Card.Title>{props.data.name}</Card.Title>
        <Card.Text>
          {props.data.description}
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Номер канала: {props.data.number}</ListGroup.Item>
      </ListGroup>
      {props.params != 'digital_pins' &&
        <ListGroup className="list-group-flush">
          <ListGroup.Item>Показания: {state}</ListGroup.Item>
        </ListGroup>
      }


      {props.params == 'digital_pins' &&
        <>
          {state ?

            <Card.Body className={Styles['card__on_body']}>
              <Button variant="light">
                <img className={Styles['card__on']} src='./images/light__off.svg' onClick={() => handleClick(false)} />
              </Button>
            </Card.Body> :

            <Card.Body className={Styles['card__off_body']}>
              <Button variant="light">
                <img className={Styles['card__off']} src='./images/light__off.svg' onClick={() => handleClick(true)} />
              </Button>
            </Card.Body>

          }
        </>
      }
    </Card>
  )
}
