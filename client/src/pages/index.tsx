import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FlexColumn, FlexCustom } from 'styles/theme';

const Todo = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');

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

  return (
    <div>
      <h1>Todo 앱</h1>
      {token ? (
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      ) : (
        <Link to='/login'>로그인</Link>
      )}
      <Container>
        <TodoItem>
          <VerticalBar></VerticalBar>
          <FlexColumn>
            <FlexCustom justify='space-between'>
              <Title>제목</Title>
              <StatusBadge>진행중</StatusBadge>
            </FlexCustom>
            <DueDate>
              <span>[D-12]</span>
              <p>23.01.02 ~ 23.01.20</p>
            </DueDate>
            <Description>할 일 내용</Description>
          </FlexColumn>
        </TodoItem>
      </Container>
    </div>
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

const TodoItem = styled.div`
  width: 390px;
  padding: 17px 0 19px 24px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 14px;
  cursor: pointer;
`;

const VerticalBar = styled.div`
  width: 12px;
  height: 100%;
  background-color: #993399;
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
