import { useEffect, useState } from 'react'
import { GET, getMe, getJWT, setJWT } from './api-utils'
import { login, logout, openPopup, pushOpen, setUserData } from '../app/redux/features/counter/counterSlice'
import { endpoints, BASE_URL, allowedResorses } from './config'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'


export const useGetData = (endpoint) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    async function fetchData() {
      const data = await GET(BASE_URL + endpoint)
      setData(data)
    }
    fetchData()
  }, [])
  return data
}


export const useGetMe = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function fetchData() {
      const jwt = getJWT()
      checkAccessIsGaranteed(jwt, dispatch, pathname, router)
      checkTokenIsCorrect(jwt, dispatch)
    }
    fetchData()
  }, [])
}


const checkTokenIsCorrect = async (jwt, dispatch) => {
  try {
    const data = await getMe(endpoints.me, jwt)
    dispatch(login(data))
    setJWT(jwt)
  }
  catch (e) {
    dispatch(logout())
  }
}


const checkAccessIsGaranteed = async (jwt, dispatch, pathname, router) => {
  console.log(typeof jwt)
  if ((!jwt || jwt=='null') && pathname != '/') {
    !allowedResorses.includes(pathname) ? ifUserNoAuth(router, dispatch) : null
    return
  }
}

const checkAccessForUserNoAdmin = async (dispatch, pathname, router) => {
  if (pathname != '/') {
    !allowedResorses.includes(pathname) ? ifUserNoAdmin(router, dispatch) : null
    return
  }
}

const ifUserNoAuth = (router, dispatch) => {
  router.push('/')
  dispatch(logout())
  dispatch(openPopup())
  dispatch(pushOpen('...упс, кажется, нужно ввести логин и пароль;)'))
}

const ifUserNoAdmin = (router, dispatch) => {
  router.push('/')
  dispatch(openPopup())
  dispatch(pushOpen('...к сожалению, ваши права пока ограничены админом'))
}

export const checkUserIsAdmin = () => {
  const pathname = usePathname()
  const router = useRouter()
  const user = useSelector((state) => state.counter.user)
  const dispatch = useDispatch()

  useEffect(() => {
    user && GET(endpoints.user + user._id).then((res) => {
      dispatch(setUserData(res))

      res.role == 'admin' ? null : checkAccessForUserNoAdmin(dispatch, pathname, router)

    })

  }, [user])
}