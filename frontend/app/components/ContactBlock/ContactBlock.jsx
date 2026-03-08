'use client'

import { useEffect } from 'react'
import Styles from './ContactBlock.module.css'

export const ContactBlock = () => {
  const email = process.env.NEXT_PUBLIC_EMAIL || 'contact@example.com'

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.async = true
    script.src =
      'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Af9355b51277a286e6292869a93f99756d20e347ece51ffbc3ea70a5caeb4212c&width=100%25&height=600&lang=ru_RU&scroll=true'

    const container = document.getElementById('yandex-map-container')
    if (container) {
      container.appendChild(script)
    }

    return () => {
      const mapContainer = document.getElementById('yandex-map-container')
      if (mapContainer) {
        mapContainer.innerHTML = ''
      }
    }
  }, [])

  return (
    <section className={Styles['contact']} id="contact">
      <h2 className={Styles['contact__title']}>Свяжитесь с нами</h2>
      <p className={Styles['contact__text']}>
        Пишите нам на{' '}
        <a href={`mailto:${email}`} className={Styles['contact__link']}>
          {email}
        </a>
      </p>
      <p className={Styles['contact__text']}>
        Адрес: Улица Фёдора Шаляпина, 4, с. Новое Шигалеево, Пестречинский район, Республика Татарстан
      </p>
      <div
        id="yandex-map-container"
        className={Styles['contact__map']}
      />
    </section>
  )
}

