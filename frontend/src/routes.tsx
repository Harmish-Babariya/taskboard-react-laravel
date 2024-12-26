


// Icon Imports
import {
  MdBarChart,
  MdPerson,
  MdLock,
  MdOutlineTask,
} from "react-icons/md";
import UserManagement from "views/admin/marketplace";
import TaskManagement from "views/admin/tables";
import SharedTask from "views/admin/sharedtask";
const userData = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Editor" },
  { id: 3, name: "Mark Johnson", email: "mark.johnson@example.com", role: "Viewer" },
];

const taskData = [
  {
    id: 1,
    title: "Design Landing Page",
    assignee: "John Doe",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-12-30",
  },
  {
    id: 2,
    title: "Fix Bug #123",
    assignee: "Jane Smith",
    status: "Completed",
    priority: "Medium",
    dueDate: "2024-12-25",
  },
];
const transformedTaskData = taskData.map((task) => ({
  id: task.id,
  name: task.title, // Assuming "title" corresponds to "name"
}));
type RoutesType = {
  name: string; // Optional
  layout: string;
  path: string;
  icon: JSX.Element; // Optional
  component: JSX.Element;
  secondary?: boolean;
  hidden?: boolean;
};

const routes: RoutesType[] = [
  {
    name: "User Management",
    layout: "/admin",
    path: "userManagement",
    icon: <MdPerson className="h-6 w-6" />,
    component: <UserManagement tableData={userData} />,
    secondary: true,
  },
  {
    name: "Task Management",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "taskManagement",
    component: <TaskManagement data={transformedTaskData} />,
  },
  {
    name: "Shared Task",
    layout: "/admin",
    path: "shared-task",
    icon: <MdOutlineTask className="h-6 w-6" />,
    component: <SharedTask />,
  }
];

export default routes;
