import { SearchIcon, RefreshIcon } from '@heroicons/react/solid';
import { UserIcon } from '@heroicons/react/outline';
import { Outlet, Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { LoadingDirectory } from '../common/Loading';

const FREELANCERS = gql`
  query GetFreelancers(
    $pagination: PaginationArg
    $filters: FreelancerFiltersInput
    $sort: [String]
  ) {
    freelancers(pagination: $pagination, filters: $filters, sort: $sort) {
      data {
        id
        attributes {
          imageUrl
          firstName
          lastName
          phoneNumber
          availableFrom
        }
      }
    }
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DirectoryFreelancers() {
  const {
    loading,
    error,
    data,
    refetch: refetchDirectory,
  } = useQuery(FREELANCERS, {
    variables: {
      sort: 'lastName',
      pagination: { pageSize: 1000 },
    },
    pollInterval: 2000,
  });

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      search: '',
    },
  });

  function onSubmit(e) {
    refetchDirectory({
      filters: {
        lastName: {
          containsi: e.search,
        },
      },
    });
  }

  function checkKeyDown(key) {
    //if (key.code === 'Enter') key.preventDefault();
    if (key.code === 'Escape') {
      resetField('search');
      refetchDirectory({
        filters: {
          lastName: {
            containsi: '',
          },
        },
      });
    }
  }

  if (loading) return <LoadingDirectory />;
  if (error) return `Error! ${error}`;

  return (
    <>
      <main className='flex-1 relative z-0 overflow-y-scroll focus:outline-none xl:order-last'>
        {/* Start main area*/}
        <Outlet />
        {/* End main area */}
      </main>
      <aside className='hidden xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200'>
        {/* Start secondary column (hidden on smaller screens) */}
        <div className='px-6 pt-6 pb-4'>
          <h2 className='text-lg font-medium text-gray-900'>Freelancers</h2>
          <p className='mt-1 text-sm text-gray-600'>
            Search directory of {data?.freelancers.data.length} freelancer
            {data?.freelancers.data.length !== 1 && 's'}
          </p>
          <form
            className='mt-6 flex space-x-4'
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(key) => checkKeyDown(key)}
          >
            <div className='flex-1 min-w-0'>
              <label htmlFor='search' className='sr-only'>
                Search
              </label>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <SearchIcon
                    className='h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                </div>
                <input
                  type='text'
                  autoComplete='off'
                  {...register('search')}
                  className='focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                  placeholder='Last name'
                />
              </div>
            </div>
            <button
              type='submit'
              // onClick={() => {
              //   navigate('/freelancers/add');
              // }}
              className='inline-flex justify-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <RefreshIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
              <span className='sr-only'>Search</span>
            </button>
          </form>
        </div>
        {/* Directory list */}
        <nav className='flex-1 min-h-0 overflow-y-auto' aria-label='Directory'>
          {/* {Object.keys(directory).map((letter) => ( */}
          <div>
            {/* <div className='z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500'>
                <h3>{letter}</h3>
              </div> */}
            <ul className='relative z-0 border-t border-b divide-y divide-gray-200'>
              {!data?.freelancers.data.length ? (
                <>
                  <div>
                    <div className='relative group py-4 px-6 flex items-center'>
                      <div className='-m-1 flex-1 block p-1'>
                        <div className='absolute inset-0' aria-hidden='true' />
                        <div className='flex-1 flex items-center min-w-0 relative'>
                          <span className='bg-gray-50 border rounded-full p-1 flex-shrink-0 inline-block relative'>
                            <UserIcon
                              className='text-gray-300 flex-shrink-0 h-10 w-10'
                              aria-hidden='true'
                            />
                            {/* <img
                                className='border h-12 w-12 rounded-full'
                                src={freelancer.attributes.imageUrl}
                                alt=''
                              />
                              <span
                                className={classNames(
                                  freelancer.attributes.availableFrom <=
                                    new Date().toISOString()
                                    ? 'bg-green-400'
                                    : 'bg-gray-300',
                                  'absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white'
                                )}
                                aria-hidden='true'
                              /> */}
                          </span>
                          <div className='ml-4 truncate'>
                            <p className='text-sm font-medium text-gray-500 truncate'>
                              No freelancers available
                            </p>
                            <p className='text-sm text-gray-400 truncate'>
                              Get started by adding a freelancer
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* <Menu
                    as='div'
                    className='ml-2 flex-shrink-0 relative inline-block text-left'
                  >
                    <Menu.Button className='group relative w-8 h-8 bg-white rounded-full inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                      <span className='sr-only'>
                        Open options menu
                      </span>
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
                              <a
                                href='#'
                                className={classNames(
                                  active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                View profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href='#'
                                className={classNames(
                                  active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Send message
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu> */}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {data?.freelancers.data.map((freelancer) => (
                    <li key={freelancer.id}>
                      <div className='relative group py-4 px-6 flex items-center'>
                        <Link
                          to={`/freelancers/${freelancer.id}`}
                          className='-m-1 flex-1 block p-1 cursor-pointer'
                        >
                          <div
                            className='absolute inset-0 group-hover:bg-gray-50'
                            aria-hidden='true'
                          />
                          <div className='flex-1 flex items-center min-w-0 relative'>
                            <span className='bg-gray-100 border rounded-full flex-shrink-0 inline-block relative'>
                              {/* <DocumentTextIcon
                          className='text-gray-500 flex-shrink-0 h-8 w-8'
                          aria-hidden='true'
                        /> */}
                              {freelancer.attributes.imageUrl ? (
                                <img
                                  className='border h-12 w-12 rounded-full'
                                  src={freelancer.attributes.imageUrl}
                                  alt=''
                                />
                              ) : (
                                <UserIcon
                                  className='text-gray-300 flex-shrink-0 h-12 w-12 p-1'
                                  aria-hidden='true'
                                />
                              )}
                              <span
                                className={classNames(
                                  freelancer.attributes.availableFrom <=
                                    new Date().toISOString()
                                    ? 'bg-green-400'
                                    : 'bg-gray-300',
                                  'absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white'
                                )}
                                aria-hidden='true'
                              />
                            </span>
                            <div className='ml-4 truncate'>
                              <p className='text-sm font-medium text-gray-900 truncate'>
                                {freelancer.attributes.lastName},{' '}
                                {freelancer.attributes.firstName}
                              </p>
                              <p className='text-sm text-gray-500 truncate'>
                                {new Date(
                                  freelancer.attributes.availableFrom
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
                      <span className='sr-only'>
                        Open options menu
                      </span>
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
                              <a
                                href='#'
                                className={classNames(
                                  active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                View profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href='#'
                                className={classNames(
                                  active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Send message
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu> */}
                      </div>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
          {/* ))} */}
        </nav>
        {/* End secondary column */}
      </aside>
    </>
  );
}
