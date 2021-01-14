/**
 * 左侧菜单配置
 */
import React from 'react'
import { AreaChartOutlined, createFromIconfontCN } from '@ant-design/icons'
import { iconFonts, icons } from './iconfont'

const isDev = process.env.APP_ENV === 'development'

// iconfont.cn
const IconFont = createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_1492696_4ai9rbngxhe.js'
  scriptUrl: 'http://at.alicdn.com/t/font_1492696_4ai9rbngxhe.js'
})

export interface IMenu {
  title: string
  path: string
  fullPath?: string
  icon?: React.ReactNode
  subs?: Array<IMenu>
  electron?: boolean
}

export default [
  {
    title: '项目配置设置',
    path: '/ProjectConfig',
    fullPath:'/ProjectConfig',
    icon: <IconFont type='icon-RectangleCopy172' />,
  },  {
    title: '路由及页面配置',
    path: '/ProjectRouter',
    fullPath:'/ProjectRouter',
    icon: <IconFont type='icon-RectangleCopy172' />,
  }
] as Array<IMenu>
