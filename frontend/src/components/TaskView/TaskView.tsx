import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "components/card";
import { MdModeEditOutline } from "react-icons/md";
import Dropdown from "components/dropdown";


type Task = {
  id: number;
  title: string;
};

type TaskViewProps = {
  data: Task[];
};

const TaskView: React.FC<TaskViewProps> = ({ data }) => {
  const { id } = useParams<{ id: string }>();
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const navigate = useNavigate();

  // Find the task by ID
  const task = data.find((task) => task.id === Number(id));
  const handleCheckboxChange = (taskId: number) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId]
    );
  };
  if (!task) {
    return (
      <Card extra={"w-full pb-10 p-4 h-full"}>
        <div className="text-center text-gray-700">
          Task not found. <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card extra={"w-full p-4 h-full"}>
        <div className="mb-8 w-full">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Task Details
          </h4>
          <p className="mt-2 text-base text-gray-600">
            Here you can find more details about your Task. Keep your user engaged by providing meaningful information.
          </p>
        </div>

        {data.map((taskItem, index) => (
          <div
            key={taskItem.id}
            className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none border dark:border-0"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-4"
                checked={selectedTasks.includes(taskItem.id)}
                onChange={() => handleCheckboxChange(taskItem.id)}
              />
              <div className="ml-4">
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {taskItem.title}
                </p>
              </div>
            </div>
            <button
            className="text-blue-500"
            // onClick={() => editTask(info.row.original.id)}
          >
            <Dropdown
              button={
                <p className="cursor-pointer mr-4 flex items-center justify-center text-gray-600 dark:text-white">
                 <MdModeEditOutline />
                </p>
              }
              animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
              children={
                <div className="flex w-[360px] mt-0  flex-col gap-3 rounded-[20px] bg-white p-4 shadow-inner border dark:border-0 shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-navy-700 dark:text-white">
                      Edit Task 
                    </p>
                  </div>

                  <div className="bg-transparent">
                    <label htmlFor="price" className="dark:text-white block text-sm/6 font-medium text-gray-900 text-start">
                      Title 
                    </label>
                    <div className="mt-2 bg-transparent">
                      <div className="flex items-center rounded-md  pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 ">

                        <input
                          id="price"
                          name="price"
                          type="text"
                          placeholder="Title"
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
          </div>
        ))}
      </Card>
    </>
  );
};

export default TaskView;