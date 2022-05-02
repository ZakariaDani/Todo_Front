import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  registerUser(registerForm: NgForm) {
    if (registerForm.invalid) {
      return;
    }
    const { username, password } = registerForm.value;
    this.apiService.register(username, password);
    registerForm.reset();
  }
}
