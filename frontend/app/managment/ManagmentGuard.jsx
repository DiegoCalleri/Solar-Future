'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { openPopup, pushOpen, closePopup } from '../redux/features/counter/counterSlice'

export function ManagmentGuard({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.counter.user)
  const userData = useSelector((state) => state.counter.userData)
  const isAdmin = user?.role === 'admin' || userData?.role === 'admin'

  useEffect(() => {
    if (pathname == null || !pathname.startsWith('/managment')) return
    if (!user) {
      dispatch(closePopup())
      router.replace('/')
      dispatch(openPopup())
      dispatch(pushOpen('Необходимо войти в аккаунт'))
      return
    }
    if (!isAdmin) {
      dispatch(closePopup())
      router.replace('/')
      dispatch(pushOpen('Доступ только для администратора'))
      return
    }
  }, [pathname, user, isAdmin, router, dispatch])

  const allowed = user && isAdmin
  if (!allowed) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50 p-4">
        <p className="text-muted">Проверка доступа...</p>
      </div>
    )
  }

  return <>{children}</>
}
