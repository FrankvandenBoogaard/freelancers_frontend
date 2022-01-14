import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import * as Yup from 'yup';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Navigate } from 'react-router-dom';
import { LoadingPanelChild } from '../../common/Loading';

const CUSTOMER_QUERY = gql`
  query GetCustomer($customerId: ID) {
    customer(id: $customerId) {
      data {
        id
        attributes {
          customerName
          customerLocation
          customerContact
          customerEmail
          customerPhone
          customerImageUrl
          createdAt
          updatedAt
          projects {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

const CUSTOMER_MUTATION_CREATE = gql`
  mutation CreateCustomer($data: CustomerInput!) {
    createCustomer(data: $data) {
      data {
        id
      }
    }
  }
`;

const CUSTOMER_MUTATION_UPDATE = gql`
  mutation UpdateCustomer($updateCustomerId: ID!, $data: CustomerInput!) {
    updateCustomer(id: $updateCustomerId, data: $data) {
      data {
        id
      }
    }
  }
`;

const CUSTOMER_MUTATION_DELETE = gql`
  mutation DeleteCustomer($deleteCustomerId: ID!) {
    deleteCustomer(id: $deleteCustomerId) {
      data {
        id
      }
    }
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PanelCustomerProfile() {
  const params = useParams();
  const updateMode = !params.id;
  const navigate = useNavigate();

  // form validation rules
  const validationSchema = Yup.object().shape({
    customerName: Yup.string().required('Customer name is required'),
    customerLocation: Yup.string(),
    customerImageUrl: Yup.string().url(),
    customerContact: Yup.string(),
    customerEmail: Yup.string().email(),
    customerPhone: Yup.number().required('Phone number is required'),
  });

  const { loading, error, data, refetch } = useQuery(CUSTOMER_QUERY, {
    variables: {
      customerId: params.id,
    },
    skip: updateMode,
  });

  const [mutateCustomerCreate] = useMutation(CUSTOMER_MUTATION_CREATE);
  const [mutateCustomerUpdate] = useMutation(CUSTOMER_MUTATION_UPDATE);
  const [mutateCustomerDelete] = useMutation(CUSTOMER_MUTATION_DELETE);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  function onSubmit(data) {
    return updateMode ? createCustomer(data) : updateCustomer(data);
  }

  function createCustomer(data) {
    return mutateCustomerCreate({
      variables: {
        data: data,
      },
    }).then(({data}) => {
      navigate(`/customers/${data.createCustomer.data.id}`);
    });
  }

  function updateCustomer(data) {
    return mutateCustomerUpdate({
      variables: {
        updateCustomerId: params.id,
        data: data,
      },
    }).then(() => {
      reset({ ...data }); //reset form met de nieuwe data om de errors te resetten en omdat je niet navigeert
      refetch();
    });
  }

  function deleteCustomer() {
    return mutateCustomerDelete({
      variables: {
        deleteCustomerId: params.id,
      },
    }).then(() => {
      navigate('/customers/add');
    });
  }

  if (loading) return <LoadingPanelChild />;
  if (error) return `Error! ${error}`;

  return (
    <>
      <h3 className='sr-only'>Profile</h3>
      <div className='max-w-7xl mx-auto py-5'>
        <form className='space-y-8 divide-y divide-gray-200'>
          <div>
            <div>
              {/* <h3 className='text-lg leading-6 font-medium text-gray-900'>
                {updateMode ? 'Add Customer' : 'Customer'}
              </h3> */}
              <p className='mt-1 text-xs text-gray-500'>
                Created:{' '}
                {data?.customer.data.attributes.createdAt
                  ? `${new Date(
                      data?.customer.data.attributes.createdAt
                    ).toLocaleString(undefined, {
                      hour12: false,
                    })}`
                  : 'to be determined'}{' '}
                | Updated:{' '}
                {data?.customer.data.attributes.updatedAt
                  ? `${new Date(
                      data?.customer.data.attributes.updatedAt
                    ).toLocaleString(undefined, {
                      hour12: false,
                    })}`
                  : 'to be determined'}
              </p>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6'>
              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='customer-name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Customer name*
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    {...register('customerName')}
                    defaultValue={data?.customer.data.attributes.customerName}
                    className={classNames(
                      errors.customerName
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.customerName && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p
                  className='mt-2 text-sm text-red-600'
                  id='customerName-error'
                >
                  {errors.customerName?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='customer-location'
                  className='block text-sm font-medium text-gray-700'
                >
                  Customer location
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    {...register('customerLocation')}
                    defaultValue={
                      data?.customer.data.attributes.customerLocation
                    }
                    className={classNames(
                      errors.customerLocation
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.customerLocation && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p
                  className='mt-2 text-sm text-red-600'
                  id='customerLocation-error'
                >
                  {errors.customerLocation?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-4'>
                <label
                  htmlFor='customer-contact'
                  className='block text-sm font-medium text-gray-700'
                >
                  Customer contact
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    {...register('customerContact')}
                    defaultValue={
                      data?.customer.data.attributes.customerContact
                    }
                    className={classNames(
                      errors.customerContact
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.customerContact && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p
                  className='mt-2 text-sm text-red-600'
                  id='customerContact-error'
                >
                  {errors.customerContact?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='phone-number'
                  className='block text-sm font-medium text-gray-700'
                >
                  Phone
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    inputMode='numeric'
                    {...register('customerPhone')}
                    defaultValue={data?.customer.data.attributes.customerPhone}
                    className={classNames(
                      errors.customerPhone
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.customerPhone && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p
                  className='mt-2 text-sm text-red-600'
                  id='customerPhone-error'
                >
                  {errors.customerPhone?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='customer-email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    {...register('customerEmail')}
                    defaultValue={data?.customer.data.attributes.customerEmail}
                    className={classNames(
                      errors.customerEmail
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.customerEmail && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='email-error'>
                  {errors.customerEmail?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-4'>
                <label
                  htmlFor='image-url'
                  className='block text-sm font-medium text-gray-700'
                >
                  LinkedIn image-URL
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    {...register('customerImageUrl')}
                    defaultValue={
                      data?.customer.data.attributes.customerImageUrl
                    }
                    className={classNames(
                      errors.customerImageUrl
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.customerImageUrl && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='imageUrl-error'>
                  {errors.customerImageUrl?.message}
                </p>
              </div>
            </div>
            <div className='pt-5'>
              <div className='flex justify-end'>
                {!updateMode && (
                  <button
                    type='button'
                    disabled={
                      isSubmitting ||
                      data?.customer.data.attributes.projects.data.length
                    }
                    className='bg-red-100 mr-auto border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50'
                    onClick={() => deleteCustomer()}
                  >
                    Delete
                  </button>
                )}

                <button
                  type='button'
                  disabled={isSubmitting}
                  onClick={() => {
                    reset();
                    navigate('/customers/add');
                  }}
                  className='ml-2 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Cancel
                </button>
                <button
                  type='button' // prevents 'Enter-key' from submitting form
                  onClick={handleSubmit(onSubmit)} // prevents 'Enter-key' from submitting form
                  disabled={!isDirty || isSubmitting}
                  className='ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
