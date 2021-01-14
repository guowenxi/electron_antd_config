import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import moment from 'moment/moment';
import React, { Component } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';



//获取当前路由的方法
// window.location.href.split("#/")[1].split("/").pop().replace("_",":")

export const downLoadFile = function(file){
  if(typeof(file) == "string"){

  }

}

//将文件类型转换成字符串数组
export const filesToStringArrary = function(list){

  if(typeof(list) =="string") return list;
  if(list === null) return [];
  let _list = [];
  let _ids_list = [];
  list.length>0 && list.map(function(item,idx){
    if(item.response){
      _list.push({
        fileName:item.name,
        fileType:item.type,
        fileId: item.response.data[0],
      })
      _ids_list.push(item.response.data[0])
    }else{
      _list.push({
        fileName:item.name,
        fileType:item.contentType,
        fileId:item.uid,
      })
      _ids_list.push(item.uid)
    }
  })
  
  return {_list,_ids_list};
}
//获取数组的params字段默认用来获取rbacToken;
export const getUrlParams = function(name){
  var url2 = window.location.href;
  var temp2 = url2.split('?')[1];
  var pram2 = new URLSearchParams('?'+temp2);
  var data = pram2.get(name);
  if(!data) return "";
  if(data.indexOf("#/")>=0){
    data = data.split("#/")[0];
  }
  return data;
}
//将字符串数据转成数组类型
export const stringToArrary = function(data,keys){
  if(!keys) return ;
  keys.map(function(key,idx){
    if(Array.isArray(data[key])) return ;
    data[key] ===null ?   data[key] = []  :  data[key] = data[key].split(",");
  });
  return data;

}

//切片上传
export const handleUpload = async function (upfile) {
  if (!upfile) return;
  this.upfile = [];
  this.data = [];

  async function uploadChunks() {
    const requestList = this.data
      .map(({ chunk, hash }) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('filename', upfile.name);
        return { formData };
      })
      .map(async ({ formData }) =>
        this.request({
          url: '',
          data: formData,
        }),
      );
    await Promise.all(requestList); // 并发切片
  }

  function createFileChunk(file, length = LENGTH) {
    const fileChunkList = [];
    const chunkSize = Math.ceil(file.size / length);
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + chunkSize) });
      cur = +chunkSize;
    }
    return fileChunkList;
  }

  const fileChunkList = this.createFileChunk(upfile);
  this.data = fileChunkList.map(({ file }, index) => ({
    chunk: file,
    hash: upfile.name + '-' + index, // 文件名 + 数组下标
  }));
  await this.uploadChunks();
};

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

//过滤指定字符串的方法
export const filterStr = function (str: string, ft: string): string {
  return str.indexOf(ft) >= 0 ? str.split(ft)[1] : str;
};


//将地址的参数拼接的方法
export const joinUrl = function (url, params) {
  if (params) {
    let paramsArray = [];
    //拼接参数
    Object.keys(params).forEach((key) => paramsArray.push(key + '=' + params[key]));
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&');
    } else {
      url += '&' + paramsArray.join('&');
    }
  }
  return url;
};
//用于将列表里的多个字符串与保存的ids列表进行中文匹配
export const filterIdsToName = function (str: string, list) {
  if (!str && str!==0) {
    return [];
  }
  let data = [];
  list.map(function (item) {
    str.toString().split(',').indexOf(item.id.toString()) >= 0 ? data.push(item.name) : null;
  });
  //返回一个数组
  return data;
};
//将rangepick 时间选择的数据进行过滤
export const filterKeys = function (data) {
  const filterData = {};
  for (let key in data) {
    if (key.indexOf('-') >= 0) {
      key.split('-').map(function (item, idx) {
        if (!data[key]) {
          filterData[item] = undefined;
        } else {
          if (typeof data[key][idx] === 'object') {
            //目前只针对时间做了优化 未出现有其他是对象的值
            filterData[item] = data[key][idx].format('YYYY-MM-DD 00:00:00');
          } else {
            filterData[item] = data[key][idx];
          }
        }
      });
    } else {
      filterData[key] = data[key];
    }
  }
  return filterData;
};

//简略的弹出框方法
export const confirmModal = function () {
  const config = arguments[0];
  const func = arguments[1];
  let _ = {};
  if (typeof config == 'string') {
    switch (config) {
      case 'delete':
        _ = {
          t: '删除',
          i: '',
          c: '是否删除选中的数据',
        };
        break;
      case 'add':
        _ = {
          t: '添加',
          i: '',
          c: '是否添加选中的数据',
        };
        break;
    }
  } else {
    _ = {
      t: config.title,
      i: config.icon,
      c: config.content,
    };
  }

  Modal.confirm({
    title: _.t,
    icon: _.i,
    content: _.c,
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      func;
    },
  });
};

export const $webSocket = {
  init:function(name,url){
    if(this[name]) return ;
    var ws = new WebSocket(`${url}`);
    Object.assign(this,{[name]:ws});
  },
}

