import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import { Home } from './components/Home';
import { UserProvider } from './context/UserContext';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense, lazy } from 'react';
import { NotificationProvider } from './context/NotificationContext';

const SignUp = lazy(() => import("./components/SignUp"));
const ExpenseDetails = lazy(() => import("./components/ExpenseDetails"));
const EditForm = lazy(() => import("./components/EditForm"));

const queryClient=new QueryClient({
  queryCache: new QueryCache(),
   defaultOptions: {
      queries: {
        staleTime: 60_000,
      }
    }
})

function App() {
  return (
    <>
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV === "development" && (
              <ReactQueryDevtools position="top" initialIsOpen={false} />
            )}
          <BrowserRouter>
            <UserProvider>
              <h1>Expenses App</h1>
              <Suspense fallback={<h1>Still Loading…</h1>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/expenseDetails/:id" element={<ExpenseDetails />} />
                  <Route path="/expenseDetails/:id/edit" element={<EditForm />} />
                </Routes>
              </Suspense>
            </UserProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </NotificationProvider>
    </>
  )
}

export default App
