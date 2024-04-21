import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  form: FormGroup;
  apiUrl: string;


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { 
    this.apiUrl = environment.apiEndpoint
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
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
    this.http.post(this.apiUrl + 'sign-up', user, {
      withCredentials: true
    }).subscribe(
      response => {
        // Handle successful response
        Swal.fire('Success', 'User registered successfully', 'success');
        // Optionally navigate to another route
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error);

        // Handle error response
        Swal.fire('Error', error.error.message + " " + error.error.error, 'error');
      }
    );
  }
}
