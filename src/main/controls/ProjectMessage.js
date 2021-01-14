/**
 * APP托盘
 */
'use strict'
const { app, Menu, Tray, Notification, BrowserView, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')

let _fn = {}
_fn.readFileSync = function(event, arg) {
  const fileData = fs.readFile(arg.data.url, 'utf8', function(err, data) {
    event.reply(`${arg.id}-reply`, { type: arg.type, data: data })
  })
}
_fn.writeFileSync = function(event, arg) {
  const fileData = fs.writeFile(arg.data.url, arg.data.data, function(err, data) {
    event.reply(`${arg.id}-reply`, { type: arg.type, data: data })
  })
}
_fn.Notification = function(event, arg) {
  const myNotification = new Notification(arg.data.title, {
    body: arg.data.body
  })
  myNotification.show()
  myNotification.onclick = () => {
    event.reply(`${arg.id}-reply`, data)
  }
}

_fn.BrowserView = function(event, arg) {
  const win = new BrowserWindow({ width: 800, height: 600 })

  const view = new BrowserView()
  win.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 300, height: 300 })
  view.webContents.loadURL('https://www.baidu.com')
}

_fn.NewLayout = async function(event, arg) {
  if (fs.existsSync(`${arg.data.url}\\pages\\${arg.data.name}`)) {
    event.reply(`${arg.id}-reply`, { type: arg.type, data: '已创建文件夹,请勿重复添加' })
    return
  } else {
    fs.mkdirSync(`${arg.data.url}\\pages\\${arg.data.name}`)
    //将模板文件拷贝到制定的文件夹内
    const push_url = `${arg.data.url}\\pages\\${arg.data.name}`
    const copy_url = _.dropRight(__dirname.split('\\'), 2)
      .concat('render', 'components', 'defualtPage')
      .join('\\')
    //获取指定目录内的文件名
    const files = await fs.promises.readdir(copy_url)
    files.forEach(function(path) {
      fs.createReadStream(copy_url + '\\' + path).pipe(fs.createWriteStream(push_url + '\\' + path))
    })
  }
  event.reply(`${arg.id}-reply`, { type: arg.type, data: '创建成功!' ,PAGEURL:arg.data.PAGEURL })
}
_fn.LoadLayout = async function(event, arg) {

  if (fs.existsSync(`${arg.data.url}\\pages\\${arg.data.name}`)) {
    //保存读取的文件数据
    let getFilesData = {};
    let getFilesDataUrl = {};
    //清空指定文件夹内的所有数据
    //node 只可以删除空文件夹和文件 ，所以只可以递归删除文件夹下文件
    const copy_url = _.dropRight(__dirname.split('\\'), 2)
    .concat('render', 'components', 'modificationPage')
    .join('\\');
    clearDir(copy_url);
    //读取要修改的文件的目录
    const push_url = `${arg.data.url}\\pages\\${arg.data.name}`
    //将要修改的文件放到指定文件夹
    let files = await fs.promises.readdir(push_url);
    files.forEach(function(path) {
      fs.createReadStream(push_url + '\\' + path).pipe(fs.createWriteStream(copy_url + '\\' + path))
    })
    //重新读取指定文件夹下的文件
    files = await fs.promises.readdir(copy_url);
    files.forEach(function(path) {
      //获得文件的目录
      let fileData =  fs.readFileSync(`${push_url}\\${path}`, 'utf8');
      getFilesData[path.split(".")[0]] = fileData;
      getFilesDataUrl[path.split(".")[0]] = `${push_url}\\${path}`;
    })
    event.reply(`${arg.id}-reply`, { type: arg.type, data:
       {getFilesData:getFilesData,getFilesDataUrl:getFilesDataUrl} })

  } else {

    event.reply(`${arg.id}-reply`, { type: arg.type, status: false,PAGEURL:arg.data.PAGEURL })


  }
}
_fn.SaveLayout = async function(event, arg) {

  if (fs.existsSync(`${arg.data.url}\\pages\\${arg.data.name}`)) {
    const push_url = `${arg.data.url}\\pages\\${arg.data.name}`
    //先清除原文件夹内的内容
    clearDir(push_url);
    const copy_url = _.dropRight(__dirname.split('\\'), 2)
    .concat('render', 'components', 'modificationPage') 
    .join('\\');
    //读取备份文件夹内内容
    const files = await fs.promises.readdir(copy_url);
    //保存读取的文件数据
    let getFilesData = {};
    let getFilesDataUrl = {};

    files.forEach(function(path) {
      //同时修改两边的文件数据
      fs.writeFileSync(`${push_url}\\${path}`, arg.data.data[path.split(".")[0]]);
      fs.writeFileSync(`${copy_url}\\${path}`, arg.data.data[path.split(".")[0]]);
      let fileData =  fs.readFileSync(`${push_url}\\${path}`, 'utf8');
      getFilesData[path.split(".")[0]] = fileData;
      getFilesDataUrl[path.split(".")[0]] = `${push_url}\\${path}`;
    })
    event.reply(`${arg.id}-reply`, { type: arg.type, data:
       {getFilesData:getFilesData,getFilesDataUrl:getFilesDataUrl} })

  } else {

    event.reply(`${arg.id}-reply`, { type: arg.type, status: false,PAGEURL:arg.data.PAGEURL })


  }


}

module.exports = function(event, arg) {
  try {
    return _fn[arg.type](event, arg)
  } catch (err) {
    throw err
  }
}


function delDir(path){
  let files = [];
  if(fs.existsSync(path)){
      files = fs.readdirSync(path);
      files.forEach((file, index) => {
          let curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()){
              delDir(curPath); //递归删除文件夹
          } else {
              fs.unlinkSync(curPath); //删除文件
          }
      });
      fs.rmdirSync(path);
  }
}

function clearDir(path){
  let files = [];
  if(fs.existsSync(path)){
      files = fs.readdirSync(path);
      files.forEach((file, index) => {
          let curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()){
              delDir(curPath); //递归删除文件夹
          } else {
              fs.unlinkSync(curPath); //删除文件
          }
      });
  }
}
