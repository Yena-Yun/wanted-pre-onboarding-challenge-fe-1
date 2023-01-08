import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TodoAPI, TodoMutationType, TodoProp } from 'api/todo';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FlexColumn, FlexCustom } from 'styles/theme';

const Todo = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [addTodo, setAddTodo] = useState({
    title: '',
    content: '',
  });
  const [isShow, setIsShow] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setToken(authToken!);

    if (!authToken) {
      alert('환영합니다! 로그인을 해주세요.');
      navigate('/login');
    }
  }, [navigate, token]);

  const handleLogout = () => {
    alert('또 만나요!');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const { data: todoList } = useQuery<{ data: TodoProp[] }, Error>(
    ['todos', token],
    () => TodoAPI.getTodos(token).then((res) => res),
    {
      onSuccess: ({ data }) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleAddTodo = () => {
    setIsShow(!isShow);
  };

  const handleAddTodoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'title') {
      setAddTodo({ ...addTodo, title: value });
    } else {
      setAddTodo({ ...addTodo, content: value });
    }
  };

  const queryClient = useQueryClient();

  const { mutateAsync: createMutate } = useMutation<
    { data: TodoProp },
    Error,
    TodoMutationType
  >(TodoAPI.createTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', token]);
    },
  });

  const handleAddTodoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resultTodo = {
      title: titleRef.current!.value,
      content: contentRef.current!.value,
    };

    try {
      await createMutate({
        title: resultTodo.title,
        content: resultTodo.content,
        authToken: token,
      });
    } catch (err) {
      console.log(err);
    }

    setAddTodo({
      title: '',
      content: '',
    });

    setIsShow(false);
  };

  const { mutateAsync: deleteMutate } = useMutation(TodoAPI.deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', token]);
    },
  });

  const handleTodoDelete = async (id: string) => {
    try {
      await deleteMutate(id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>Todo 앱</h1>
      {token ? (
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      ) : (
        <Link to='/login'>로그인</Link>
      )}
      <Container>
        <AddTodoButton onClick={handleAddTodo}>Todo 추가</AddTodoButton>
        <AddTodoInputGroup onSubmit={handleAddTodoSubmit} show={isShow}>
          <AddInput
            ref={titleRef}
            name='title'
            value={addTodo.title}
            placeholder='할 일 제목'
            onChange={handleAddTodoChange}
          />
          <AddInput
            ref={contentRef}
            name='content'
            value={addTodo.content}
            placeholder='할 일 내용'
            onChange={handleAddTodoChange}
          />
          <AddTodoButton>추가</AddTodoButton>
        </AddTodoInputGroup>
        {todoList?.data.length! > 0 ? (
          todoList?.data.map(
            ({
              id,
              title,
              content,
            }: Pick<TodoProp, 'id' | 'title' | 'content'>) => (
              <FlexCustom key={id}>
                <TodoItem>
                  <FlexColumn>
                    <FlexCustom justify='space-between'>
                      <Title>{title}</Title>
                    </FlexCustom>
                    <Description>{content}</Description>
                  </FlexColumn>
                </TodoItem>
                <TodoDeleteButton onClick={() => handleTodoDelete(id)}>
                  ❌
                </TodoDeleteButton>
              </FlexCustom>
            )
          )
        ) : (
          <div>Todo가 없습니다!</div>
        )}
      </Container>
    </>
  );
};

const LogoutButton = styled.button`
  cursor: pointer;
`;

const Container = styled.div`
  max-width: 450px;
  padding: 24px 20px;
  margin-top: 40px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 14px;
`;

const AddTodoButton = styled.button`
  padding: 8px 14px;
  margin-bottom: 16px;
  border: 1px solid green;
  border-radius: 10px;
  cursor: pointer;
`;

const AddInput = styled.input`
  flex: 1 1 0%;
  position: relative;
  width: 100%;
  padding: 12px 20px;
  margin-top: 12px;
  border-radius: 12px;
  box-shadow: rgb(0 0 0 / 12%) 0px 0px 0px 1px inset;
  background-color: rgb(255, 255, 255);
  color: rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  cursor: text;
  transition: all 0.1s ease 0s;
`;

const AddTodoInputGroup = styled.form<{ show: boolean }>`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  flex-direction: column;
  margin-bottom: 24px;
`;

const TodoItem = styled.div`
  width: 390px;
  padding: 17px 0 19px 24px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 14px;
  cursor: pointer;
`;

const TodoDeleteButton = styled.button`
  width: 70px;
  height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 14px;
  cursor: pointer;
`;

const Title = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const StatusBadge = styled.div`
  padding: 6px 8px;
  margin-right: 8px;

  font-size: 12px;
  color: #993399;

  background-color: rgba(124, 129, 252, 0.1);
  border-radius: 8px;
  cursor: default;

  &:nth-child(2n) {
    color: #5ced73;
    background-color: #f4faf0;
  }
`;

const DueDate = styled.div`
  margin-bottom: 1rem;

  span {
    margin-right: 4px;
    font-size: 15px;
    font-weight: 500;
    color: #993399;
  }

  p {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
  }
`;

const Description = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 11px;
`;

export default Todo;
