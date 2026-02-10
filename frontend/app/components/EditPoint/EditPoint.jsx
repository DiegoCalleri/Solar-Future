'use client'

import { Card } from "react-bootstrap"
import { Button } from "react-bootstrap"
import { Popup } from "../Popup/Popup"
import { EditorPanel } from "../EditorPanel/EditorPanel"
import { useDispatch } from 'react-redux'
import { edit, openPopup } from '../../redux/features/counter/counterSlice'
import Styles from './EditorPoint.module.css'

export const EditPoint = ({ name, data }) => {

    const dispatch = useDispatch()

    const openPopups = (id) => {
        dispatch(openPopup(id))
        dispatch(edit())
    };

    return (
        <>
            {name === 'digital_pins' &&
                <>
                    <Card className={Styles["edit-point__card"]}>
                        <Card.Img variant="top" src={data.image} className={Styles["edit-point__img"]}/>
                        <Card.Body className={Styles["edit-point__card-body"]}>
                            <Card.Title>{data.name}</Card.Title>
                            <Card.Text>
                                {data.description}
                            </Card.Text>
                            <Button variant="primary" onClick={() => openPopups(data._id)}>Редактировать</Button>
                        </Card.Body>
                    </Card>
                    <Popup id={data._id}>
                        <EditorPanel data={data} name={name} />
                    </Popup>
                </>
            }
            {name === 'users' &&
                <>
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>{data.username}</Card.Title>
                            <Card.Text>
                                {data.email}
                            </Card.Text>
                            <Button variant="primary" onClick={() => openPopups(data._id)}>Редактировать</Button>
                        </Card.Body>
                    </Card>
                    <Popup id={data._id}>
                        <EditorPanel data={data} name={name} />
                    </Popup>
                </>
            }

            {name === 'analog_sensors' &&
                <>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={data.image} />
                        <Card.Body>
                            <Card.Title>{data.name}</Card.Title>
                            <Card.Text>
                                {data.description}
                            </Card.Text>
                            <Button variant="primary" onClick={() => openPopups(data._id)}>Редактировать</Button>
                        </Card.Body>
                    </Card>
                    <Popup id={data._id}>
                        <EditorPanel data={data} name={name} />
                    </Popup>
                </>
            }
        </>
    )
}
