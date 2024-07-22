import { useState } from 'react';
import { Loader, Plus, RefreshCcw, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';
import useCourses from '../hooks/useCourses';
import Pagination from '../models/shared/pagination';

export default function Courses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    perPage: 10,
    orderBy: 'name',
    orderDirection: 'ASC',
  });
  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { authenticatedUser } = useAuth();
  const { courses, total, isLoading, refetch } = useCourses(
    name,
    description,
    pagination,
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      await courseService.save(createCourseRequest);
      setAddCourseShow(false);
      reset();
      setError(null);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout title={'Manage courses'}>
      {authenticatedUser.role !== 'user' ? (
        <button
          className="btn my-5 flex gap-2 w-full sm:w-auto justify-center"
          onClick={() => setAddCourseShow(true)}
        >
          <Plus /> Add Course
        </button>
      ) : null}

      <div className="table-filter">
        <div className="flex flex-row gap-5">
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
          <button
            className="btn bg-blue-500 hover:bg-blue-600 flex gap-2"
            onClick={() => refetch()}
          >
            <RefreshCcw size={20} /> Refresh
          </button>
        </div>
      </div>

      <CoursesTable
        pagination={pagination}
        onChangePagination={setPagination}
        total={total}
        data={courses}
        isLoading={isLoading}
        refetch={() => refetch()}
      />

      {/* Add User Modal */}
      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              refetch();
              setAddCourseShow(false);
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
          <input
            type="text"
            className="input"
            placeholder="Contact email"
            disabled={isSubmitting}
            required
            {...register('contactEmail')}
          />
          <input
            type="text"
            className="input"
            placeholder="Image URL"
            disabled={isSubmitting}
            required
            {...register('imageUrl')}
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
    </Layout>
  );
}
