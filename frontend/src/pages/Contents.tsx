import { useState } from 'react';
import { BookOpen, Loader, Mail, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import Rating from '@mui/material/Rating';
import ContentsTable from '../components/content/ContentsTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import CreateContentRequest from '../models/content/CreateContentRequest';
import contentService from '../services/ContentService';
import courseService from '../services/CourseService';
import { ContactModal } from '../components/content/ContactModal';
import { useCourse } from '../hooks/useCourse';
import CourseService from '../services/CourseService';
import UsersTable from '../components/users/UsersTable';

export default function Course() {
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useAuth();
  const {
    data: dataRate,
    isLoading: isLoadingRate,
    refetch: refetchRate,
  } = useQuery([`rate-${authenticatedUser.id}-${id}`], () =>
    CourseService.getRate(id),
  );
  const courseRate = (!isLoadingRate && dataRate.data.rating) || 0;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [addContentShow, setAddContentShow] = useState<boolean>(false);
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const userQuery = useQuery('user', async () => courseService.findOne(id));

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateContentRequest>();

  const { data, isLoading } = useQuery(
    [`contents-${id}`, name, description],
    async () =>
      contentService.findAll(id, {
        name: name || undefined,
        description: description || undefined,
      }),
    {
      refetchInterval: 1000,
    },
  );
  const { course, refetch, isLoading: isLoadingCourse } = useCourse(id);
  const isUserEnrolled =
    !isLoadingCourse &&
    course.students.map((course) => course.id).includes(authenticatedUser.id);
  const saveCourse = async (createContentRequest: CreateContentRequest) => {
    try {
      await contentService.save(id, createContentRequest);
      setAddContentShow(false);
      reset();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout
      title={!userQuery.isLoading ? `${userQuery.data.name} Contents` : ''}
    >
      {authenticatedUser.role !== 'user' ? (
        <button
          className="btn my-5 flex gap-2 w-full sm:w-auto justify-center"
          onClick={() => setAddContentShow(true)}
        >
          <Plus /> Add Content
        </button>
      ) : null}
      <div className="flex flex-row justify-between mb-10 mt-4">
        <div className="mr-auto flex flex-row">
          <button
            className="btn text-lg font-light flex gap-5"
            onClick={() => setShowContactForm(true)}
          >
            <Mail />
            Contact to email
          </button>
          <Rating
            className="self-center ml-10"
            value={courseRate}
            max={5}
            onChange={async (e: any) => {
              await CourseService.rate(id, e.target.value);
              refetchRate();
            }}
            size={'large'}
          />
        </div>
        <button
          className={
            'btn text-lg font-light flex gap-5 ' +
            (!isUserEnrolled ? 'bg-blue-500 hover:bg-blue-700' : '')
          }
          onClick={async () => {
            await CourseService.changeEnroll(id);
            refetch();
          }}
        >
          <BookOpen />
          {isUserEnrolled ? 'Unenroll' : 'Enroll'}
        </button>
      </div>
      <div className="table-filter flex-col">
        <h2 className="flex flex-row font-medium text-xl">Filter contents</h2>
        <div className="flex flex-row gap-5 w-1/2">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <ContentsTable data={data} isLoading={isLoading} courseId={id} />
      {authenticatedUser.role === 'admin' && (
        <>
          <h2 className="text-2xl my-10">Enrolled users:</h2>
          <UsersTable data={course?.students} isLoading={isLoadingCourse} />
        </>
      )}
      {/* Add User Modal */}
      <Modal show={addContentShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Content</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddContentShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>

      <ContactModal
        courseId={id}
        show={showContactForm}
        setShow={setShowContactForm}
      />
    </Layout>
  );
}
