import React, { useEffect, useState } from 'react'
import Playground from './Components/Playground.jsx'
import { useDispatch, useSelector } from "react-redux"
import { createContainer, genrateCodingEnv, stopCodingEnv } from "./Store/containerSlice.js"
import "./app.css"
const App = () => {
  const dispatch = useDispatch();
  const { containerName, loading, containerId, socket } = useSelector(state => state.container)
  useEffect(() => {
    dispatch(genrateCodingEnv())
    return () => {
      dispatch(stopCodingEnv(containerName, containerId))
      socket.disconnect();
    }
  }, [])
  if (containerName !== "" && !loading) {
    return (
      <div className='playground'>
        <Playground />
      </div>
    )
  } else {
    return (
      <h1>Genrating Container please wait</h1>
    )
  }
}

export default App