// import { Role } from './role';
import { Rating } from './rating';
import { Occupation } from './occupation';

export class User {
    id!: string;
    title!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    occupation!: Occupation;
    rating!: Rating;    
    isDeleting: boolean = false;
}