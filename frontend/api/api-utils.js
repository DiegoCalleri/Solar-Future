export const GET = async (url) => {
    const jwt = getJWT()
    const headers = {}
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`
    try {
        const response = await fetch(url, { headers })
        if (response.status !== 200) {
            throw new Error('Ошибка получения данных')
        }
        const data = await response.json()
        return data
    } catch (error) {
        return error
    }
}


export const POST = async (url, data, options = {}) => {
    const { timeoutMs } = options
    const controller = timeoutMs ? new AbortController() : null
    const timeoutId = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : null
    const jwt = getJWT()
    const headers = { 'Content-Type': 'application/json' }
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
            signal: controller?.signal,
        })
        if (timeoutId) clearTimeout(timeoutId)
        const result = await response.json()
        return result
    }
    catch (error) {
        if (timeoutId) clearTimeout(timeoutId)
        return error
    }
}

export const PUT = async (url, data) => {
    const jwt = getJWT()
    const headers = { 'Content-Type': 'application/json' }
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        })
        if (response.status !== 200) {
            throw new Error('Ошибка PUT-запроса')
        }
        const result = await response.json()
        return result
    }
    catch (error) {
        return error
    }
}


export const DELETE = async (url) => {
    const jwt = getJWT()
    const headers = { 'Content-Type': 'application/json' }
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers,
        })
        if (response.status !== 200) {
            throw new Error('Ошибка DELETE-запроса')
        }
        const result = await response.json()
        return result
    }
    catch (error) {
        return error
    }
}


export const authorize = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (response.status !== 200) {
            throw new Error('Ошибка авторизации')
        }
        const result = await response.json()
        return result
    } catch (error) {
        return error
    }
}


export const setJWT = (jwt) => {
    if (!jwt) {
        removeJWT()
        return
    }
    // Удаляем старую куку перед установкой новой
    removeJWT()
    
    // Устанавливаем куку с expires (24 часа, как в токене)
    const expires = new Date()
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)) // 24 часа
    document.cookie = `jwt=${jwt}; expires=${expires.toUTCString()}; path=/`
    localStorage.setItem('jwt', jwt)
}


export const getJWT = () => {
    // Сначала проверяем куки
    const cookies = document.cookie.split(';')
    const jwtCookie = cookies.find((item) => item.trim().startsWith('jwt='))
    
    if (jwtCookie) {
        const jwt = jwtCookie.split('=')[1]?.trim()
        if (jwt && jwt !== 'null' && jwt !== 'undefined') {
            return jwt
        }
    }
    
    // Если в куках нет, проверяем localStorage
    const jwtFromStorage = localStorage.getItem('jwt')
    if (jwtFromStorage && jwtFromStorage !== 'null' && jwtFromStorage !== 'undefined') {
        // Синхронизируем с куками
        setJWT(jwtFromStorage)
        return jwtFromStorage
    }
    
    return null
}


export const removeJWT = () => {
    // Удаляем куку правильно - устанавливаем expires в прошлом и очищаем значение
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';'
    localStorage.removeItem('jwt')
}


export const getMe = async (url, jwt) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Bearer ${jwt}` },
        })
        if (response.status !== 200) {
            throw new Error('Ошибка получения данных')
        }
        const result = await response.json()
        return result
    } catch (error) {
        return null
    }
}


export const isResponseOk = (response) => {
    return !(response instanceof Error)
}

export const UPLOAD_FILE = async (url, file) => {
    const jwt = getJWT()
    const formData = new FormData()
    formData.append('file', file)
    
    const headers = {}
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData,
        })
        
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Ошибка загрузки файла')
        }
        
        const result = await response.json()
        return result
    } catch (error) {
        return error
    }
}