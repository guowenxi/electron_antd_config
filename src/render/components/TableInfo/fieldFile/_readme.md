//全局配置
{
  name  字段的key
  width 定义宽度(百分比)
  //前部标题的配置
  label {
    name 中文名称 对应小字段标题
    col 栅格数
    style  {}自定义样式
  }
  //类型配置
  field{
     col 栅格数
     type 类型,目前有  timePicker | cascader | datePicker | input | inputNumber | rangePicker | select | timePicker ,
     //详细设置
     props{
       //
       relationType *select所属字段 设置select默认数据 命名后,将从model中获取(需要提前全局请求)
       url *select所属字段 设置select默认请求数据的url
       params *select所属字段 设置select默认请求数据的params
       options *select所属字段 手动输入list
       relationList{  *cascader所属字段 
              {
                type: 'select', 请求类型
                url: '/fyTaskManage/peaceTaskManage/getAreaFieldList', 请求地址
                name: 'streetList', 保存的字段名称
                payload: { taskType: 2 }, 附加参数
              },
       }
       defaultValue 默认值 针对不同的类型需要设置不同的数据类型
       placeholder 默认提示文字
       style  { }  自定义样式

     }
  }
  //必填字段的设置
  rules{
    required   bol 是否必填
    message 必填内容
  }

}
