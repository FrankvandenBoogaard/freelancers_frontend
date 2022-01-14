import { Fragment, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
  DocumentTextIcon,
  DocumentAddIcon,
  XIcon,
} from '@heroicons/react/outline';
import PanelFreelancerTasksSlideOver from './PanelFreelancerTasksSlideOver';
import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import { LoadingPanelChild } from '../../common/Loading';

//de tweede query 'freelancer(id: $freelancerId)' is nodig om alle tasks op te halen voor de huidige freelancer en daaruit een gekozen taak te verwijderen (kruisknop).
const TASKS_QUERY = gql`
  query GetTasks($filters: TaskFiltersInput, $freelancerId: ID) {
    tasks(filters: $filters) {
      data {
        id
        attributes {
          taskName
          taskStart
          taskFinish
        }
      }
    }
    freelancer(id: $freelancerId) {
      data {
        attributes {
          phoneNumber
          tasks {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

const FREELANCER_UPDATE_TASKS = gql`
  mutation UpdateFreelancerTasks(
    $updateFreelancerId: ID!
    $data: FreelancerInput!
  ) {
    updateFreelancer(id: $updateFreelancerId, data: $data) {
      data {
        id
      }
    }
  }
`;

export default function PanelFreelancerTasks() {
  const [openSlideOver, setOpenSlideOver] = useState(false);
  const params = useParams();
  const freelancerId = params.id;

  const isAddMode = !params.id;
  const { loading, error, data, refetch } = useQuery(TASKS_QUERY, {
    variables: {
      freelancerId: freelancerId,
      filters: {
        freelancer: {
          id: {
            eq: freelancerId,
          },
        },
      },
    },
    skip: isAddMode,
    pollInterval: 2000,
  });

  const [mutateFreelancerUpdate] = useMutation(FREELANCER_UPDATE_TASKS);

  function handleTaskBreakLink(tskId) {
    const filteredArray = data.freelancer.data.attributes.tasks.data
      .filter(function (obj) {
        return obj.id !== tskId;
      })
      .map(function (obj) {
        return obj.id;
      });

    return mutateFreelancerUpdate({
      variables: {
        updateFreelancerId: freelancerId,
        data: {
          tasks: filteredArray,
        },
      },
    }).then(() => {
      refetch();
    });
  }

  if (loading) return <LoadingPanelChild />;
  if (error) return `Error! ${error}`;

  return (
    <>
      <>
        <h3 className='sr-only'>Tasks</h3>
        <ul
          role='list'
          className='py-12 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2'
        >
          <div className='relative cursor-pointer rounded-lg border border-dashed border-gray-300 bg-white group py-2 px-3 shadow-sm flex items-center space-x-4 hover:border-solid hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'>
            <div
              onClick={() => setOpenSlideOver(true)}
              className='-m-1 flex-1 block p-1'
            >
              <div className='absolute inset-0' aria-hidden='true' />
              <div className='flex-1 flex items-center min-w-0 relative'>
                <span className='flex-shrink-0 inline-block relative'>
                  <DocumentAddIcon
                    className='border bg-gray-50 rounded-lg p-1 text-gray-500 flex-shrink-0 h-12 w-12'
                    aria-hidden='true'
                  />
                  {/* <img
                    className='h-10 w-10 rounded-full'
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
                    Link available tasks to freelancer ...
                  </p>
                  <p className='text-sm text-gray-500 truncate'>
                    {/* {freelancer.attributes.placeOfResidence} */}
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
          {data?.tasks.data.map((task) => (
            <div key={task.id}>
              <div className='col-span-1 group flex shadow-sm rounded-md'>
                <div className='py-2 px-3 bg-white border-y border-l border-gray-300 group-hover:border-gray-400 flex-shrink-0 flex items-center justify-center  text-white text-sm font-medium rounded-l-md'>
                  <div className='flex-shrink-0'>
                    <DocumentTextIcon
                      className='border bg-gray-50 rounded-lg p-1 text-gray-500 flex-shrink-0 h-12 w-12'
                      aria-hidden='true'
                    />
                  </div>
                </div>
                <div className='flex-1 flex items-center justify-between border-y border-r border-gray-300 group-hover:border-gray-400 bg-white rounded-r-md truncate'>
                  <Link
                    to={`/tasks/${task.id}`}
                    className='flex-1 pr-4 py-2 text-sm  truncate'
                  >
                    <div className='text-gray-900 font-medium truncate'>
                      {task.attributes.taskName}

                      <p className='text-gray-500'>
                        {new Date(task.attributes.taskStart).toLocaleDateString(
                          undefined,
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}{' '}
                        -{' '}
                        {new Date(
                          task.attributes.taskFinish
                        ).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </Link>
                  <div className='flex-shrink-0 pr-2'>
                    <button
                      type='button'
                      onClick={() => handleTaskBreakLink(task.id)}
                      className='w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    >
                      <span className='sr-only'>Break link task</span>
                      <XIcon className='w-5 h-5' aria-hidden='true' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </>
      <PanelFreelancerTasksSlideOver
        refetch={refetch}
        openSlideOver={openSlideOver}
        setOpenSlideOver={setOpenSlideOver}
      />
    </>
  );
}
