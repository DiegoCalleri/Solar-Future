'use client'
import { useGetMe, checkUserIsAdmin } from '../api/api-hooks'
import { CustomToast } from './components/CustomToast/CustomToast'
import { Overlay } from './components/Overlay/Overlay'

export const App = (props) => {

    useGetMe();
    checkUserIsAdmin()

    return (
        <>
            <main className='main'>
                {props.children}
                <CustomToast />
                <Overlay />
            </main>
        </>
    )
}
