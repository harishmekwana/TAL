// import { Role } from './role';
import { Rating } from './rating';
import { Occupation } from './occupation';
import { Factor } from './factor';



export class User {
    id!: string;
    title!: string;
    firstName!: string;
    lastName!: string;   
    email!: string;
    dob!: string;  
    occupation!: Occupation;
    rating!: Rating;  
    factor! :Factor;
    sumInsured!:string;
    monthlyPremium!:string;
    isDeleting: boolean = false;
}