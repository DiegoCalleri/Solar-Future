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
    }
  }

  useEffect(() => {
    if (props.params !== 'analog_sensors') return
    const payload = { number: props.data.number, host: props.data.host, port: props.data.port }
    const poll = async () => {
      const start = Date.now()
      const res = await POST(endpoints.sensorData, payload, { timeoutMs: 45000 })
      const duration = Date.now() - start
      const entry = {
        time: new Date().toLocaleTimeString('ru-RU'),
        name: props.data.name,
        number: props.data.number,
        host: props.data.host,
        port: props.data.port,
        duration,
        ok: res && !(res instanceof Error) && res.data !== undefined,
        value: res?.data,
        error: res instanceof Error ? res.message : (res?.data === 'timeout' ? 'Таймаут' : res?.data === 'no_connection' ? 'Нет соединения' : null),
      }
      props.onPollLog?.(entry)
      if (res && !(res instanceof Error)) setState(res.data)
    }
    poll()
    const id = setInterval(poll, 5000)
    return () => clearInterval(id)
  }, [props.params, props.data?.number, props.data?.host, props.data?.port, props.data?.name])

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
              <Button variant="outline-dark" size="sm" className={Styles['card__invert']} onClick={() => handleClick(false)} title="Инверсия (выкл)">
                ↻
              </Button>
            </Card.Body> :

            <Card.Body className={Styles['card__off_body']}>
              <Button variant="light">
                <img className={Styles['card__off']} src='./images/light__off.svg' onClick={() => handleClick(true)} />
              </Button>
              <Button variant="outline-light" size="sm" className={Styles['card__invert']} onClick={() => handleClick(true)} title="Инверсия (вкл)">
                ↻
              </Button>
            </Card.Body>

          }
        </>
      }
    </Card>
  )
}
