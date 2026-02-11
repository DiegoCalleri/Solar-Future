'use client'
import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { PUT, DELETE, POST } from '../../../api/api-utils'
import { BASE_URL } from '../../../api/config'
import { useSelector, useDispatch } from 'react-redux'
import { pushOpen, update, setUserData, closePopup } from '../../redux/features/counter/counterSlice'
import Link from 'next/link'
import Styles from './EditorPanel.module.css'

export const EditorPanel = ({ data, name }) => {

    const dispatch = useDispatch()
    const isEditing = useSelector((state) => state.counter.isEditing)
    const [newData, setData] = useState({})

    useEffect(() => {

        if (isEditing) {
            setData(data)
        }
    }, [isEditing])

    const handleInput = (e) => {
        setData({ ...newData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await PUT(`${BASE_URL}/${name}/${data._id}`, newData)
        dispatch(pushOpen(res.message))
        dispatch(update())

    }

    const handleDelete = async (e) => {
        e.preventDefault()
        const res = await DELETE(`${BASE_URL}/${name}/${data._id}`)
        dispatch(pushOpen(res.message))
        dispatch(update())
        dispatch(closePopup())

    }

    const handlePost = async (e) => {
        e.preventDefault()
        const res = await POST(`${BASE_URL}/${name}`, newData)
        dispatch(pushOpen(res.message))
        dispatch(update())
    }

    const handleEditUserDevices = () => {
        dispatch(setUserData(data))
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                {name === 'digital_pins' &&
                    <>
                        <Form.Group className="mb-3" id={data._id}>
                            <Form.Label>Наименование</Form.Label>
                            <Form.Control name="name" onInput={handleInput} defaultValue={isEditing ? data.name : ''} required key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control name="description" onInput={handleInput} defaultValue={isEditing ? data.description : ''} required key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Номер цифрового пина</Form.Label>
                            <Form.Control name="number" onInput={handleInput} defaultValue={isEditing ? data.number : ''} required key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Картинка</Form.Label>
                            <Form.Control name="image" onInput={handleInput} defaultValue={isEditing ? data.image : ''} required key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>IP</Form.Label>
                            <Form.Control name="host" onInput={handleInput} defaultValue={isEditing ? data.host : ''} required key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Порт</Form.Label>
                            <Form.Control name="port" onInput={handleInput} defaultValue={isEditing ? data.port : ''} required key={isEditing} />
                        </Form.Group>
                    </>
                }
                {name === 'users' &&
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control name="username" onInput={handleInput} defaultValue={isEditing ? data.username : ''} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>email</Form.Label>
                            <Form.Control name="email" type='email' onInput={handleInput} defaultValue={isEditing ? data.email : ''} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control name="password" type="password" onInput={handleInput} defaultValue={isEditing ? data.password : ''} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Роль</Form.Label>
                            <Form.Control name="role" defaultValue={isEditing ? data.role : ''} onInput={handleInput} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Link href={`/editdevices/${data._id}`} onClick={handleEditUserDevices}>
                                <Form.Label className={Styles["editor-panel__link"]}>Устройства пользователя</Form.Label>
                            </Link>
                        </Form.Group>
                    </>
                }

                {name === 'analog_sensors' &&
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Наименование</Form.Label>
                            <Form.Control name="name" onInput={handleInput} defaultValue={isEditing ? data.name : ''} required key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control name="description" onInput={handleInput} defaultValue={isEditing ? data.description : ''} required key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Номер пина</Form.Label>
                            <Form.Control name="number" type='number' onInput={handleInput} defaultValue={isEditing ? data.number : ''} required key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Картинка</Form.Label>
                            <Form.Control name="image" onInput={handleInput} defaultValue={isEditing ? data.image : ''} required key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>IP</Form.Label>
                            <Form.Control name="host" onInput={handleInput} defaultValue={isEditing ? data.host : ''} required key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Порт</Form.Label>
                            <Form.Control name="port" onInput={handleInput} defaultValue={isEditing ? data.port : ''} required key={isEditing} />
                        </Form.Group>
                    </>
                }

                {name === 'team_members' &&
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя и фамилия</Form.Label>
                            <Form.Control name="name" onInput={handleInput} defaultValue={isEditing ? data.name : ''} required key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Группа</Form.Label>
                            <Form.Select name="group" onChange={handleInput} value={newData.group ?? (isEditing ? data.group : null) ?? 'участник'} key={isEditing}>
                                <option value="участник">Участник</option>
                                <option value="руководитель">Руководитель</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Описание / роль</Form.Label>
                            <Form.Control name="description" onInput={handleInput} defaultValue={isEditing ? data.description : ''} key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Организация</Form.Label>
                            <Form.Control name="organization" onInput={handleInput} defaultValue={isEditing ? data.organization : ''} key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Навыки (через запятую)</Form.Label>
                            <Form.Control name="skills" onInput={handleInput} defaultValue={isEditing ? (Array.isArray(data.skills) ? data.skills.join(', ') : data.skills) : ''} placeholder="React, Node.js, Arduino" key={isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ссылка на фото</Form.Label>
                            <Form.Control name="image" onInput={handleInput} defaultValue={isEditing ? data.image : ''} key={isEditing} placeholder="https://..." />
                        </Form.Group>
                    </>
                }

                {
                    isEditing ?
                        <div className={Styles["editor-panel__buttons"]}>
                            <Button variant="primary" type="submit">
                                Сохранить
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                🗑️
                            </Button>
                        </div> :
                        <Button variant="success" onClick={handlePost}>
                            Добавить
                        </Button>
                }

            </Form>

        </>
    )
}
