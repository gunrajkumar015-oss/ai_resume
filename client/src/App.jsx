import React, { useEffect } from 'react'
import {Route, Routes } from 'react-router-dom'
import  Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import { useDispatch } from 'react-redux'
import api from './configs/api.js'
import { login, setLoading } from './app/features/authslice.js'
import { Toaster } from 'react-hot-toast'

const App = () => {

  const dispatch = useDispatch()

  const getUserData = async ()=>{
    const token = localStorage.getItem('token')
    try {
      if(token){
        const {data}  = await api.get('api/users/data', {headers: {Authorization: token}})
        if (data.user) {
            dispatch(login({token, user: data.user}))
        }
        dispatch(setLoading(false))
      }else{
        dispatch(setLoading(false))
      }
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.message)      
    }
  }

  useEffect(()=>{
    getUserData()
  },[])

  return (    
    <div>
    <Toaster/>
      <Routes>
        <Route path ='/' element={<Home/>} />
        <Route path ='app' element={<Layout/>}>
          <Route path ='dashboard' element={<Dashboard/>} />
          <Route path ='builder/:resumeId' element={<ResumeBuilder/>} />
        </Route>     
        <Route path ='views/:resumeId' element={<Preview/>} /> 
        <Route path ='login' element={<Login/>} />  
      </Routes>
    </div>    
  )
}

export default App
