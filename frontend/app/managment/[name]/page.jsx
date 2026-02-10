'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { BASE_URL } from '../../../api/config'
import { Editor } from '../../components/Editor/Editor'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updated } from '../../redux/features/counter/counterSlice'
import {GET} from '../../../api/api-utils'

import Styles from '../page.module.css'

export default function page() {
    const dispatch = useDispatch()
    const isUpdated = useSelector((state) => state.counter.isUpdated)
    const [state, setState] = useState([])
    const params = useParams()

    useEffect(() => {
        async function fetchData() {
          const data = await GET(`${BASE_URL}/${params.name}`)
          setState(data)
        }
        fetchData()
        dispatch(updated())
      }, [isUpdated])

    return (
        <>
            {state ?
                <div className={Styles["container"]}>
                    <Editor name={params.name} data={state} />
                </div>
                :
                <p>Загрузка...</p>
            }
        </>
    )
}
