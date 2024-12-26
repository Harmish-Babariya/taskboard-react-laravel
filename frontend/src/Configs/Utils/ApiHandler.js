import axios from 'axios';
import { ENV_CONSTANTS } from './../Constants';

// const apiKey = 'test';

export const apiHandlerWithoutToken = async (method, url, requestBody = {}, controller) => {
  try {
    // const baseURL = `${ENV_CONSTANTS.API_SERVER_URL}${url}`;
    const baseURL = `${'https://mahadevcreations.in/task_management/public/api'}${url}`;
    const data = {
      method,
      url: baseURL,
      // headers: {
      //   'personaltoken': apiKey
      // },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: requestBody,
      cancelToken: new axios.CancelToken((cancel) => {
        controller.signal.addEventListener('abort', () => {
          cancel('Request canceled by component unmount.');
        });
      })
    };
    return axios(data)
      .then((response) => response)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  } catch (error) {
    return error;
  }
};

export const apiHandler = async (method, url, requestBody = {}, controller) => {
  const Token = localStorage.getItem('taskBoardToken');
  try {
    // const baseURL = `${ENV_CONSTANTS.API_SERVER_URL}${url}`;
    const baseURL = `${'https://mahadevcreations.in/task_management/public/api'}${url}`;
    const data = {
      method,
      url: baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: (Token ? `Bearer ${Token}` : []),
        // 'personaltoken': apiKey
      },
      data: requestBody,
      cancelToken: new axios.CancelToken((cancel) => {
        controller.signal.addEventListener('abort', () => {
          cancel('Request canceled by component unmount.');
        });
      })
    };
    return axios(data)
      .then((response) => response)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  } catch (error) {
    return error;
  }
};

export const apiHandlerWithFile = async (method, url, requestBody = {}, controller) => {
  const Token = localStorage.getItem('taskBoardToken');
  try {
    // const baseURL = `${ENV_CONSTANTS.API_SERVER_URL}${url}`;
    const baseURL = `${'https://mahadevcreations.in/task_management/public/api'}${url}`;
    const data = {
      method,
      url: baseURL,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: (Token ? `Bearer ${Token}` : []),
        // 'personaltoken': apiKey
      },
      data: requestBody,
      cancelToken: new axios.CancelToken((cancel) => {
        controller.signal.addEventListener('abort', () => {
          cancel('Request canceled by component unmount.');
        });
      })
    };
    return axios(data)
      .then((response) => response)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  } catch (error) {
    return error;
  }
};
