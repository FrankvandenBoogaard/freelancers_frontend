import { useNavigate, useParams } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import * as Yup from 'yup';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TASK_MUTATION_CREATE = gql`
  mutation CreateTask($data: TaskInput!) {
    createTask(data: $data) {
      data {
        id
      }
    }
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PanelProjectTaskAdd({ refetch, setAddTask }) {
  const params = useParams();
  const projectId = params.id;
  const navigate = useNavigate();

  // form validation rules
  const validationSchema = Yup.object().shape({
    taskName: Yup.string().required('Task name is required'),
    taskStart: Yup.date()
      .typeError('Date is required')
      .required('Date is required'),
    taskFinish: Yup.date()
      .typeError('Date is required')
      .min(Yup.ref('taskStart'), "End date can't be before start date")
      .required('Date is required'),
    taskPurchase: Yup.number().required('Purchase amount is required'),
    taskSale: Yup.number().required('Sale amount is required'),
    taskDescription: Yup.string(),
  });

  const [mutateTaskCreate] = useMutation(TASK_MUTATION_CREATE);

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
    return mutateTaskCreate({
      variables: {
        data: {
          ...data,
          project: projectId, // aangeven aan welk project moet worden gekoppeld
        },
      },
    }).then(() => {
      refetch();
      setAddTask(false);
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
                {updateMode ? 'Add Task' : 'Task'}
              </h3> */}
              {/* <p className='mt-1 text-xs text-gray-500'>
                Created:{' '}
                {data?.task.data.attributes.createdAt
                  ? `${new Date(
                      data?.task.data.attributes.createdAt
                    ).toLocaleString(undefined, {
                      hour12: false,
                    })}`
                  : 'to be determined'}{' '}
                | Updated:{' '}
                {data?.task.data.attributes.updatedAt
                  ? `${new Date(
                      data?.task.data.attributes.updatedAt
                    ).toLocaleString(undefined, {
                      hour12: false,
                    })}`
                  : 'to be determined'}
              </p> */}
            </div>
            <div className='mt-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6'>
              <div className='col-span-6 sm:col-span-5'>
                <label
                  htmlFor='task-name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Task name*
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    {...register('taskName')}
                    //defaultValue={data?.task.data.attributes.taskName}
                    className={classNames(
                      errors.taskName
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.taskName && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='taskName-error'>
                  {errors.taskName?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='task-start'
                  className='block text-sm font-medium text-gray-700'
                >
                  Task start*
                </label>
                <div className='mt-1 relative'>
                  <Controller
                    control={control}
                    name='taskStart'
                    render={({ field }) => (
                      <ReactDatePicker
                        className={classNames(
                          errors.taskStart
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
                  {errors.taskStart && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='taskStart-error'>
                  {errors.taskStart?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='task-finish'
                  className='block text-sm font-medium text-gray-700'
                >
                  Task finish
                </label>
                <div className='mt-1 relative'>
                  <Controller
                    control={control}
                    name='taskFinish'
                    render={({ field }) => (
                      <ReactDatePicker
                        className={classNames(
                          errors.taskFinish
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
                  {errors.taskFinish && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='taskFinish-error'>
                  {errors.taskFinish?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='task-purchase'
                  className='block text-sm font-medium text-gray-700'
                >
                  Purchase
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    inputMode='numeric'
                    {...register('taskPurchase')}
                    //defaultValue={data?.task.data.attributes.taskPurchase}
                    className={classNames(
                      errors.taskPurchase
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.taskPurchase && (
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
                  id='taskPurchase-error'
                >
                  {errors.taskPurchase?.message}
                </p>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='task-sales'
                  className='block text-sm font-medium text-gray-700'
                >
                  Sale
                </label>
                <div className='mt-1 relative'>
                  <input
                    type='text'
                    inputMode='numeric'
                    {...register('taskSale')}
                    //defaultValue={data?.task.data.attributes.taskSale}
                    className={classNames(
                      errors.taskSale
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.taskSale && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <ExclamationCircleIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-red-600' id='taskSale-error'>
                  {errors.taskSale?.message}
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
                    {...register('taskDescription')}
                    // defaultValue={
                    //   data?.task.data.attributes.taskDescription
                    // }
                    className={classNames(
                      errors.taskDescription
                        ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                      'block w-full sm:text-sm rounded-md'
                    )}
                  />
                  {errors.taskDescription && (
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
                  id='taskDescription-error'
                >
                  {errors.taskDescription?.message}
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
                    onClick={() => deleteTask()}
                  >
                    Delete
                  </button>
                )} */}

                <button
                  type='button'
                  disabled={isSubmitting}
                  onClick={() => {
                    refetch();
                    setAddTask(false);
                  }}
                  className='ml-2 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Cancel
                </button>
                <button
                  type='button' // prevents 'Enter-key' from submitting form
                  disabled={!isDirty || isSubmitting}
                  onClick={handleSubmit(onSubmit)} // prevents 'Enter-key' from submitting form
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
