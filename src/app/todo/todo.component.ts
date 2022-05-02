import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  title:any;
  description:any;
  constructor(public dialogRef: MatDialogRef<TodoComponent>) { }

  ngOnInit(): void {
  }

  OnCancel() {
    this.dialogRef.close();
  }
  create() {
    this.dialogRef.close({title: this.title, description: this.description});
  }
}
