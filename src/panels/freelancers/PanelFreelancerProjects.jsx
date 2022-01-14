import { Fragment } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { FolderIcon, UserIcon, XIcon } from '@heroicons/react/outline';
import { LoadingPanelChild } from '../../common/Loading';

const PROJECTS_QUERY = gql`
  query GetProjects($filters: ProjectFiltersInput) {
    projects(filters: $filters) {
      data {
        id
        attributes {
          projectName
          projectStart
          projectFinish
        }
      }
    }
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PanelFreelancerProjects() {
  const params = useParams();
  const isAddMode = !params.id;
  const { loading, error, data, refetch } = useQuery(PROJECTS_QUERY, {
    variables: {
      filters: {
        tasks: {
          freelancer: {
            id: {
              eq: params.id,
            },
          },
        },
      },
    },
    skip: isAddMode,
    pollInterval: 2000,
  });

  if (loading) return <LoadingPanelChild />;
  if (error) return `Error! ${error}`;

  return (
    <>
      <h3 className='sr-only'>Projects</h3>
      <ul
        role='list'
        className='py-12 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2'
      >
        {!data?.projects.data.length ? (
          <div className='relative rounded-lg border border-dashed border-gray-300 bg-white group py-2 px-3 shadow-sm flex items-center space-x-4 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'>
            <div
              //to={`/tasks/${task.id}`}
              className='-m-1 flex-1 block p-1'
            >
              <div className='absolute inset-0' aria-hidden='true' />
              <div className='flex-1 flex items-center min-w-0 relative'>
                <span className='flex-shrink-0 inline-block relative'>
                  <FolderIcon
                    className='border bg-gray-50 rounded-lg p-1 text-gray-400 flex-shrink-0 h-12 w-12'
                    aria-hidden='true'
                  />
                  {/* <img
              className='border h-12 w-12 rounded-full'
              src={freelancer.attributes.imageUrl}
              alt=''
            /> */}
                  {/* <span
              className={classNames(
                person.status === 'online'
                  ? 'bg-green-400'
                  : 'bg-gray-300',
                'absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white'
              )}
              aria-hidden='true'
            /> */}
                </span>
                <div className='ml-4 truncate'>
                  <p className='text-sm font-medium text-gray-500 truncate'>
                    No linked projects available
                  </p>
                  <p className='text-sm text-gray-500 truncate'>
                    {/* {new Date(task.attributes.taskStart).toLocaleDateString(
                undefined,
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }
              )}{' '}
              -{' '}
              {new Date(task.attributes.taskFinish).toLocaleDateString(
                undefined,
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }
              )} */}
                  </p>
                </div>
              </div>
            </div>
            {/* <Menu
          as='div'
          className='ml-2 flex-shrink-0 relative inline-block text-left'
        >
          <Menu.Button className='group relative w-8 h-8 bg-white rounded-full inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
            <span className='sr-only'>Open options menu</span>
            <span className='flex items-center justify-center h-full w-full rounded-full'>
              <DotsVerticalIcon
                className='w-5 h-5 text-gray-400 group-hover:text-gray-500'
                aria-hidden='true'
              />
            </span>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='origin-top-right absolute z-10 top-0 right-9 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      onClick={() => setOpenSlideOver(true)}
                      className={classNames(
                        active
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700',
                        'block px-4 py-2 text-sm cursor-pointer'
                      )}
                    >
                      Switch freelancer
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      onClick={() => handleFreelancerBreakLink()}
                      className={classNames(
                        active
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700',
                        'block px-4 py-2 text-sm cursor-pointer'
                      )}
                    >
                      Remove from task
                    </div>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu> */}
          </div>
        ) : (
          <>
            {data?.projects.data.map((project) => (
              <div
                key={project.id}
                className='relative rounded-lg border border-gray-300 bg-white group py-2 px-3 shadow-sm flex items-center space-x-4 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
              >
                <Link
                  to={`/projects/${project.id}`}
                  className='-m-1 flex-1 block p-1'
                >
                  <div className='absolute inset-0' aria-hidden='true' />
                  <div className='flex-1 flex items-center min-w-0 relative'>
                    <span className='flex-shrink-0 inline-block relative'>
                      <FolderIcon
                        className='border bg-gray-50 rounded-lg p-1 text-gray-500 flex-shrink-0 h-12 w-12'
                        aria-hidden='true'
                      />
                      {/* <img
                      className='border h-12 w-12 rounded-full'
                      src={freelancer.attributes.imageUrl}
                      alt=''
                    /> */}
                      {/* <span
                      className={classNames(
                        person.status === 'online'
                          ? 'bg-green-400'
                          : 'bg-gray-300',
                        'absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white'
                      )}
                      aria-hidden='true'
                    /> */}
                    </span>
                    <div className='ml-4 truncate'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                      {project.attributes.projectName}
                      </p>
                      <p className='text-sm text-gray-500 truncate'>
                      {new Date(
                            project.attributes.projectStart
                          ).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          -{' '}
                          {new Date(
                            project.attributes.projectFinish
                          ).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                      </p>
                    </div>
                  </div>
                </Link>
                {/* <Menu
                  as='div'
                  className='ml-2 flex-shrink-0 relative inline-block text-left'
                >
                  <Menu.Button className='group relative w-8 h-8 bg-white rounded-full inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    <span className='sr-only'>Open options menu</span>
                    <span className='flex items-center justify-center h-full w-full rounded-full'>
                      <DotsVerticalIcon
                        className='w-5 h-5 text-gray-400 group-hover:text-gray-500'
                        aria-hidden='true'
                      />
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='origin-top-right absolute z-10 top-0 right-9 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      <div className='py-1'>
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              onClick={() => setOpenSlideOver(true)}
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm cursor-pointer'
                              )}
                            >
                              Switch freelancer
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              onClick={() => handleFreelancerBreakLink()}
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm cursor-pointer'
                              )}
                            >
                              Remove from task
                            </div>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu> */}
              </div>
            ))}
          </>
        )}
      </ul>
    </>
  );
}
