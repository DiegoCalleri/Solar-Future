'use client'
import { EditTable } from "../../components/EditTable/EditTable"
import { useEffect, useState } from "react"
import { GET, PUT } from "../../../api/api-utils"
import { useParams } from "next/navigation"
import { BASE_URL } from "../../../api/config"
import Styles from './EditDevices.module.css'
import { Pagination } from "react-bootstrap"
import { useDispatch } from 'react-redux'
import { pushOpen, update, closePopup } from '../../redux/features/counter/counterSlice'
import { CustomToast } from "../../components/CustomToast/CustomToast"
import { SideBar } from '../../components/SideBar/SideBar'
import { Nav } from "react-bootstrap"

export default function page() {

    const [data, setData] = useState(null)
    const [digitalPins, setDigitalPins] = useState([])
    const [analogSensors, setAnalogSensors] = useState([])

    const [myDigitalPins, setMyDigitalPins] = useState([])
    const [myAnalogSensors, setMyAnalogSensors] = useState([])

    const [otherDigitalPins, setOtherDigitalPins] = useState([])
    const [otherAnalogSensors, setOtherAnalogSensors] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [items, setItems] = useState([])
    const [currentDevices, setCurrentDevices] = useState([])

    const [content, setContent] = useState(false)
    const [isUpdated, setUdpate] = useState(false)
    const dispatch = useDispatch()

    const [devicesPerPage] = useState(5)
    const MyTable = { name: "Редактирование", columns: ["№", "Наименование", "Описание", "Действие"] }

    const params = useParams()


    useEffect(() => {
        const dataPagination = content ? [...myAnalogSensors, ...otherAnalogSensors] : [...myDigitalPins, ...otherDigitalPins]
        const lastDevicesIndex = currentPage * devicesPerPage
        const firstDevicesIndex = lastDevicesIndex - devicesPerPage
        setCurrentDevices(dataPagination.slice(firstDevicesIndex, lastDevicesIndex))

        let items = [];
        for (let number = 1; number <= Math.ceil(dataPagination.length / devicesPerPage); number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => { setCurrentPage(number) }}>
                    {number}
                </Pagination.Item>,
            );
        }
        setItems(items)

    }, [myDigitalPins, myAnalogSensors, otherDigitalPins, otherAnalogSensors, currentPage, content])

    useEffect(() => {
        // Закрываем popup при загрузке страницы, чтобы убрать затемнение
        dispatch(closePopup())
        
        async function fetchData() {
            try {
                const userData = await GET(`${BASE_URL}/users/${params.userid}`)
                if (userData && !(userData instanceof Error)) {
                    setData(userData)
                }
                const dP = await GET(`${BASE_URL}/digital_pins`)
                if (dP && !(dP instanceof Error) && Array.isArray(dP)) {
                    setDigitalPins(dP)
                } else {
                    setDigitalPins([])
                }
                const aS = await GET(`${BASE_URL}/analog_sensors`)
                if (aS && !(aS instanceof Error) && Array.isArray(aS)) {
                    setAnalogSensors(aS)
                } else {
                    setAnalogSensors([])
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()

    }, [dispatch, params.userid])


    const findMyDevices = (deviceData, userDataArray) => {
        if (!Array.isArray(deviceData) || !Array.isArray(userDataArray)) {
            return []
        }
        const myDevices = deviceData.filter((item) => {
            return userDataArray.find((j) => {
                return j === item._id
            })
        })
        return myDevices
    }

    const findOtherDevices = (devicesData, myDevices) => {
        if (!Array.isArray(devicesData) || !Array.isArray(myDevices)) {
            return Array.isArray(devicesData) ? devicesData : []
        }
        return devicesData.filter(element => {
            return !myDevices.includes(element);
        });
    }


    useEffect(() => {
        // Проверяем, что данные загружены и являются массивами
        if (!data || typeof data !== 'object' || Array.isArray(data) || !Array.isArray(digitalPins) || !Array.isArray(analogSensors)) {
            return
        }
        
        const myDP_ = findMyDevices(digitalPins, Array.isArray(data.digital_pins) ? data.digital_pins : [])
        const myAS_ = findMyDevices(analogSensors, Array.isArray(data.analog_sensors) ? data.analog_sensors : [])

        const otherDP_ = findOtherDevices(digitalPins, myDP_)
        const otherAS_ = findOtherDevices(analogSensors, myAS_)

        const myAS = myAS_.map(item => {
            return { ...item, ...{ "action": "Удалить❌", "actionType": "delete", "array": "analog_sensors" } }
        })
        const myDP = myDP_.map(item => {
            return { ...item, ...{ "action": "Удалить❌", "actionType": "delete", "array": "digital_pins" } }
        })

        const otherAS = otherAS_.map(item => {
            return { ...item, ...{ "action": "Добавить✅", "actionType": "add", "array": "analog_sensors" } }
        })
        const otherDP = otherDP_.map(item => {
            return { ...item, ...{ "action": "Добавить✅", "actionType": "add", "array": "digital_pins" } }
        })

        setMyDigitalPins(myDP)
        setMyAnalogSensors(myAS)
        setOtherDigitalPins(otherDP)
        setOtherAnalogSensors(otherAS)
    }, [digitalPins, analogSensors, data])


    const handleUpdate = async () => {
        if (!data || !data._id) {
            return
        }
        try {
            const res = await PUT(`${BASE_URL}/users/${data._id}`, data)
            const newData = await GET(`${BASE_URL}/users/${params.userid}`)
            if (newData && !(newData instanceof Error)) {
                setData(newData)
            }
            if (res && res.message) {
                dispatch(pushOpen(res.message))
            }
            dispatch(update())
            setUdpate(false)
        } catch (error) {
            console.error('Error updating user:', error)
            dispatch(pushOpen('Ошибка при обновлении данных'))
        }
    }

    const updateDevicesData = (action, id, array) => {
        if (!data || !Array.isArray(data[array])) {
            return
        }

        if (action == "delete") {
            const newData = data[array].filter((idx) => {
                return idx !== id
            })
            setData({ ...data, [array]: newData })
        }

        if (action == "add") {
            const newData = [...(data[array] || [])]
            if (!newData.includes(id)) {
                newData.push(id)
                setData({ ...data, [array]: newData })
            }
        }
        setUdpate(true)
    }


    useEffect(() => {
        isUpdated ? handleUpdate() : isUpdated
    }, [isUpdated])

    return (
        <>

            <div className={Styles["editdevices__container"]}>
                <SideBar>
                    <div className={Styles["editdevices__links"]}>
                        <Nav variant="tabs" className={Styles["editdevices__nav"]}>
                            <Nav.Link href="#" eventKey="link-1" onClick={() => { setContent(false); setCurrentPage(1) }}>Управляющие цепи</Nav.Link>
                            <Nav.Link href="#" eventKey="link-2" onClick={() => { setContent(true); setCurrentPage(1) }}>Аналоговые датчики</Nav.Link>
                        </Nav>
                    </div>
                </SideBar>
                {
                    data && Array.isArray(digitalPins) && Array.isArray(analogSensors) ? (
                        <EditTable data={currentDevices} paramsTable={MyTable} handleFunction={updateDevicesData} />
                    ) : (
                        <div>Загрузка...</div>
                    )
                }
                <div className={Styles["editdevices__buttons"]}>
                    <Pagination size="sm">{items}</Pagination>
                </div>
                {/* <CustomToast /> */}
            </div>
        </>
    )
}