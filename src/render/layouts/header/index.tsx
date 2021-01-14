import React from 'react'
import { Layout } from 'antd'
import './index.less'


const { Header } = Layout

const headerProps = {
  style: {
    // backgroundImage: `url(${require('@/assets/image/nav-bg.jpg')})`
    background: '#001529'
  }
}

const HeaderComponent = (props: any) => {

  return (
    <Header  className='layout-top-eader'>
      <div className='d-flex align-items-center justify-content-between'>
        <div style={{ marginLeft: 20 }} >后台配置</div>
      </div>
    </Header>
  )
}

export default HeaderComponent
