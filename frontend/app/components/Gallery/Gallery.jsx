'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Styles from './Gallery.module.css'

gsap.registerPlugin(ScrollTrigger)

const experience = [
  'Дешифратор посылок от устройств LoRaWAN',
  'Веб-приложение для управления платами Arduino',
  'Система мониторинга за солнечными панелями',
]

const team = [
  {
    name: 'Denis Amirov',
    role: 'Backend developer',
    image: '/images/backender.jpg',
    stack: ['Node.js', 'MongoDB', 'Docker', 'nginx'],
  },
  {
    name: 'Denis Amirov',
    role: 'Frontend developer',
    image: '/images/frontender.jpg',
    stack: ['React', 'Redux', 'Bootstrap', 'GSAP'],
  },
]

export const Gallery = () => {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const introRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { y: 30, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
      })
      gsap.fromTo(introRef.current, { y: 40, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.2,
        ease: 'power3.out',
      })
      cardsRef.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el, { y: 50, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.3 + i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <main className={Styles.gallery} ref={sectionRef}>
      <header className={Styles.hero}>
        <h1 ref={titleRef} className={Styles.title}>Команда</h1>
        <p className={Styles.subtitle}>Люди и технологии за проектом Solar Future</p>
      </header>

      <section ref={introRef} className={Styles.intro}>
        <h2 className={Styles.introTitle}>Опыт команды</h2>
        <ul className={Styles.experienceList}>
          {experience.map((item, i) => (
            <li key={i} className={Styles.experienceItem}>
              <span className={Styles.experienceNumber}>{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={Styles.cards}>
        {team.map((member, i) => (
          <article
            key={i}
            ref={(el) => { cardsRef.current[i] = el }}
            className={Styles.card}
          >
            <div className={Styles.cardImageWrap}>
              <img
                src={member.image}
                alt={member.name}
                className={Styles.cardImage}
              />
              <div className={Styles.cardOverlay} />
            </div>
            <div className={Styles.cardBody}>
              <h3 className={Styles.cardName}>{member.name}</h3>
              <span className={Styles.cardRole}>{member.role}</span>
              <div className={Styles.cardStack}>
                {member.stack.map((tech, j) => (
                  <span key={j} className={Styles.stackPill}>{tech}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
