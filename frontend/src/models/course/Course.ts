import User from '../user/User';

export default interface Course {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  contactEmail: string;
  dateCreated: Date;
  students: User[];
}
