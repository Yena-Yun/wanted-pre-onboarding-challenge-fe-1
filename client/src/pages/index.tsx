import { Link } from 'react-router-dom';

const Todo = () => {
  return (
    <div>
      <h1>Todo 앱</h1>
      <Link to='/login'>로그인</Link> / <Link to='/register'>회원가입</Link>
    </div>
  );
};

export default Todo;
