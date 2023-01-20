import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authToken } from 'api';
import { FlexColumnCustom } from 'styles/theme';

export const Home = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const moveToLogin = () => {
    navigate('/login');
  };

  const moveToTodo = () => {
    navigate('/todo');
  };

  return (
    <Container>
      <ButtonGroup>
        <div>
          {authToken ? (
            <AuthButton onClick={handleLogOut}>로그아웃</AuthButton>
          ) : (
            <AuthButton onClick={moveToLogin}>로그인</AuthButton>
          )}
        </div>
        <div>
          {authToken && (
            <TodoButton onClick={moveToTodo}>Todo로 이동</TodoButton>
          )}
        </div>
      </ButtonGroup>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: lightgreen;
`;

const ButtonGroup = styled(FlexColumnCustom)`
  width: 100%;
  height: 100%;
  gap: 40px;
`;

const AuthButton = styled.button`
  width: 200px;
  height: 40px;
  cursor: pointer;
`;

const TodoButton = styled.button`
  width: 200px;
  height: 40px;
  cursor: pointer;
`;
