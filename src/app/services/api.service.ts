import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private token = '';
  private jwtToken$ = new BehaviorSubject<string>(this.token);
  private API_URL = 'http://localhost:3000/api';
  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {
    const fetchedToken = localStorage.getItem('act');
    if (fetchedToken) {
      this.token = atob(fetchedToken);
      this.jwtToken$.next(this.token);
    }
  }

  get jwtUserToken(): Observable<string> {
    return this.jwtToken$.asObservable();
  }

  getAllTodos(): Observable<any> {
    return this.http.get(`${this.API_URL}/todos`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  login(username: string, password: string) {
    this.http
      .post(`${this.API_URL}/auth/login`, { username, password })

      .subscribe(
        //@ts-ignore
        (res: { token: string }) => {
          this.token = res.token;
          if (this.token) {
            this.toast
              .success('Login successful, Working on it...', '', {
                timeOut: 700,
                positionClass: 'toast-top-center',
              })
              .onHidden.subscribe(() => {
                this.jwtToken$.next(this.token);
                localStorage.setItem('act', btoa(this.token));
                this.router.navigateByUrl('/').then();
              });
          }
        },
        (err: HttpErrorResponse) => {
          this.toast.error('Authentification failed!', '', { timeOut: 1000 });
        }
      );
  }

  register(username: string, password: string) {
    return this.http
      .post(`${this.API_URL}/auth/register`, 
      { username, password },
      )
      .subscribe(() => {
        this.toast
          .success('Register successful, please logIn...', '', {
            timeOut: 700,
            positionClass: 'toast-top-center',
          })
          .onHidden.subscribe(() => {
            this.router.navigateByUrl('/').then();
          });
      }, () => {
        this.toast.error('User already exists !', '', {timeOut: 1000})
      });
  }

  logout() {
    this.token = '';
    this.jwtToken$.next(this.token);
    this.toast
      .success('logged out successfully', '', { timeOut: 500 })
      .onHidden.subscribe(() => {
        localStorage.removeItem('act');
        this.router.navigateByUrl('/login').then();
      });
    return '';
  }

  createTodo(title: string, description: string) {
    return this.http.post(
      `${this.API_URL}/todos`,
      { title, description },
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  updateStatus(statusValue: string, todoId: number) {
    return this.http
      .patch(
        `${this.API_URL}/todos/${todoId}`,
        { status: statusValue },
        { headers: { Authorization: `Bearer ${this.token}` } }
      )
      .pipe(
        tap((res) => {
          if (res) {
            this.toast.success('status updated successfully', '', {
              timeOut: 1000,
            });
          }
        })
      );
  }
  deleteTodo(todoId: number) {
    return this.http
      .delete(`${this.API_URL}/todos/${todoId}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .pipe(
        tap((res) => {
          //@ts-ignore
          if (res.sucsess) {
            this.toast.success('todo deleted successfully');
          }
        })
      );
  }
}
