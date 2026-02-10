'use client'
import React from 'react'
import { Image, Button } from 'react-bootstrap'
import Styles from './ContentBlock.module.css'
import { useEffect, useState } from 'react'
import { gsap } from "gsap";

export const ContentBlock = () => {
    const data = [
        `C помощью системы Solar Future можно управлять и проводить мониторинг различного оборудования через сеть GSM`,
        `Для этого мы разработали шкаф диспетчеризации и протестировали его на солнечных панелях SDM-50`,
        'Данные с устройства можно получить в любом браузере. Управлять электрической нагрузкой можно через телефон и планшет',
        `Удобный веб-интерфейс администратора позволяет управлять правами
         пользователей, назначать роли, добавлять новое оборудование и т.п`
    ]
    const dataTitle = ['Автоматизация в возобновляемой энергетике', 
        'Шкаф диспетчеризации', 
        'Панель отображения',
        `Интерфейс администратора`]
    
    const dataImage = ["electric_shield.png",
        "electric_shield_open.jfif",
        "devicesPanel.png",
        "edit.png"
    ]

    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [image, setImage] = useState('')
    const [numberContent, setNumberContent] = useState(0)

    useEffect(() => {
        gsap.to("[name='content']", { duration: 1, x: '0px' })
        setContent(data[numberContent])
        setTitle(dataTitle[numberContent])
        setImage(dataImage[numberContent])
        gsap.to("[name='content']", { duration: 0, x: '-1000px' })
    }, [numberContent])

    const handleClick = () => {
        numberContent == data.length - 1 ? setNumberContent(0) : setNumberContent(numberContent + 1)
    }

    return (
        <>
            <div name="content" className={Styles["ContentBlock__main"]}>
                <Image src={`./images/${image}`} className={Styles["ContentBlock__img"]} />
                <div className={Styles["ContentBlock__content"]}>
                    <h1 className={Styles["ContentBlock__title"]}>
                        {title}
                    </h1>
                    <p className={Styles["ContentBlock__body"]} >
                        {content}
                    </p>
                    <div className={Styles["ContentBlock__next"]}>
                        <Button onClick={handleClick} variant="outline-dark">Следующий слайд</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
