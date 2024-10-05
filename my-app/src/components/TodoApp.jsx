import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import { Button, Checkbox, Input, List, Tabs, Typography, notification } from "antd";
import "antd/dist/reset.css";

const { TabPane } = Tabs;
const { Title } = Typography;

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5002/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tác vụ:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTask.trim()) {
      const taskToAdd = { title: newTask, completed: false };
      try {
        const response = await axios.post("http://localhost:5002/tasks", taskToAdd);
        setTasks([...tasks, response.data]);
        setNewTask("");
      } catch (error) {
        console.error("Lỗi khi thêm tác vụ:", error);
        notification.error({
          message: "Thêm tác vụ thất bại",
          description: "Đã xảy ra lỗi khi thêm tác vụ mới.",
        });
      }
    } else {
      notification.warning({
        message: "Tác vụ rỗng",
        description: "Vui lòng nhập một tác vụ để thêm.",
      });
    }
  };
  

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((task) => (filter === "Completed" ? task.completed : !task.completed));

  const toggleCompletion = async (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    const taskToUpdate = updatedTasks.find(task => task.id === id);

    notification.open({
      message: taskToUpdate.completed ? "Tác vụ đã hoàn thành!" : "Tác vụ chưa hoàn thành!",
      description: `Bạn đã đánh dấu tác vụ "${taskToUpdate.title}" là ${
        taskToUpdate.completed ? "hoàn thành" : "chưa hoàn thành"
      }.`,
      onClick: () => {
        console.log("Thông báo đã được nhấn!");
      },
    });

    // Simulate PUT request to update the task (optional)
    try {
      await axios.put(`http://localhost:5002/tasks/${id}`, taskToUpdate);
    } catch (error) {
      console.error("Lỗi khi cập nhật tác vụ:", error);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh" 
    }}>
      <div style={{ padding: "20px", width: "400px" }}>
        <Title level={2}>Ứng dụng Quản lý Tác vụ</Title>
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Thêm một tác vụ mới"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <Button type="primary" onClick={addTask} style={{ width: "100%" }}>
          Thêm Tác vụ
        </Button>

        <Tabs defaultActiveKey="All" onChange={(key) => setFilter(key)} style={{ marginTop: "20px" }}>
          <TabPane tab="Tất cả" key="All" />
          <TabPane tab="Đã hoàn thành" key="Completed" />
          <TabPane tab="Chưa hoàn thành" key="Incomplete" />
        </Tabs>

        <List
          style={{ marginTop: "20px" }}
          bordered
          dataSource={filteredTasks}
          renderItem={(task) => (
            <List.Item>
              <Checkbox
                checked={task.completed}
                onChange={() => toggleCompletion(task.id)}
              >
                {task.title}
              </Checkbox>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default TodoApp;
