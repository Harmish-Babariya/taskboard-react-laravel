import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import Card from "components/card";
import { FaChevronDown, FaRegShareSquare } from "react-icons/fa";
import { MdDeleteSweep, MdEditSquare, MdOutlinePreview } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Dropdown from "components/dropdown";
import { Dialog, DialogBackdrop, Transition, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { cancelApiRequest, GetAddTaskListApi, GetDeleteTaskListApi, GetEditTaskListApi, GetRoleListApi, GetTaskListApi } from "Configs/Utils/APIs/User_Apis";
import { Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";

type Task = {
  id: number;
  name: string;
  sharedWith?: string[];
};

type MenuItemType = string;


const menuItems: MenuItemType[] = [
  'John Doe',
  'Jane Smith',
  'Alice Johnson',
  'Bob Brown',
  'Charlie Wilson',
  'Emily Davis',
  'Frank Thomas',
];
type DropdownOptionType = 'Edit' | 'View';

function TaskManagement(props: { data: Task[] }) {
  const { data } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [taskLists, setTaskLists] = useState<Task[]>([]);
  const [taskListName, setTaskListName] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>(''); // Search term is a string
  const [selectedOption, setSelectedOption] = useState<DropdownOptionType>('View');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const viewTask = (id: number) => {
    navigate(`/admin/taskManagement/view/${id}`);
  };


  const handleSelect = (option: DropdownOptionType) => {
    setSelectedOption(option); // Update state with the selected option
  };

  const handleSelectUser = (user: string) => {
    setSelectedUser(user); // Update selected user state
  };

  const filteredItems = menuItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Fetch task lists from localStorage on component mount
  useEffect(() => {
    const storedTaskLists = JSON.parse(localStorage.getItem("taskLists") || "[]");
    setTaskLists(storedTaskLists);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskListName(event.target.value);
  };

  // const handleSubmit = () => {
  //   if (taskListName.trim()) {
  //     const updatedTaskLists = [...taskLists, { id: taskLists.length + 1, name: taskListName }];
  //     setTaskLists(updatedTaskLists);
  //     localStorage.setItem("taskLists", JSON.stringify(updatedTaskLists));
  //     setTaskListName("");
  //   } else {
  //     alert("Please enter a valid task list name.");
  //   }
  // };


  const editTask = (id: number) => {
    console.log(`Edit task ID: ${id}`);
    // Placeholder for edit logic
  };

  const deleteTask = (id: number) => {
    const updatedTaskLists = taskLists.filter((task) => task.id !== id);
    setTaskLists(updatedTaskLists);
    localStorage.setItem("taskLists", JSON.stringify(updatedTaskLists));
    console.log(`Delete task ID: ${id}`);
  };

  const shareTask = (id: number) => {
    console.log(`Share task ID: ${id}`);
    // Placeholder for share logic
  };

  const columnHelper = createColumnHelper<Task>();
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Task Title",
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      header: "Actions",
      cell: (info) => (
        <div className="space-x-2">
          <button className="text-green-800 text-lg" onClick={() => viewTask(info.row.original.id)}>
            <MdOutlinePreview />
          </button>
          <button
            className="text-blue-500"
            onClick={() => editTask(info.row.original.id)}
          >

            <Dropdown
              button={
                <p className="cursor-pointer ">
                  <MdEditSquare />
                </p>
              }
              animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
              children={
                <div className="flex w-[360px] mt-0  flex-col gap-3 rounded-[20px] bg-white p-4 shadow-inner border dark:border-0 shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-navy-700 dark:text-white">
                      Edit Task List
                    </p>
                  </div>

                  <div className="bg-transparent">
                    <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900 text-start">
                      Task List Title
                    </label>
                    <div className="mt-2 bg-transparent">
                      <div className="flex items-center rounded-md  pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 ">

                        <input
                          id="price"
                          name="price"
                          type="text"
                          placeholder="Task List Title"
                          className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 dark:bg-[#1B254B] dark:text-white placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                        />

                      </div>
                    </div>
                  </div>

                  <button className="flex w-full items-center justify-end ">
                    <div className="flex - w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-2  text-white">
                      Submit
                    </div>

                  </button>
                </div>
              }
              classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
            />



          </button>
          <button className="text-red-500 text-lg" onClick={() => deleteTask(info.row.original.id)}>
            <MdDeleteSweep />
          </button>
        </div>
      ),
    }),
    columnHelper.display({
      header: "Share",
      cell: (info) => (
        <button
          className="text-green-700 rounded-md bg-green-50 px-2 py-1 text-xs font-medium ring-1 ring-inset ring-green-600/20"
          // onClick={() => shareTask(info.row.original.id)}
          onClick={openDialog}

        >
          <FaRegShareSquare />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: taskLists, // Use taskLists state instead of props data
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const [task, setTask] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const controllers: any = [];
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm({});

  const GetTaskList = async () => {
    setLoading(true)
    const controller = new AbortController();
    const response = await GetTaskListApi(controller)
    if (response.status === 200) {
      setTask(response.data.data)
      setLoading(false)
    } else {
      if (response.response.status === 422 || response.response.status === 404) {
        setLoading(false);
        toast.error(response.response.data.message);
      } else {
        setLoading(false);
        toast.error(response.response.data.message);
      }
    }
  }
  useEffect(() => {
    GetTaskList();
  }, [])

  const onSubmit = async (data: any) => {
    const controller = new AbortController();
    controllers.push(controller);
    setLoading(true);

    const formData = {
      task_title: data.task_title,
    }

    let response = await GetAddTaskListApi(formData, controller);
    if (response.status === 200) {
      toast.success(response.data.message);
      setValue('task_title', '');
      setLoading(false);
      GetTaskList();
      setIsModalOpen(false);
      // navigate("/admin/userManagement")
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

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskId, setTaskId] = useState('');
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const handleEditClick = (task: any, taskId: any, TaskTitle: any) => {
    setSelectedTask(task);
    setIsModalOpen1(true);
    setTaskId(taskId);
    setValue("task_title1", TaskTitle)
  };

  const onSubmit1 = async (TaskTitle: any) => {
    const controller = new AbortController();
    controllers.push(controller);
    setLoading(true);

    const formData = {
      task_id: taskId,
      task_title: watch("task_title1", TaskTitle),
    }

    let response = await GetEditTaskListApi(formData, controller);
    if (response.status === 200) {
      toast.success(response.data.message);
      setValue('task_title', '');
      setLoading(false);
      GetTaskList();
      setIsModalOpen1(false);
    } else {
      toast.error(response.response.data.message);
      setLoading(false);
    }
  }

  const handleDelete = async (deleteId: any) => {
    const controller = new AbortController();
    controllers.push(controller);
    setLoading(true);

    const formData = {
      task_id: deleteId,
    }

    let response = await GetDeleteTaskListApi(formData, controller);
    if (response.status === 200) {
      toast.success(response.data.message);
      setLoading(false);
      GetTaskList();
      setIsModalOpen1(false);
    } else {
      toast.error(response.response.data.message);
      setLoading(false);
    }
  }

  const [shardIdOpen, setShareIdOPen] = useState(false);
  const [shareStatus, setShareStatus] = useState([]);
  const [shareId, setShareId] = useState('');
  // const [roleId, setRoleId] = useState('');
  const handleShardOPen = (item: any) => {
    setShareIdOPen(true);
    setShareId(item)
  }
  const GetRoleList = async () => {
    const controller = new AbortController();
    controllers.push(controller);
    const response = await GetRoleListApi(controller);
    if (response.status === 200) {
      setShareStatus(response.data.data);
      // setRoleId(response.data.data.map((role: any) => role.role_id))
    }
  }
  useEffect(() => {
    GetRoleList();
  }, [])

  const onSubmitShareUser = async () => {
    const controller = new AbortController();
    controllers.push(controller);
    setLoading(true);

    const formData = {
      task_id: shareId,
      // user_id: roleId,
      // permission: ,
    }
    console.log(formData);

    let response = await GetEditTaskListApi(formData, controller);
    if (response.status === 200) {
      toast.success(response.data.message);
      setValue('task_title', '');
      setLoading(false);
      GetTaskList();
      setIsModalOpen1(false);
    } else {
      toast.error(response.response.data.message);
      setLoading(false);
    }
  }

  return (
    <Card extra="w-full pb-10 p-4 h-full">
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Task Management
        </div>
        <Dropdown
          button={
            <p onClick={() => setIsModalOpen(true)} className="cursor-pointer mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-4 py-2  text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700">
              Add New List
            </p>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[360px] mt-10 flex-col gap-3 rounded-[20px] bg-white p-4 shadow-inner border dark:border-0 shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
              {isModalOpen && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-navy-700 dark:text-white">
                      Add New Task List
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                      <label htmlFor="task_title" className="block text-sm font-medium text-gray-700">Name Of Task List*</label>
                      <input
                        type="text"
                        id="task_title"
                        placeholder="Task Title"
                        className={`block w-full rounded-md border ${errors.task_title ? "border-red-500" : "border-gray-300"
                          } px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500`}
                        {...register("task_title", {
                          required: "Task Title is required",
                        })}
                      />
                      {errors.task_title && (<p className="text-red-500 text-sm mt-1">{`${errors.task_title.message}`}</p>)}
                    </div>
                    <button type="submit" className="w-full rounded-md bg-brand-500 py-2 text-white font-medium hover:bg-brand-600">Submit</button>
                  </form>
                </>
              )}
            </div>
          }
          classNames="py-2 top-4 -left-[230px] md:-left-[440px] w-max"
        />
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-visible">
        <table className="w-full">
          <thead>
            <tr>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start" scope='col'>Id</th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start" scope='col'>Task Title</th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start" scope='col'>Actions</th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start" scope='col'>Share</th>
            </tr>
          </thead>
          <tbody>
            {!loading && task?.length > 0 ? (
              task.map((item: any, index) => {
                return (
                  <tr>
                    <td className="min-w-[150px] border-white/0 py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white">{index + 1}</td>
                    <td className="min-w-[150px] border-white/0 py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white">{item.task_title}</td>
                    <td className="min-w-[150px] border-white/0 py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white">
                      <button
                        onClick={() => handleEditClick(item, item.task_id, item.task_title)}
                        className="bg-brand-500 px-4 py-2 text-white rounded-md hover:bg-brand-500 me-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.task_id)}
                        className="bg-red-500 px-4 py-2 text-white rounded-md hover:bg-red-500 "
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleShardOPen(item.task_id)}
                        className="bg-green-500 px-4 py-2 text-white rounded-md hover:bg-green-500 "
                      >
                        Share
                      </button>
                    </td>
                    <td className="min-w-[150px] border-white/0 py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white"></td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={16} className="text-center">
                  {loading ? <Spinner color="primary">Loading...</Spinner> : " No tasks available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen1 && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[360px] sm:w-[460px] bg-white p-4 rounded-[20px] shadow-lg dark:bg-navy-700 dark:text-white">
            <div className="flex justify-between items-center">
              <p className="text-base font-bold">
                {selectedTask && "Edit Task"}
              </p>
              <button onClick={() => setIsModalOpen1(false)} className="text-gray-500">Close</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit1)}>
              <div className="mb-4">
                <label htmlFor="task_title1" className="block text-sm font-medium text-gray-700 dark:text-white">Name Of Task List*</label>
                <input
                  type="text"
                  id="task_title1"
                  placeholder="Task Title"
                  className={`block w-full rounded-md border ${errors.task_title1 ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500`}
                  {...register("task_title1", {
                    required: "Task Title is required",
                  })}
                />
                {errors.task_title1 && (
                  <p className="text-red-500 text-sm mt-1">{`${errors.task_title1.message}`}</p>
                )}
              </div>

              <button type="submit" className="w-full rounded-md bg-brand-500 py-2 text-white font-medium hover:bg-brand-600">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {shardIdOpen && (
        <div>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-[360px] sm:w-[460px] bg-white p-4 rounded-[20px] shadow-lg dark:bg-navy-700 dark:text-white">
              <div className="flex justify-between items-center">
                <p className="text-base font-bold">
                  {selectedTask && "Edit Task"}
                </p>
                <button onClick={() => setShareIdOPen(false)} className="text-gray-500">Close</button>
              </div>

              <form onSubmit={handleSubmit(onSubmitShareUser)}>

                <div className="mb-4">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Select User<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="roleId"
                    className={`block w-full rounded-md border ${errors.roleId ? "border-red-500" : "border-gray-300"
                      } px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500`}
                    {...register("roleId", { required: "roleId is required", })}
                  >
                    <option value="">Select User</option>
                    {shareStatus?.length > 0 && shareStatus.map((role: any) => (<option key={role.role_id} value={role.role_id}>{role.role_name}</option>))}
                  </select>
                  {errors.roleId && (
                    <p className="text-red-500 text-sm mt-1">{`${errors.roleId.message}`}</p>
                  )}
                </div>

                <button type="submit" className="w-full rounded-md bg-brand-500 py-2 text-white font-medium hover:bg-brand-600">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeDialog}>
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-overflow rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900 "
                  >
                    Share Task
                  </Dialog.Title>
                  <div className="mt-3 flex justify-around ">
                    <Menu as="div" className="relative inline-block text-left w-26 sm:w-44">
                      <div>
                        <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                          {selectedUser || 'Select User'}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="-mr-1 size-5 text-gray-400"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </MenuButton>
                      </div>

                      <MenuItems
                        transition
                        className="absolute left-0 z-30 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                      >
                        <div className="p-2 border-b border-gray-200">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="py-1 max-h-48 overflow-y-auto">
                          {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                              <MenuItem key={index}>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleSelectUser(item)}
                                    className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      }`}
                                  >
                                    {item}
                                  </button>
                                )}
                              </MenuItem>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
                          )}
                        </div>
                      </MenuItems>
                    </Menu>
                    <Menu as="div" className="relative inline-block text-left w-26 sm:w-44 overflow-visible">
                      <div>
                        <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                          {selectedOption}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="-mr-1 size-5 text-gray-400"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </MenuButton>
                      </div>

                      <MenuItems
                        transition
                        className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none"
                      >
                        <div className="py-1 ">
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() => handleSelect('Edit')}
                                className={`block text-start px-4 py-2 w-full text-sm text-gray-700 ${active ? 'bg-gray-100 text-gray-900' : ''
                                  }`}
                              >
                                Edit
                              </button>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() => handleSelect('View')}
                                className={`block text-start px-4 py-2 w-full text-sm text-gray-700 ${active ? 'bg-gray-100 text-gray-900' : ''
                                  }`}
                              >
                                View
                              </button>
                            )}
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </Menu>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex ms-3 justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={closeDialog}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Card>
  );
}

export default TaskManagement;
