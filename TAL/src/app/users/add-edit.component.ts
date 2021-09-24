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

    occupations:OccupationClass[]=[
        {
            "occupationID":0,
            "desciption":"Select",
            "factor":1.5
        },
     
        {
            "occupationID":1,
            "desciption":"Cleaner",
            "factor":1.5
        },
        {
            "occupationID":2,
            "desciption":"Doctor",
            "factor":1.0
        },
        {
            "occupationID":3,
            "desciption":"Author",
            "factor":1.25        
        } ,
        {
            "occupationID":4,
            "desciption":"Farmer",
            "factor":1.75
        },
        {
            "occupationID":5,
            "desciption":"Mechanic",
            "factor":1.75
        },
        {
            "occupationID":6,
            "desciption":"Florist",
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
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        const formOptions: AbstractControlOptions = { validators: MustMatch('password', 'confirmPassword') };
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
            password:['', [Validators.required, Validators.pattern("^[0-9]*$")]] ,   
            confirmPassword: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        }, formOptions);

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

//  onKeyUpEvent(event: any){
//     console.log(event.target.value);
//     var charCode = (event.which) ? event.which : event.keyCode;
//     if ((charCode < 48 || charCode > 57)) {
//         event.preventDefault();
//         return false;
//       } 
//      else {
//          console.log("sumInsured"+this.sumInsured)
//         this.monthlyPremium=(Number(event.target.value)*(Number(this.selecteOccupationID))*this.age)/1000 * 12
//        return true;
//       }
//  }



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