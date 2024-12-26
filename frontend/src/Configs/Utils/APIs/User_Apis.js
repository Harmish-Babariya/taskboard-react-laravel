import { apiHandler, apiHandlerWithoutToken } from "../ApiHandler";
import { REQUEST_METHODS } from "../RequestMethods";

export const cancelApiRequest = (controllers) => {
  for (const controller of controllers) {
    controller.abort();
  }
}

export const LoginApi = async (data, controller) => {
  try {
    const response = await apiHandlerWithoutToken(
      REQUEST_METHODS.POST,
      `/login`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const SignUpApi = async (data, controller) => {
  try {
    const response = await apiHandlerWithoutToken(
      REQUEST_METHODS.POST,
      `/user_registration`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetRoleListApi = async (controller) => {
  try {
    const response = await apiHandlerWithoutToken(
      REQUEST_METHODS.GET,
      `/get_user_role_list`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetUserListApi = async (controller) => {
  try {
    const response = await apiHandler(
      REQUEST_METHODS.GET,
      `/get_users_list`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetTaskListApi = async (controller) => {
  try {
    const response = await apiHandler(
      REQUEST_METHODS.GET,
      `/get_task_list`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetAddTaskListApi = async (data, controller) => {
  try {
    const response = await apiHandler(
      REQUEST_METHODS.POST,
      `/add_task`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetEditTaskListApi = async (data, controller) => {
  try {
    const response = await apiHandler(
      REQUEST_METHODS.POST,
      `/edit_task`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetDeleteTaskListApi = async (data, controller) => {
  try {
    const response = await apiHandler(
      REQUEST_METHODS.POST,
      `/delete_task`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetSharedListApi = async (controller) => {
  try {
    const response = await apiHandler(
      REQUEST_METHODS.GET,
      `/shared_task_list`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetAssignTaskApi = async (data, controller) => {
  try {
    const response = await apiHandler(
      REQUEST_METHODS.GET,
      `/assign_task_permission`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};