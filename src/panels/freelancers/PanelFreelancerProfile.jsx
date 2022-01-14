import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import * as Yup from 'yup';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingPanelChild } from '../../common/Loading';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FREELANCER_QUERY = gql`
  query GetFreelancer($freelancerId: ID) {
    freelancer(id: $freelancerId) {
      data {
        id
        attributes {
          firstName
          lastName
          imageUrl
          availableFrom
          hourlyRate
          email
          phoneNumber
          placeOfResidence
          rating
          description
          createdAt
          updatedAt
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

const FREELANCER_MUTATION_CREATE = gql`
  mutation CreateFreelancer($data: FreelancerInput!) {
    createFreelancer(data: $data) {
      data {
        id
      }
    }
  }
`;

const FREELANCER_MUTATION_UPDATE = gql`
  mutation UpdateFreelancer($updateFreelancerId: ID!, $data: FreelancerInput!) {
    updateFreelancer(id: $updateFreelancerId, data: $data) {
      data {
        id
      }
    }
  }
`;

const FREELANCER_MUTATION_DELETE = gql`
  mutation DeleteFreelancer($deleteFreelancerId: ID!) {
    deleteFreelancer(id: $deleteFreelancerId) {
      data {
        id
      }
    }
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PanelFreelancerProfile() {
  const params = useParams();
  const updateMode = !params.id;
  const navigate = useNavigate();

  // form validation rules
  const validationSchema = Yup.object()
    .shape({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      imageUrl: Yup.string().url().typeError('Incorrect URL'),
      availableFrom: Yup.date(),
      hourlyRate: Yup.lazy((value) =>
        value === '' ? undefined : Yup.number()
      ),
      email: Yup.string().email(),
      phoneNumber: Yup.number().required(),
      placeOfResidence: Yup.string(),
      //rating: Yup.lazy((value) => (value === '' ? null : Yup.number())),
      rating: Yup.number(),
      description: Yup.string(),
    })
    .required();

  const { loading, error, data, refetch } = useQuery(FREELANCER_QUERY, {
    variables: {
      freelancerId: params.id,
    },
    skip: updateMode,
  });
  const [mutateFreelancerCreate] = useMutation(FREELANCER_MUTATION_CREATE);
  const [mutateFreelancerUpdate] = useMutation(FREELANCER_MUTATION_UPDATE);
  const [mutateFreelancerDelete] = useMutation(FREELANCER_MUTATION_DELETE);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  function onSubmit(data) {
    return updateMode ? createFreelancer(data) : updateFreelancer(data);
  }

  function createFreelancer(data) {
    return mutateFreelancerCreate({
      variables: {
        data: data,
      },
    }).then(({ data }) => {
      navigate(`/freelancers/${data.createFreelancer.data.id}`);
    });
  }

  function updateFreelancer(data) {
    console.log('updateFreelancer', data)
    return mutateFreelancerUpdate({
      variables: {
        updateFreelancerId: params.id,
        data: data,
      },
    }).then(() => {
      reset({ ...data }); //reset form met de nieuwe data om de errors te resetten en omdat je niet navigert
      refetch();
    });
  }

  function deleteFreelancer() {
    return mutateFreelancerDelete({
      variables: {
        deleteFreelancerId: params.id,
      },
    }).then(() => {
      navigate('/freelancers/add');
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
                {updateMode ? 'Add Freelancer' : 'Freelancer'}
              </h3> */}
              <p className='mt-1 text-xs text-gray-500'>
                Created:{' '}
                {data?.freelancer.data.attributes.createdAt
                  ? `${new Date(
                      data?.freelancer.data.attributes.createdAt
                    ).toLocaleString(undefined, {
                      hour12: false,
                    })}`
                  : 'to be determined'}{' '}
                | Updated:{' '}
                {data?.freelancer.data.attributes.updatedAt
                  ? `${new Date(
                      data?.freelancer.data.attributes.updatedAt
                    ).toLocaleString(undefined, {
                      hour12: false,
                    })}`
                  : 'to be determined'}
              </p>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6'>
              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='first-name'
                  className='block text-sm font-medium text-gray-700'
                >
                  First name*
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    {...register('firstName')}
                    defaultValue={data?.freelancer.data.attributes.firstName}
                    className={classNames(
                      errors.firstName
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.firstName && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='firstName-error'>
                  {errors.firstName?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='last-name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Last name*
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    {...register('lastName')}
                    defaultValue={data?.freelancer.data.attributes.lastName}
                    className={classNames(
                      errors.lastName
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.lastName && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='lastName-error'>
                  {errors.lastName?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='place-of-residence'
                  className='block text-sm font-medium text-gray-700'
                >
                  Place of residence
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    {...register('placeOfResidence')}
                    defaultValue={
                      data?.freelancer.data.attributes.placeOfResidence
                    }
                    className={classNames(
                      errors.placeOfResidence
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.placeOfResidence && (
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
                  id='placeOfResidence-error'
                >
                  {errors.placeOfResidence?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='available-from'
                  className='block text-sm font-medium text-gray-700'
                >
                  Available as of
                </label>
                <div className='mt-1 relative'>
                  <Controller
                    control={control}
                    name='availableFrom'
                    defaultValue={
                      data?.freelancer
                        ? new Date(
                            data?.freelancer.data.attributes.availableFrom
                          )
                        : null
                    }
                    render={({ field }) => (
                      <ReactDatePicker
                        className={classNames(
                          errors.availableFrom
                            ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                            : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                          'block w-full sm:text-sm rounded-md'
                        )}
                        //placeholderText='Select date'
                        onChange={(e) => field.onChange(e)}
                        selected={field.value}
                        todayButton='Today'
                        minDate={new Date()}
                      />
                    )}
                  />
                  {errors.availableFrom && (
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
                  id='availableFrom-error'
                >
                  {errors.availableFrom?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='phone-number'
                  className='block text-sm font-medium text-gray-700'
                >
                  Phone*
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    inputMode='numeric'
                    {...register('phoneNumber')}
                    defaultValue={data?.freelancer.data.attributes.phoneNumber}
                    className={classNames(
                      errors.phoneNumber
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.phoneNumber && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='phoneNumber-error'>
                  {errors.phoneNumber?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    {...register('email')}
                    defaultValue={data?.freelancer.data.attributes.email}
                    className={classNames(
                      errors.email
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.email && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='email-error'>
                  {errors.email?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='hourly-rate'
                  className='block text-sm font-medium text-gray-700'
                >
                  Hourly rate
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    inputMode='numeric'
                    {...register('hourlyRate')}
                    defaultValue={data?.freelancer.data.attributes.hourlyRate}
                    className={classNames(
                      errors.hourlyRate
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.hourlyRate && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='hourlyRate-error'>
                  {errors.hourlyRate?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='rating'
                  className='block text-sm font-medium text-gray-700'
                >
                  Rating
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    inputMode='numeric'
                    {...register('rating')}
                    defaultValue={data?.freelancer.data.attributes.rating}
                    className={classNames(
                      errors.rating
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.rating && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='rating-error'>
                  {errors.rating?.message}
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
                    {...register('imageUrl')}
                    defaultValue={data?.freelancer.data.attributes.imageUrl}
                    className={classNames(
                      errors.imageUrl
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.imageUrl && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='imageUrl-error'>
                  {errors.imageUrl?.message}
                </p>
              </div>

              <div className='col-span-6'>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700'
                >
                  Description
                </label>
                <div className='mt-1 relative'>
                  <textarea
                    type='text'
                    rows='5'
                    {...register('description')}
                    defaultValue={data?.freelancer.data.attributes.description}
                    className={classNames(
                      errors.description
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.description && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='description-error'>
                  {errors.description?.message}
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
                      data?.freelancer.data.attributes.tasks.data.length
                    }
                    className='bg-red-100 mr-auto border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50'
                    onClick={() => deleteFreelancer()}
                  >
                    Delete
                  </button>
                )}

                <button
                  type='button'
                  disabled={isSubmitting}
                  onClick={() => {
                    reset();
                    navigate('/freelancers/add');
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
