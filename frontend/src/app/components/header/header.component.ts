import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/emitters/emitter';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn:boolean = false;

  apiUrl:string = environment.apiEndpoint

  constructor(private http : HttpClient, private router : Router) { }

  ngOnInit(): void {

    Emitters.authEmitter.subscribe((auth:boolean)=> {
      this.isLoggedIn = auth
    })

  }


  logOut(): void { 
    // Make a request to the logout API endpoint
    this.http.post(this.apiUrl+'logout', {}).subscribe(
      res => {
        console.log(res);
        
        // Emitting false to indicate user is logged out
        Emitters.authEmitter.emit(false);
        // Redirecting to the login page or home page
        this.router.navigate(['/login']);
      },
      (error) => {
        // Handle any errors during logout
        console.error('Error during logout:', error);
      }
    );
  }
}
