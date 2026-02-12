'use client'
import { EditTable } from "../../components/EditTable/EditTable"
import { useEffect, useState, useCallback } from "react"
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
                console.log('Fetching user data for:', params.userid)
                const userData = await GET(`${BASE_URL}/users/${params.userid}`)
                console.log('User data received:', userData)
                if (userData && !(userData instanceof Error)) {
                    // Убеждаемся, что digital_pins и analog_sensors являются массивами
                    const normalizedData = {
                        ...userData,
                        digital_pins: Array.isArray(userData.digital_pins) ? userData.digital_pins : [],
                        analog_sensors: Array.isArray(userData.analog_sensors) ? userData.analog_sensors : []
                    }
                    console.log('Normalized user data:', normalizedData)
                    setData(normalizedData)
                } else {
                    console.error('Failed to fetch user data:', userData)
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
        if (!Array.isArray(deviceData) || !userDataArray) {
            return []
        }
        // userDataArray может быть массивом ID (строк) или массивом объектов с _id
        const userDeviceIds = Array.isArray(userDataArray) 
            ? userDataArray.map(item => typeof item === 'string' ? item : (item._id || item)).map(String)
            : []
        
        const myDevices = deviceData.filter((item) => {
            const deviceId = String(item._id || item)
            return userDeviceIds.includes(deviceId)
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


    const handleUpdate = useCallback(async () => {
        if (!data || !data._id) {
            console.error('handleUpdate: data или data._id отсутствует', { data })
            return
        }
        console.log('handleUpdate called with data:', { _id: data._id, digital_pins: data.digital_pins, analog_sensors: data.analog_sensors })
        try {
            const res = await PUT(`${BASE_URL}/users/${data._id}`, data)
            console.log('PUT response:', res)
            const newData = await GET(`${BASE_URL}/users/${params.userid}`)
            console.log('GET newData:', newData)
            if (newData && !(newData instanceof Error)) {
                // Нормализуем данные при обновлении
                const normalizedData = {
                    ...newData,
                    digital_pins: Array.isArray(newData.digital_pins) ? newData.digital_pins : [],
                    analog_sensors: Array.isArray(newData.analog_sensors) ? newData.analog_sensors : []
                }
                setData(normalizedData)
            }
            if (res && res.message) {
                dispatch(pushOpen(res.message))
            }
            dispatch(update())
            setUdpate(false)
        } catch (error) {
            console.error('Error updating user:', error)
            dispatch(pushOpen('Ошибка при обновлении данных'))
            setUdpate(false)
        }
    }, [data, params.userid, dispatch])

    const updateDevicesData = (action, id, array) => {
        if (!data || !data._id) {
            console.error('updateDevicesData: data или data._id отсутствует', { data, action, id, array })
            return
        }
        
        // Получаем текущий массив устройств (может быть массивом ID или объектов)
        const currentArray = data[array] || []
        // Преобразуем в массив строк ID для работы
        const currentIds = Array.isArray(currentArray) 
            ? currentArray.map(item => typeof item === 'string' ? item : (item._id || item)).map(String)
            : []
        const deviceId = String(id)

        console.log('updateDevicesData:', { action, deviceId, array, currentIds, data: data[array] })

        if (action == "delete") {
            // Удаляем ID из массива
            const newIds = currentIds.filter((idx) => idx !== deviceId)
            console.log('Deleting device:', { deviceId, oldIds: currentIds, newIds })
            setData({ ...data, [array]: newIds })
        }

        if (action == "add") {
            // Добавляем ID, если его еще нет
            if (!currentIds.includes(deviceId)) {
                const newIds = [...currentIds, deviceId]
                console.log('Adding device:', { deviceId, oldIds: currentIds, newIds })
                setData({ ...data, [array]: newIds })
            } else {
                console.log('Device already exists:', deviceId)
                return
            }
        }
        console.log('Setting isUpdated to true')
        setUdpate(true)
    }


    useEffect(() => {
        if (isUpdated) {
            console.log('isUpdated changed to true, calling handleUpdate', { isUpdated })
            handleUpdate()
        }
    }, [isUpdated, handleUpdate])

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