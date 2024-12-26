

import Card from "components/card";
import InputField from "components/fields/InputField";
import Footer from "components/footer/Footer";
import { cancelApiRequest, GetRoleListApi, SignUpApi } from "Configs/Utils/APIs/User_Apis";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp() {

  const controllers: any = [];
  const [selectRole, setSelectRole] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm({});

  const GetRoleList = async () => {
    const controller = new AbortController();
    controllers.push(controller);
    const response = await GetRoleListApi(controller);
    if (response.status === 200) {
      setSelectRole(response.data.data);
    }
  }
  useEffect(() => {
    GetRoleList();
  }, [])

  const onSubmit = async (data: any) => {
    console.log("object", data)
    const controller = new AbortController();
    controllers.push(controller);
    setLoading(true);

    const formData = {
      name: data.name,
      username: data.username,
      role_id: data.roleId,
      email: data.email,
      password: data.password,
      confirm_password: data.password,
    }

    let response = await SignUpApi(formData, controller);
    if (response.status === 200) {
      localStorage.setItem('taskBoardToken', response.data.token);
      toast.success(response.data.message);
      setValue('name', '');
      setValue('username', '');
      setValue('email', '');
      setValue('password', '');
      setValue('confirm_password', '');
      setLoading(false);
      navigate("/auth/sign-in")
    } else {
      toast.error(response.response.data.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      cancelApiRequest(controllers);
    };
  }, [])

  return (
    <Card>
      <div className="relative flex justify-center h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
        <main className={`min-h-screen w-[600px] `}>
          <div className="relative flex ">
            <div className="flex min-h-full w-full flex-col pt-12  lg:h-screen  xl:h-[100vh]  ">
              <div className="mb-auto flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:pl-0 w-full ">

                <div className="mt-16 mb-16 flex h-full w-full items-center justify-center  lg:mb-10 p-10 rounded-2xl lg:items-center lg:justify-center shadow-xl ">
                  {/* Sign in section */}
                  <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                    <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                      Sign Up
                    </h4>
                    <p className="mb-9 ml-1 text-base text-gray-600">
                      Enter your email and password to sign up!
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name*</label>
                        <input
                          type="text"
                          id="name"
                          placeholder="Enter Name"
                          className={`block w-full rounded-md border ${errors.name ? "border-red-500" : "border-gray-300"
                            } px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500`}
                          {...register("name", {
                            required: "Name is required",
                          })}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{`${errors.name.message}`}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">User Name*</label>
                        <input
                          type="text"
                          id="username"
                          placeholder="Enter username"
                          className={`block w-full rounded-md border ${errors.username ? "border-red-500" : "border-gray-300"
                            } px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500`}
                          {...register("username", {
                            required: "User Name is required",
                          })}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{`${errors.username.message}`}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Select Role<span className="text-red-500">*</span>
                        </label>
                        <select
                          id="roleId"
                          className={`block w-full rounded-md border ${errors.roleId ? "border-red-500" : "border-gray-300"
                            } px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500`}
                          {...register("roleId", { required: "roleId is required", })}
                        >
                          <option value="">Select Role</option>
                          {selectRole?.length > 0 && selectRole.map((role: any) => (<option key={role.role_id} value={role.role_id}>{role.role_name}</option>))}
                        </select>
                        {errors.roleId && (
                          <p className="text-red-500 text-sm mt-1">{`${errors.roleId.message}`}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email*</label>
                        <input
                          type="text"
                          id="email"
                          placeholder="mail@simmmple.com"
                          className={`block w-full rounded-md border ${errors.email ? "border-red-500" : "border-gray-300"
                            } px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500`}
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email format",
                            },
                          })}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{`${errors.email.message}`}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password*</label>
                        <input
                          type="password"
                          id="password"
                          placeholder="Min. 8 characters"
                          className={`block w-full rounded-md border ${errors.password ? "border-red-500" : "border-gray-300"
                            } px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500`}
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
                            },
                          })}
                        />
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1">{`${errors.password.message}`}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-md bg-brand-500 py-2 text-white font-medium hover:bg-brand-600"
                      >
                        Sign Up
                      </button>
                    </form>

                    <div className="mt-4">
                      <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
                        Alrady registered ?
                      </span>
                      <Link
                        to="/auth/sign-in"
                        className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                      >
                        Sign In Your account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </Card>
  );
}

