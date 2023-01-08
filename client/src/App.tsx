import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Todo from 'pages';
import Login from 'pages/Auth/Login';
import Register from 'pages/Auth/Register';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnWindowFocus: false,
        useErrorBoundary: true,
      },
      mutations: {
        useErrorBoundary: true,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/' element={<Todo />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
