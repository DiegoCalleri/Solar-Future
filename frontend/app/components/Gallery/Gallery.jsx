'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GET } from '../../../api/api-utils'
import { endpoints } from '../../../api/config'
import Styles from './Gallery.module.css'

gsap.registerPlugin(ScrollTrigger)

export const Gallery = () => {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    GET(endpoints.teamMembers)
      .then((data) => {
        if (Array.isArray(data)) setTeam(data)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { y: 30, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.7,
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
  }, [team.length])

  return (
    <main className={Styles.gallery} ref={sectionRef}>
      <header className={Styles.hero}>
        <h1 ref={titleRef} className={Styles.title}>Команда</h1>
        <p className={Styles.subtitle}>Люди и технологии за проектом Solar Future</p>
      </header>

      <section className={Styles.cards}>
        {loading ? (
          <p className={Styles.subtitle}>Загрузка команды...</p>
        ) : team.length === 0 ? (
          <p className={Styles.subtitle}>Участники пока не добавлены</p>
        ) : (
          team.map((member, i) => (
            <article
              key={member._id || i}
              ref={(el) => { cardsRef.current[i] = el }}
              className={Styles.card}
            >
              <div className={Styles.cardImageWrap}>
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className={Styles.cardImage}
                  />
                ) : (
                  <div className={Styles.cardImagePlaceholder}>
                    {member.name.charAt(0)}
                  </div>
                )}
                <div className={Styles.cardOverlay} />
              </div>
              <div className={Styles.cardBody}>
                {member.group === 'руководитель' && (
                  <span className={Styles.cardGroupBadge}>Руководитель</span>
                )}
                <h3 className={Styles.cardName}>{member.name}</h3>
                {member.description && (
                  <span className={Styles.cardRole}>{member.description}</span>
                )}
                {member.organization && (
                  <span className={Styles.cardOrg}>{member.organization}</span>
                )}
                <div className={Styles.cardStack}>
                  {(member.skills || []).map((tech, j) => (
                    <span key={j} className={Styles.stackPill}>{tech}</span>
                  ))}
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  )
}
