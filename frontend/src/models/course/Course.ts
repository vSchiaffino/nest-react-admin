import User from '../user/User';

export default interface Course {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  contactEmail: string;
  rates: {
    rating: number;
    userId: string;
    courseId: string;
  }[];
  dateCreated: Date;
  students: User[];
}
