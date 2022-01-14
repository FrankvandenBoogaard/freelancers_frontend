import { Fragment } from 'react';
import { ChevronLeftIcon, MailIcon, PhoneIcon } from '@heroicons/react/solid';

import { useLocation, useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Tab } from '@headlessui/react';
import PanelProjectDescription from './PanelProjectDescription';
import PanelProjectTasks from './PanelProjectTasks';
import ProjectNotFound from './ProjectNotFound';
import ProjectNotSelected from './ProjectNotSelected';
import { LoadingPanel } from '../../common/Loading';

const PROJECT_QUERY = gql`
  query GetProject($projectId: ID) {
    project(id: $projectId) {
      data {
        id
        attributes {
          projectName
          projectStart
          projectFinish
          projectPurchase
          projectSale
          projectDescription
        }
      }
    }
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PanelProject() {
  const params = useParams();
  const modus = params.id ? 1 : 0; // modus 0=select project 1=update project

  const { loading, error, data, refetch } = useQuery(PROJECT_QUERY, {
    variables: {
      projectId: params.id,
    },
    skip: !params.id,
  });

  if (loading) return <LoadingPanel />;
  if (error) return `Error! ${error}`;

  return (
    <>
      {/* Breadcrumb */}
      <nav
        className='flex items-start px-4 py-3 sm:px-6 lg:px-8 xl:hidden'
        aria-label='Breadcrumb'
      >
        <a
          href='#'
          className='inline-flex items-center space-x-3 text-sm font-medium text-gray-900'
        >
          <ChevronLeftIcon
            className='-ml-2 h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
          <span>Freelancers</span>
        </a>
      </nav>

      {data?.project.data !== null ? ( //when empty throw project not found
        <article>
          {/* Profile header */}

          <div>
            <div>
              <img
                className='h-32 w-full object-cover lg:h-48'
                src='https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
                alt=''
              />
            </div>
            <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5'>
                <div className='flex'>
                  <div className='inline-flex items-center justify-center bg-gray-100 h-24 w-24 rounded-lg border border-gray-300 ring-4 ring-white sm:h-32 sm:w-32'>
                    <svg
                      className='h-20 w-20 text-gray-500'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        vectorEffect='non-scaling-stroke'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='3'
                        d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
                      />
                    </svg>
                  </div>
                </div>
                <div className='mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1'>
                  <div className='sm:hidden 2xl:block mt-6 min-w-0 flex-1'>
                    <h1 className='text-2xl font-bold text-gray-900 truncate'>
                      {modus === 0
                        ? 'Select project'
                        : `${data?.project.data.attributes.projectName}`}
                    </h1>
                  </div>
                  <div className='mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4'>
                    {/* {modus === 2 && (
                      <button
                        type='button'
                        className='inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      >
                        <MailIcon
                          className='-ml-1 mr-2 h-5 w-5 text-gray-400'
                          aria-hidden='true'
                        />
                        <span>Message</span>
                      </button>
                    )}
                    {modus === 2 && (
                      <button
                        type='button'
                        className='inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      >
                        <PhoneIcon
                          className='-ml-1 mr-2 h-5 w-5 text-gray-400'
                          aria-hidden='true'
                        />
                        <span>Call</span>
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
              <div className='hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1'>
                <h1 className='text-2xl font-bold text-gray-900 truncate'>
                  {modus === 0
                    ? 'Select project'
                    : `${data?.project.data.attributes.projectName}`}
                </h1>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-0 lg:col-span-4'>
            <Tab.Group as='div'>
              <div className='border-b border-gray-200'>
                <Tab.List className='-mb-px flex space-x-8'>
                  {modus === 1 && (
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
                          'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
                        )
                      }
                    >
                      Description
                    </Tab>
                  )}
                  {modus === 1 && (
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
                          'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
                        )
                      }
                    >
                      Tasks
                    </Tab>
                  )}
                </Tab.List>
              </div>
              {modus === 0 && <ProjectNotSelected />}
              <Tab.Panels as={Fragment}>
                <Tab.Panel as='dl' className='text-sm text-gray-500'>
                  <PanelProjectDescription />
                </Tab.Panel>
                <Tab.Panel as='dl' className='text-sm text-gray-500'>
                  <PanelProjectTasks />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </article>
      ) : (
        <ProjectNotFound />
      )}
    </>
  );
}
