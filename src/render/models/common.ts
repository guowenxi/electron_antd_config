/**
 * 全局store dva+redux+redux-saga
 */
import * as homeApi from '@/services/common';
import { message } from 'antd/lib/index';
// import * as service from '@/services/socket';

const Message = message;

export default {
  namespace: 'common',
  state: {
    configUrl: "无",
    configData: [],
    configStauts:false,
    configData_configPage:[],
    modal_table:false,
    modal_info:false,
    DATALIST:"",
  },
  effects: {
    // 获取数据的方法
    *requestData(_, { call, put, select }) {
      try {

        const { success, data, message } = yield call(
          homeApi.requestData,
          { ..._.payload },
          _.url,
          _.method ? _.method : 'GET',
        );
        if (success === 1) {
          if (_.name) {
            yield put({
              type: 'save',
              payload: {
                [_.name]: data || [],
              },
            });
          }
          if (_.callback) _.callback(data);
          return data;
        }
        Message.error(message);
        // return Promise.reject(new Error(message))
      } catch (err) {
        // Message.error(err.message)
        // return Promise.reject(err)
      }
    },
  },
  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload }
    }
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        console.log('pathname', pathname)
      })
    }
  }
}
