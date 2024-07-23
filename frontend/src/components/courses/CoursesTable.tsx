import { Dispatch, SetStateAction, useState } from 'react';
import { AlertTriangle, Heart, Loader, Star, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import Course from '../../models/course/Course';
import UpdateCourseRequest from '../../models/course/UpdateCourseRequest';
import courseService from '../../services/CourseService';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';
import Pagination from '../../models/shared/pagination';
import useFavoriteCourses from '../../hooks/useFavoriteCourses';
import { Rating } from '@mui/material';

interface UsersTableProps {
  total: number;
  pagination: Pagination;
  onChangePagination: Dispatch<SetStateAction<Pagination>>;
  data: Course[];
  isLoading: boolean;
  refetch: () => void;
}

export default function CoursesTable({
  data,
  isLoading,
  refetch,
  pagination,
  total,
  onChangePagination,
}: UsersTableProps) {
  const { authenticatedUser } = useAuth();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateCourseRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await courseService.delete(selectedCourseId);
      setDeleteShow(false);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
      refetch();
    }
  };

  const handleUpdate = async (updateCourseRequest: UpdateCourseRequest) => {
    try {
      await courseService.update(selectedCourseId, updateCourseRequest);
      setUpdateShow(false);
      reset();
      setError(null);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  const {
    favoriteCourses,
    changeFavoriteCourse,
    isLoading: isFavCoursesLoading,
  } = useFavoriteCourses();
  return (
    <>
      <div className="table-container">
        <Table
          total={total}
          orderColumns={['name', 'description', 'dateCreated']}
          columns={['name', 'description', 'dateCreated', 'rating', 'fav']}
          pagination={pagination}
          onChangePagination={onChangePagination}
        >
          {isLoading
            ? null
            : data.map(
                ({
                  id,
                  name,
                  description,
                  dateCreated,
                  imageUrl,
                  contactEmail,
                  rates,
                }) => (
                  <tr key={id}>
                    <TableItem>
                      <Link to={`/courses/${id}`}>{name}</Link>
                    </TableItem>
                    <TableItem>{description}</TableItem>
                    <TableItem>
                      {new Date(dateCreated).toLocaleDateString()}
                    </TableItem>
                    <TableItem>
                      {
                        <Rating
                          precision={0.5}
                          readOnly
                          value={
                            rates.reduce((acc, curr) => acc + curr.rating, 0) /
                            (rates.length || 1)
                          }
                        />
                      }
                      {}
                    </TableItem>
                    <TableItem>
                      {!isFavCoursesLoading && (
                        <Heart
                          className="cursor-pointer"
                          onClick={() => changeFavoriteCourse(id)}
                          fill={
                            favoriteCourses.find((course) => course.id === id)
                              ? 'red'
                              : 'none'
                          }
                          stroke={
                            favoriteCourses.find((course) => course.id === id)
                              ? 'red'
                              : 'black'
                          }
                        />
                      )}
                    </TableItem>
                    <TableItem className="text-right">
                      {['admin', 'editor'].includes(authenticatedUser.role) ? (
                        <button
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                          onClick={() => {
                            setSelectedCourseId(id);

                            setValue('name', name);
                            setValue('description', description);
                            setValue('imageUrl', imageUrl);
                            setValue('contactEmail', contactEmail);

                            setUpdateShow(true);
                          }}
                        >
                          Edit
                        </button>
                      ) : null}
                      {authenticatedUser.role === 'admin' ? (
                        <button
                          className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                          onClick={() => {
                            setSelectedCourseId(id);
                            setDeleteShow(true);
                          }}
                        >
                          Delete
                        </button>
                      ) : null}
                    </TableItem>
                  </tr>
                ),
              )}
        </Table>
        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>Empty</h1>
          </div>
        ) : null}
      </div>
      {/* Delete Course Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">Delete Course</h3>
          <hr />
          <p className="mt-2">
            Are you sure you want to delete the course? All of course's data
            will be permanently removed.
            <br />
            This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end mt-5">
          <button
            className="btn"
            onClick={() => {
              setError(null);
              setDeleteShow(false);
            }}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        ) : null}
      </Modal>
      {/* Update Course Modal */}
      <Modal show={updateShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Update Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              setUpdateShow(false);
              setError(null);
              reset();
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(handleUpdate)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            required
            disabled={isSubmitting}
            {...register('description')}
          />
          <input
            type="text"
            className="input"
            placeholder="Contact email"
            required
            disabled={isSubmitting}
            {...register('contactEmail')}
          />
          <input
            type="text"
            className="input"
            placeholder="Image URL"
            required
            disabled={isSubmitting}
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
    </>
  );
}
