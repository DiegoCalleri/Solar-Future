'use client'
import { CardsList } from '../components/CardsList/CardsList'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../../api/config'
import { useEffect, useState, useCallback } from 'react'
import { GET } from '../../api/api-utils'
import { Button, Modal } from 'react-bootstrap'
import Styles from './devices.module.css'

const MAX_LOG_ENTRIES = 200

export default function page() {
    const [data, setData] = useState([])
    const [pollLog, setPollLog] = useState([])
    const [showLogModal, setShowLogModal] = useState(false)
    const user = useSelector((state) => state.counter.user)

    const addPollLog = useCallback((entry) => {
        setPollLog((prev) => {
            const next = [entry, ...prev]
            return next.length > MAX_LOG_ENTRIES ? next.slice(0, MAX_LOG_ENTRIES) : next
        })
    }, [])

    useEffect(() => {
        if (user) {
            GET(BASE_URL + '/users/devices/' + user._id)
                .then((res) => {
                    if (res && !(res instanceof Error) && res.digital_pins) setData(res)
                })
        }
    }, [user])

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await GET(BASE_URL + '/me');
                if (response instanceof Error && response.status === 401) {
                    window.location.href = '/';
                }
            } catch (error) {
                if (error.status === 401) {
                    window.location.href = '/';
                }
            }
        };
        
        checkAuth();
    }, []); 

    return (
        <>
            {data ? (
                <div className={Styles["devices__wrap"]}>
                    <div className={Styles["devices__container"]}>
                        <div className={Styles["devices__header"]}>
                            <Button variant="outline-secondary" size="sm" onClick={() => setShowLogModal(true)}>
                                Лог опроса
                            </Button>
                        </div>
                        <CardsList data={data.digital_pins} params={"digital_pins"} key={"digital_pins"} />
                        <CardsList data={data.analog_sensors} params={"analog_sensors"} key={"analog_sensors"} onPollLog={addPollLog} />
                    </div>
                </div>
            ) : (
                <div className={Styles["devices__wrap"]}><h1>Loading...</h1></div>
            )}

            <Modal show={showLogModal} onHide={() => setShowLogModal(false)} size="lg" scrollable className={Styles["devices__modal"]}>
                <Modal.Header closeButton>
                    <Modal.Title>Лог опроса датчиков</Modal.Title>
                </Modal.Header>
                <Modal.Body className={Styles["log__body"]}>
                    {(!data?.digital_pins?.length && !data?.analog_sensors?.length) ? (
                        <p className="text-muted">Для открытия этой вкладки нужно связаться с администрацией.</p>
                    ) : pollLog.length === 0 ? (
                        <p className="text-muted">Пока записей нет. Опрос аналоговых датчиков раз в 5 сек.</p>
                    ) : (
                        <table className={Styles["log__table"]}>
                            <thead>
                                <tr>
                                    <th>Время</th>
                                    <th>Устройство</th>
                                    <th>Канал</th>
                                    <th>Результат</th>
                                    <th>Значение</th>
                                    <th>RAW (от модема)</th>
                                    <th>мс</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pollLog.map((entry, i) => (
                                    <tr key={i} className={entry.ok ? Styles["log__row_ok"] : Styles["log__row_err"]}>
                                        <td>{entry.time}</td>
                                        <td>{entry.name}</td>
                                        <td>{entry.number}</td>
                                        <td>{entry.error || (entry.ok ? 'OK' : '—')}</td>
                                        <td>{entry.value != null ? String(entry.value) : '—'}</td>
                                        <td className={Styles["log__raw"]} title={entry.raw}>{entry.raw || '—'}</td>
                                        <td>{entry.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLogModal(false)}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
