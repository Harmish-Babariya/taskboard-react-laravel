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

function SharedTask() {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [taskLists, setTaskLists] = useState<Task[]>([]);
    const [taskListName, setTaskListName] = useState("");
    const [searchTerm, setSearchTerm] = useState<string>(''); // Search term is a string
    const [selectedOption, setSelectedOption] = useState<DropdownOptionType>('View');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);


    const navigate = useNavigate();

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

    const handleSubmit = () => {
        if (taskListName.trim()) {
            const updatedTaskLists = [...taskLists, { id: taskLists.length + 1, name: taskListName }];
            setTaskLists(updatedTaskLists);
            localStorage.setItem("taskLists", JSON.stringify(updatedTaskLists));
            setTaskListName("");
        } else {
            alert("Please enter a valid task list name.");
        }
    };


    const editTask = (id: number) => {
        console.log(`Edit task ID: ${id}`);
        // Placeholder for edit logic
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
                </div>
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

    return (
        <Card extra="w-full pb-10 p-4 h-full">
            <header className="relative flex items-center justify-between">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    Task Shared With You
                </div>

            </header>

            <div className="mt-8 overflow-x-scroll xl:overflow-x-visible">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                        <div className="items-center justify-between text-sm font-bold text-gray-600 dark:text-white">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="min-w-[150px] border-white/0 py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4">
                                    No tasks available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </Card>
    );
}

export default SharedTask;
