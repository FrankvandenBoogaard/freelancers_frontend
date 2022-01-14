import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import MainShellWithNav from './pages/MainShellWithNav';
import NotFound from './pages/NotFound';
import FreelancerNotFound from './panels/freelancers/FreelancerNotFound';
import DirectoryFreelancers from './directories/DirectoryFreelancers';
import Dashboard from './pages/Dashboard';
import PanelFreelancer from './panels/freelancers/PanelFreelancer';
import DirectoryCustomers from './directories/DirectoryCustomers';
import DirectoryProjects from './directories/DirectoryProjects';
import DirectoryTasks from './directories/DirectoryTasks';
import PanelCustomer from './panels/customers/PanelCustomer';
import PanelProject from './panels/projects/PanelProject';
import PanelTask from './panels/tasks/PanelTask';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import CustomerNotFound from './panels/customers/CustomerNotFound';
import ProjectNotFound from './panels/projects/ProjectNotFound';
import TaskNotFound from './panels/tasks/TaskNotFound';
import Settings from './pages/Settings';
import Login from './pages/Login';
//import useAuth from './hooks/useAuth';
import { setContext } from '@apollo/client/link/context';
import { AUTH_TOKEN } from './hooks/constant';

const httpLink = createHttpLink({
  uri: 'https://evening-taiga-97765.herokuapp.com/graphql',
  //uri: 'http://localhost:1337/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// apollo client
const client = new ApolloClient({
  //link: httpLink,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Freelancer: {
        keyFields: ['phoneNumber'],
      },
      Customer: {
        keyFields: ['customerName'],
      },
      Project: {
        keyFields: ['projectName', 'projectStart'],
      },
      Task: {
        keyFields: ['taskName', 'taskStart'],
      },
    },
  }),
});

function RequireAuth({ children }) {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  //const { authed } = useAuth();
  const location = useLocation();

  return authToken ? (
    children
  ) : (
    <Navigate to='/login' replace state={{ path: location.pathname }} />
  );
}

export default function App() {
  const location = useLocation();
  return (
    <ApolloProvider client={client}>
      <Routes>
        <Route
          path='/'
          element={
            <RequireAuth>
              <MainShellWithNav />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='settings' element={<Settings />} />
          <Route path='freelancers' element={<DirectoryFreelancers />}>
            <Route index element={<FreelancerNotFound />} />
            <Route
              path='add'
              element={<PanelFreelancer key={location.key} />}
            />
            <Route
              path=':id'
              element={<PanelFreelancer key={location.key} />}
            />
          </Route>
          <Route path='customers' element={<DirectoryCustomers />}>
            <Route index element={<CustomerNotFound />} />
            <Route path='add' element={<PanelCustomer key={location.key} />} />
            <Route path=':id' element={<PanelCustomer key={location.key} />} />
          </Route>
          <Route path='projects' element={<DirectoryProjects />}>
            <Route index element={<ProjectNotFound />} />
            <Route
              path='select'
              element={<PanelProject key={location.key} />}
            />
            <Route path=':id' element={<PanelProject key={location.key} />} />
          </Route>
          <Route path='tasks' element={<DirectoryTasks />}>
            <Route index element={<TaskNotFound />} />
            <Route path='select' element={<PanelTask key={location.key} />} />
            <Route path=':id' element={<PanelTask key={location.key} />} />
          </Route>
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </ApolloProvider>
  );
}
