import React, { useEffect, useState } from "react";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { GetUserListApi } from "Configs/Utils/APIs/User_Apis";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

// Define the user data structure
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

function UserManagement(props: { tableData: User[] }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetUserList = async () => {
    setLoading(true)
    const controller = new AbortController();
    const response = await GetUserListApi(controller)
    if (response.status === 200) {
      setData(response.data.data)
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
    GetUserList();
  }, [])

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          User Management
        </div>
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className='w-full'>
          <thead>
            <tr>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start" scope='col'>Id</th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start" scope='col'>Name</th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start" scope='col'>Email</th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start" scope='col'>Role</th>
            </tr>
          </thead>
          <tbody>
            {!loading && data?.length > 0 ? (
              data.map((item: any, index) => {
                return (
                  <tr>
                    <td className="min-w-[150px] border-white/0 py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white">{index + 1}</td>
                    <td className="min-w-[150px] border-white/0 py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white">{item.name} {item.username}</td>
                    <td className="min-w-[150px] border-white/0 py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white">{item.email}</td>
                    <td className="min-w-[150px] border-white/0 py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white">{item.role}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={16} className="text-center">
                  {loading ? <Spinner color="primary">Loading...</Spinner> : "No data found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default UserManagement;
