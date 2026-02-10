import React from 'react'
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { authorize, isResponseOk } from '../../../api/api-utils';
import { endpoints } from '../../../api/config';
import { useDispatch, useSelector } from 'react-redux';
import { login, setToken, closePopup } from '../../redux/features/counter/counterSlice';


export const AuthForm = ({setAuth}) => {

    const dispatch = useDispatch()
    const user = useSelector((state) => state.counter.user)

    const [authData, setAuthData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState({ status: null, text: null });

    const handleInput = (e) => {
        setAuthData({ ...authData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = await authorize(endpoints.auth, authData);

        if (isResponseOk(userData)) {
            setMessage({ status: "success", text: "Вы авторизовались!" });
            dispatch(setToken(userData.jwt))
            dispatch(login(userData))
            setAuth(true)
        } else {
            setMessage({ status: "error", text: "Неверные почта или пароль" });
        }

    }

    useEffect(() => {
        let timer
        if (user) {
            timer = setTimeout(() => {
                setMessage({ status: null, text: null });
                dispatch(closePopup());
            }, 2000)
        }
        return () => clearTimeout(timer)
    }, [user])

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Логин</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    onInput={handleInput} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    onInput={handleInput} />
            </Form.Group>
            {message.status &&
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Text className="text-muted">
                        {message.text}
                    </Form.Text>
                </Form.Group>
            }

            <Button variant="primary" type="submit">
                войти
            </Button>
        </Form>
    )
}
