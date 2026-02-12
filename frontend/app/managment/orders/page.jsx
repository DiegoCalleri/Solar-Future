'use client'
import React, { useEffect, useState } from 'react'
import { GET } from '../../../api/api-utils'
import { BASE_URL } from '../../../api/config'
import { Table, Card } from 'react-bootstrap'
import Styles from './page.module.css'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await GET(`${BASE_URL}/orders`)
        if (data && !(data instanceof Error)) {
          setOrders(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className={Styles.container}>
        <h1>Загрузка заказов...</h1>
      </div>
    )
  }

  return (
    <div className={Styles.container}>
      <Card className={Styles.card}>
        <Card.Header className={Styles.header}>
          <h2>Заказы и вопросы</h2>
          <p className={Styles.subtitle}>Всего заказов: {orders.length}</p>
        </Card.Header>
        <Card.Body>
          {orders.length === 0 ? (
            <p className={Styles.empty}>Заказов пока нет</p>
          ) : (
            <div className={Styles.tableWrapper}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Вопрос</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id || index}>
                      <td>{formatDate(order.date)}</td>
                      <td>{order.username || '—'}</td>
                      <td>
                        <a href={`mailto:${order.email}`}>{order.email || '—'}</a>
                      </td>
                      <td>
                        <a href={`tel:${order.number}`}>{order.number || '—'}</a>
                      </td>
                      <td className={Styles.question}>{order.question || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}
