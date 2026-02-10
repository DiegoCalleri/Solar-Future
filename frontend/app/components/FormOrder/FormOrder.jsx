'use client'

import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { useState } from 'react'
import { POST } from '../../../api/api-utils'
import { endpoints } from '../../../api/config'
import { useDispatch } from 'react-redux'
import { pushOpen } from '../../redux/features/counter/counterSlice'
import Styles from './FormOrder.module.css'

export const FormOrder = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState('')

  const handleInput = (event) => {
    setFormData({...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await POST(endpoints.order, {...formData, date: new Date})
    dispatch(pushOpen(res.message))
  }

  return (
    <Form onSubmit={handleSubmit} className={Styles["FormOrder__container"]}>
      <Form.Group className="mb-3">
        <Form.Label>Имя</Form.Label>
        <Form.Control type="name" placeholder="Введите имя" name="username" onInput={handleInput} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Почта</Form.Label>
        <Form.Control type="email" placeholder="Введите почту" name="email" onInput={handleInput}/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Телефонный номер</Form.Label>
        <Form.Control type="text" placeholder="Введите номер" name="number" onInput={handleInput}/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Вопрос</Form.Label>
        <textarea className="form-control" rows="3" placeholder="ваш вопрос" name="question" onInput={handleInput}></textarea>
        <Form.Text className="text-muted">
          Задайте вопрос, а мы пришлем ответ на почту
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit">
        Отправить
      </Button>
    </Form>
  )
}
