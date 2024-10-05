import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Checkbox,
  Input,
  List,
  Tabs,
  Typography,
  notification,
} from 'antd';
import styled from 'styled-components';

const { TabPane } = Tabs;
const { Title } = Typography;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const ContentWrapper = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 600px;
`;

const StyledTabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const StyledTitle = styled(Title)`
  text-align: center;
`;

const StyledInput = styled(Input)`
  width: 100%;
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledList = styled(List)`
  margin-top: 20px;
`;

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5002/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tác vụ:', error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTask.trim()) {
      const taskToAdd = { title: newTask, completed: false };
      try {
        const response = await axios.post(
          'http://localhost:5002/tasks',
          taskToAdd
        );
        setTasks([...tasks, response.data]);
        setNewTask('');
      } catch (error) {
        console.error('Lỗi khi thêm tác vụ:', error);
        notification.error({
          message: 'Thêm tác vụ thất bại',
          description: 'Đã xảy ra lỗi khi thêm tác vụ mới.',
        });
      }
    } else {
      notification.warning({
        message: 'Tác vụ rỗng',
        description: 'Vui lòng nhập một tác vụ để thêm.',
      });
    }
  };

  const toggleCompletion = async (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    const taskToUpdate = updatedTasks.find((task) => task.id === id);

    notification.open({
      message: taskToUpdate.completed
        ? 'Tác vụ đã hoàn thành!'
        : 'Tác vụ chưa hoàn thành!',
      description: `Bạn đã đánh dấu tác vụ "${taskToUpdate.title}" là ${
        taskToUpdate.completed ? 'hoàn thành' : 'chưa hoàn thành'
      }.`,
      onClick: () => {
        console.log('Thông báo đã được nhấn!');
      },
    });

    try {
      await axios.put(`http://localhost:5002/tasks/${id}`, taskToUpdate);
    } catch (error) {
      console.error('Lỗi khi cập nhật tác vụ:', error);
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const incompleteCount = tasks.filter((task) => !task.completed).length;

  const filteredTasks =
    filter === 'All'
      ? tasks
      : tasks.filter((task) =>
          filter === 'Completed' ? task.completed : !task.completed
        );

  return (
    <Container>
      <ContentWrapper>
        <StyledTitle level={2}>Ứng dụng Quản lý Tác vụ</StyledTitle>
        <StyledInput
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Thêm một tác vụ mới"
        />
        <StyledButton type="primary" onClick={addTask}>
          Thêm Tác vụ
        </StyledButton>

        <StyledTabsWrapper>
          <Tabs
            defaultActiveKey="All"
            onChange={(key) => setFilter(key)}
            centered
          >
            <TabPane tab={`Tất cả (${tasks.length})`} key="All" />
            <TabPane
              tab={`Đã hoàn thành (${completedCount})`}
              key="Completed"
            />
            <TabPane
              tab={`Chưa hoàn thành (${incompleteCount})`}
              key="Incomplete"
            />
          </Tabs>
        </StyledTabsWrapper>

        <StyledList
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
      </ContentWrapper>
    </Container>
  );
};

export default TodoApp;
