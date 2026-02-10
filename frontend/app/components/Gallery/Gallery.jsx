'use client'

import Styles from './Gallery.module.css'
import { Card } from 'react-bootstrap'

export const Gallery = () => {
    return (
        <main className={Styles["gallery__main"]}>

            <Card style={{ width: '20rem' }} className={Styles["gallery__description"]}>
                <Card.Body>
                    <Card.Title className={Styles["gallery__name"]}>Опыт команды</Card.Title>
                    <Card.Text className={Styles["gallery__text"]}>
                        <span>1. Дешифратор посылок от устройств LoRaWAN</span>
                        <span>2. Веб-приложение для управление платами Arduino</span>
                        <span>3. Система мониторинга за солнечными панелями</span>
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card className={Styles["gallery__card"]}>
            <Card.Img variant="top" src="/images/backender.jpg" className={Styles["gallery__image"]}/>
                <Card.Body>
                    <Card.Title className={Styles["gallery__name"]}>Denis Amirov</Card.Title>
                    <Card.Title>Backend developer</Card.Title>
                    <Card.Text>
                        NodeJS, MongoDB, Docker, nginx
                    </Card.Text>
                </Card.Body>
            </Card>

                
            <Card className={Styles["gallery__card"]}>
            <Card.Img variant="top" src="/images/frontender.jpg" className={Styles["gallery__image"]}/>
               <Card.Body>
                    <Card.Title className={Styles["gallery__name"]}>Denis Amirov</Card.Title>
                    <Card.Title>Frontend developer</Card.Title>
                    <Card.Text>
                        React, Redux, Bootstrap, gsap
                    </Card.Text>
                </Card.Body>
            </Card>
        </main>
    )
}
