'use client'

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { setJWT, removeJWT } from "../../../../api/api-utils"


const initialState: typeState = {
    count: 0,
    isEditing: false,
    pushBody: '',
    pushState: false,
    isUpdated: false,
    userData: [],
    isAuth: false,
    user: null,
    token: null,
    popupIsOpened: false,
    popupId: '',
    isAdmin: false
}

interface typeState {
    count: number,
    isEditing: boolean,
    pushBody: string,
    pushState: boolean,
    isUpdated: boolean,
    userData: UserData[],
    isAuth: boolean,
    user: UserData,
    token: string | null,
    popupIsOpened: boolean,
    popupId: string,
    isAdmin: boolean
}

interface UserData {
    name: string,
    description: string,
    email: string,
    role: string
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        edit: (state) => {
            state.isEditing = true
        },
        create: (state) => {
            state.isEditing = false
        },
        pushClose: (state) => {
            state.pushState = false
        },
        pushOpen: (state, action: PayloadAction<string>) => {
            state.pushBody = action.payload
            state.pushState = true
        },
        update: (state) => { 
            state.isUpdated = true
        },
        updated: (state) => {
            state.isUpdated = false
        },
        setUserData: (state, action:PayloadAction<Array<UserData>>) => { 
            state.userData = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        login: (state, action:PayloadAction<UserData>) => {
            state.isAuth = true
            state.user = action.payload
            setJWT(state.token)
        },
        logout: (state) => {
            state.isAuth = false
            state.token = null
            state.user = null
            removeJWT()
        },
        openPopup: (state, action) => {
            state.popupIsOpened = true
            state.popupId = action.payload
        },
        closePopup: (state) => {
            state.popupIsOpened = false
        },
        setCurrentUserAdmin: (state, action) => {
            state.isAdmin = action.payload    
        }
    },
})

export const { edit, create, pushClose, pushOpen, update, updated, setUserData,
    setToken, login, logout, openPopup, closePopup, setCurrentUserAdmin } = counterSlice.actions
export default counterSlice.reducer