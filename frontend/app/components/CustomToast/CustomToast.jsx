import React, { useEffect } from 'react'
import { Toast } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { pushClose } from '../../redux/features/counter/counterSlice'
import Styles from './CustomToast.module.css'

export const CustomToast = () => {

    const pushBody = useSelector((state) => state.counter.pushBody)
    const pushState = useSelector((state) => state.counter.pushState)
    const dispatch = useDispatch()
    const close = () => dispatch(pushClose());

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(pushClose())
        }, 5000)
        return () => {
            clearTimeout(timer)
        }
    }, [pushState])

    return (
        <Toast show={pushState} onClose={close} className={Styles['toast__container']}>
            <Toast.Header>
                <span>☀️</span>
                <strong className="me-auto">SolarBot</strong>
                <small>...1 секунду назад</small>
            </Toast.Header>
            <Toast.Body>{pushBody}</Toast.Body>
        </Toast>
    )
}
