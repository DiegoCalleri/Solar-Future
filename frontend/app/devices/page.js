'use client'
import { CardsList } from '../components/CardsList/CardsList'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../../api/config'
import { useEffect, useState } from 'react'
import { GET } from '../../api/api-utils'
import Styles from './devices.module.css'
export default function page() {

    const [data, setData] = useState([])
    const user = useSelector((state) => state.counter.user)
    useEffect(() => {
        if (user) {
            GET(BASE_URL + '/users/devices/' + user._id)
                .then((res) => setData(res))
        }
    }, [user])


    return (
        <>
            {data ?
                <div className={Styles["devices__container"]}>
                    <CardsList data={data.digital_pins} params={"digital_pins"} key={"digital_pins"} />
                    <CardsList data={data.analog_sensors} params={"analog_sensors"} key={"analog_sensors"} />
                </div>
                :
                <h1>Loading...</h1>
            }
        </>
    )
}
