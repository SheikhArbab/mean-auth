import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Emitters } from 'src/app/emitters/emitter';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  apiUrl: string;
  message:string = '';

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiEndpoint
  }

  ngOnInit(): void {
    this.http.get(this.apiUrl + "get/user", { withCredentials: true })
    .subscribe((res:any) => { 
      this.message = `aoa ${res.user.name}`
      Emitters.authEmitter.emit(true)
    },(err)=>{
      Emitters.authEmitter.emit(false)
    })
  }

}
