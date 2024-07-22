import { useForm } from 'react-hook-form';
import Modal from '../shared/Modal';
import { Loader, X } from 'react-feather';
import { useState } from 'react';
import { SendContactRequest } from '../../models/course/SendContactRequest';
import CourseService from '../../services/CourseService';

export interface ContactModalProps {
  courseId: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContactModal = ({
  courseId,
  show,
  setShow,
}: ContactModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<SendContactRequest>();

  const [error, setError] = useState('');
  return (
    <Modal show={show}>
      <div className="flex">
        <h1 className="font-semibold mb-3">Contact form</h1>
        <button
          className="ml-auto focus:outline-none"
          onClick={() => {
            reset();
            setShow(false);
          }}
        >
          <X size={30} />
        </button>
      </div>
      <hr />

      <form
        className="flex flex-col gap-5 mt-5"
        onSubmit={handleSubmit(async (request) => {
          try {
            await CourseService.contact(courseId, request);
            setShow(false);
            reset();
          } catch (error) {
            setError(error.response.data.message);
          }
        })}
      >
        <input
          type="text"
          className="input"
          placeholder="Email title"
          disabled={isSubmitting}
          required
          {...register('title')}
        />
        <textarea
          className="input h-40 max-h-96"
          placeholder="Email message"
          disabled={isSubmitting}
          required
          {...register('message')}
        />
        <button className="btn" disabled={isSubmitting}>
          {isSubmitting ? <Loader className="animate-spin mx-auto" /> : 'Save'}
        </button>
        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        ) : null}
      </form>
    </Modal>
  );
};
