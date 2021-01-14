import request from '@/utils/request';

interface data {

}

//简单的通用请求方式
export async function requestData(data:data,url:string,method:string) {
  // return request("/api/getList",{
  // return request(rootUrl+url,{
  let opt = {
    method: method,
  }

  method.toUpperCase()==='GET' ? opt.params = data : opt.data = data ;
  // method.toUpperCase()==='POST' ? opt.headers = { 
  //   'Content-Type': 'application/x-www-form-urlencoded' ,
  //   'Accept' :'application/json, text/plain, */*'
  // }   : null  ;
  var _url  = url.indexOf("http")>=0 ? url : rootUrl + url;
  return request(_url,opt);
}