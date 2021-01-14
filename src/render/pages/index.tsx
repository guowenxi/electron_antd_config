import React from 'react'
import cls from 'classnames'
import './home.normal.less'
import AutoUpdate from '@components/AutoUpdate'
import { Button, message, Input } from 'antd'
const Store = require('electron-store')
const store = new Store()

export default function () {
  const getLocalStoreData = () => {
    message.info(store.get('LOCAL_ELECTRON_STORE'))
  }
  return (
    <div className='homewrap'>
      
    </div>
  )
}
