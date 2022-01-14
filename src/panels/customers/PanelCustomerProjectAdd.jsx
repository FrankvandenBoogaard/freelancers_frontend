import { useNavigate, useParams } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import * as Yup from 'yup';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PROJECT_MUTATION_CREATE = gql`
  mutation CreateProject($data: ProjectInput!) {
    createProject(data: $data) {
      data {
        id
      }
    }
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PanelCustomerProjectAdd({ refetch, setAddProject }) {
  const params = useParams();
  const customerId = params.id;
  const navigate = useNavigate();

  // form validation rules
  const validationSchema = Yup.object().shape({
    projectName: Yup.string().required('First name is required'),
    projectStart: Yup.date()
      .typeError('Date is required')
      .required('Date is required'),
    projectFinish: Yup.date()
      .typeError('Date is required')
      .min(Yup.ref('projectStart'), "End date can't be before start date")
      .required('Date is required'),
    projectPurchase: Yup.number().required('Purchase amount is required'),
    projectSale: Yup.number().required('Sale amount is required'),
    projectDescription: Yup.string(),
  });

  const [mutateProjectCreate] = useMutation(PROJECT_MUTATION_CREATE);

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
    return mutateProjectCreate({
      variables: {
        data: {
          ...data,
          customer: customerId, // aangeven aan welke customer moet worden gekoppeld
        },
      },
    }).then(() => {
      refetch();
      setAddProject(false);
    });
  }

  return (
    <>
      <h3 className='sr-only'>Description</h3>
      <div className='max-w-7xl mx-auto py-5'>
        <form className='space-y-8 divide-y divide-gray-200'>
          <div>
            <div>
              {/* <h3 className='text-lg leading-6 font-medium text-gray-900'>
                {updateMode ? 'Add Project' : 'Project'}
              </h3> */}
              {/* <p className='mt-1 text-xs text-gray-500'>
                Created:{' '}
                {data?.project.data.attributes.createdAt
                  ? `${new Date(
                      data?.project.data.attributes.createdAt
                    ).toLocaleString(undefined, {
                      hour12: false,
                    })}`
                  : 'to be determined'}{' '}
                | Updated:{' '}
                {data?.project.data.attributes.updatedAt
                  ? `${new Date(
                      data?.project.data.attributes.updatedAt
                    ).toLocaleString(undefined, {
                      hour12: false,
                    })}`
                  : 'to be determined'}
              </p> */}
            </div>
            <div className='mt-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6'>
              <div className='col-span-6 sm:col-span-5'>
                <label
                  htmlFor='project-name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Project name*
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    {...register('projectName')}
                    //defaultValue={data?.project.data.attributes.projectName}
                    className={classNames(
                      errors.projectName
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.projectName && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='projectName-error'>
                  {errors.projectName?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='project-start'
                  className='block text-sm font-medium text-gray-700'
                >
                  Project start*
                </label>
                <div className='mt-1 relative'>
                  <Controller
                    control={control}
                    name='projectStart'
                    render={({ field }) => (
                      <ReactDatePicker
                        className={classNames(
                          errors.projectStart
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
                  {errors.projectStart && (
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
                  id='projectStart-error'
                >
                  {errors.projectStart?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='project-finish'
                  className='block text-sm font-medium text-gray-700'
                >
                  Project finish
                </label>
                <div className='mt-1 relative'>
                  <Controller
                    control={control}
                    name='projectFinish'
                    render={({ field }) => (
                      <ReactDatePicker
                        className={classNames(
                          errors.projectFinish
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
                  {errors.projectFinish && (
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
                  id='projectFinish-error'
                >
                  {errors.projectFinish?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='project-purchase'
                  className='block text-sm font-medium text-gray-700'
                >
                  Purchase
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    inputMode='numeric'
                    {...register('projectPurchase')}
                    //defaultValue={data?.project.data.attributes.projectPurchase}
                    className={classNames(
                      errors.projectPurchase
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.projectPurchase && (
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
                  id='projectPurchase-error'
                >
                  {errors.projectPurchase?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='project-sales'
                  className='block text-sm font-medium text-gray-700'
                >
                  Sale
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    inputMode='numeric'
                    {...register('projectSale')}
                    //defaultValue={data?.project.data.attributes.projectSale}
                    className={classNames(
                      errors.projectSale
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.projectSale && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='projectSale-error'>
                  {errors.projectSale?.message}
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
                    {...register('projectDescription')}
                    // defaultValue={
                    //   data?.project.data.attributes.projectDescription
                    // }
                    className={classNames(
                      errors.projectDescription
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.projectDescription && (
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
                  id='projectDescription-error'
                >
                  {errors.projectDescription?.message}
                </p>
              </div>
            </div>

            <div className='pt-5'>
              <div className='flex justify-end'>
                {/* {!updateMode && (
                  <button
                    type='button'
                    disabled={isSubmitting}
                    className='bg-red-100 mr-auto border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50'
                    //onClick={() => deleteProject()}
                  >
                    Delete
                  </button>
                )} */}

                <button
                  type='button'
                  disabled={isSubmitting}
                  onClick={() => {
                    refetch();
                    setAddProject(false);
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
