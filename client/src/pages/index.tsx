import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
    </div>
  );
};

const LogoutButton = styled.button`
  cursor: pointer;
`;

export default Todo;
