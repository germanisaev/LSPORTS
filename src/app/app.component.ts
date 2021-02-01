import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Book } from './shared/models/book.model';
import { BookService } from './shared/services/book.service';

export class FileUplodVM {
  ImageBaseData: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  bookForm: FormGroup;
  books: Book[] = [];
  bookEdit: Book;
  searchBook: string = '';
  submitted: boolean = false;
  ImageBaseData: string | ArrayBuffer = null;
  isUpdate: boolean = true;

  constructor(
    private formBuilder: FormBuilder, 
    private bookService: BookService, 
    private act: ActivatedRoute,) {
      this.ImageBaseData = '../assets/images/book-icon.png';
      this.isUpdate = false;
    }

  ngOnInit() {
    this.createForm();
    this.getBooks();
  }

  createForm() {
    this.bookForm = this.formBuilder.group({
      AuthorName: ['', Validators.required],
      BookName: ['', Validators.required],
      PublicationDate: [moment().format('DD/MM/YYYY').toString(), Validators.required],
      CoverPhoto: ['', Validators.required],
      CatalogNumber: ['', Validators.required],
    });
  }

  get f() { return this.bookForm.controls; }

  onSubmit() {
    console.log(this.bookForm.value);

    this.submitted = false;

    // stop here if form is invalid
    if (this.bookForm.invalid) {
      return;
    }
    /*
    this.bookForm.patchValue({
      CoverPhoto: this.ImageBaseData.toString()
    });
    debugger;
    */
    if (!this.isUpdate) {
      this.bookService.createBook(this.bookForm.value).subscribe(res => {
        console.log(res);
        this.getBooks();
        this.bookForm.reset();
      });
    }
    else {
      this.updateBook();
    }
    
  };

  getBooks() {
    this.bookService.getBookList().subscribe(data => this.books = data);
  }

  removeBook(id) {
    var result = confirm("Are you sure you want to delete this record?");
    if (result) {
      this.bookService.deleteBook(id).subscribe(res => {
        this.books = this.books.filter(book => book.id !== id);
        console.log(res);
      });
    }
  }

  updateBook() {
    this.bookService.updateBook(this.bookForm.value, this.bookEdit.id).subscribe(res => {
      console.log(res);
      this.getBooks();
    });
  }

  editBook(id) {
    this.bookService.getBookBy(id).subscribe(data => {
      console.log(data);
      this.bookEdit = data;
      this.bookForm.patchValue({
        AuthorName: data.AuthorName,
        BookName: data.BookName,
        PublicationDate: data.PublicationDate,
        //CoverPhoto: data.CoverPhoto,
        CatalogNumber: data.CatalogNumber,
      });
      this.isUpdate = true;
      console.log('Edit Book');
      this.submitted = false;
    });
  }

  AddBook() {
    console.log('Add Book');
    this.bookForm.reset();
    this.submitted = false;
    this.isUpdate = false;
  }

  handleFileInput(files: FileList) {
    let me = this;
    let file = files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      me.ImageBaseData = reader.result; 
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
  
}
