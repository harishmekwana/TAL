import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import {OccupationClass} from '@app/_models/OccupationClass'
import { TitleClass } from '@app/_models/TitleClass';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CurrencyPipe } from '@angular/common';


@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;   
    selecteOccupationID:Number=0;
    sumInsured:number=0;
    monthlyPremium:Number=0; 
    age:number=0;

public maxDate: Object =  new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());


    occupations:OccupationClass[]=[
        {
            "occupationID":0,
            "description":"Select",
            "factor":1.5
        },
     
        {
            "occupationID":1,
            "description":"Cleaner",
            "factor":1.5
        },
        {
            "occupationID":2,
            "description":"Doctor",
            "factor":1.0
        },
        {
            "occupationID":3,
            "description":"Author",
            "factor":1.25        
        } ,
        {
            "occupationID":4,
            "description":"Farmer",
            "factor":1.75
        },
        {
            "occupationID":5,
            "description":"Mechanic",
            "factor":1.75
        },
        {
            "occupationID":6,
            "description":"Florist",
            "factor":1.5
        }
    ];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService
        

    ) {}



    ngOnInit() {   
        this.age=0;     
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // // password not required in edit mode
        // const passwordValidators = [Validators.minLength(6)];
        // if (this.isAddMode) {
        //     passwordValidators.push(Validators.required);
        // }

        // const formOptions: AbstractControlOptions = { validators: MustMatch('password', 'confirmPassword') };
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', [Validators.required]] ,   
            lastName: ['', [Validators.required]] ,   
            age: ['', [Validators.required, Validators.pattern("^[0-9]*$")]] ,   
            email: ['', [Validators.required, Validators.email]],
            // factor: ['', Validators.required],            
            dob: ['', Validators.required],   
            occupation: ['', Validators.required],   
            // rating: ['', Validators.required],   
            deathInsured:['', [Validators.required, Validators.pattern("^[0-9]*$")]] ,   
            mPremium: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        });

        if (!this.isAddMode) {
            this.userService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }

    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        this.userService.create(this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Claims added', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }

    private updateUser() {
        this.userService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Claims updated', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }
    

    //event handler for the select element's change event
    getSelected (event: any) {
    //update the ui
    this.selecteOccupationID = event.target.value;
    this.CalculateMonthlyPremium(Number(this.sumInsured),Number(this.selecteOccupationID),this.age)
  }

  valueCheck(args: any) {       
    this.age =(new Date()).getFullYear()-(new Date(args)).getFullYear()  ;    
      this.CalculateMonthlyPremium(Number(this.sumInsured),Number(this.selecteOccupationID),this.age)
  } 

  onBlurEvent(event: any){
      this.CalculateMonthlyPremium(Number(this.sumInsured),Number(this.selecteOccupationID),this.age)      
   }  

     
onKeypressEvent(event: any){
console.log(event.target.value);
var charCode = (event.which) ? event.which : event.keyCode;
if ((charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
    } 
    else {
            
    this.CalculateMonthlyPremium(Number(this.sumInsured),Number(this.selecteOccupationID),this.age)
    return true;
    }
}



CalculateMonthlyPremium(_sumInsured:Number, _factor:number,_age:number) {
    this.monthlyPremium=(Number(_sumInsured)*Number(_factor)*Number(_age))/1000*12

}





/*hardcoding ddl values */

titles:TitleClass[]=[
    {
        "titleID":1,
        "desciption":"MR"        
    },
    {
        "titleID":2,
        "desciption":"Mrs"        
    },
    {
        "titleID":3,
        "desciption":"Miss"        
    },
    {
        "titleID":2,
        "desciption":"Ms"        
    },
]



}