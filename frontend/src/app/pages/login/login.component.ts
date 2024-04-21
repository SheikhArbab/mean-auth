import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  apiUrl:string;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.apiUrl = environment.apiEndpoint
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({ 
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    // Check if form is valid
    if (this.form.invalid) {
      // If form is invalid, display an error alert using Swal
      Swal.fire('Error', 'Please fill all fields correctly', 'error');
      return;
    }

    // If form is valid, proceed with form submission
    const user = this.form.value; 

    // Send form data to the server
    this.http.post(this.apiUrl+"login", user,{
      withCredentials:true
    }).subscribe(
      (res:any) => { 
        // Handle successful response
        Swal.fire('Success', res && res?.message, 'success');
        // Optionally navigate to another route
        this.router.navigate(['/']);
      },
      error => { 
        // Handle error response
        Swal.fire('Error', error.error.message +" "+error.error.error, 'error');
      }
    );
  }
}
