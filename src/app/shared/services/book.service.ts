import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book } from '../models/book.model';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    apiUrl: string = 'http://localhost:3000';

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) { }

    getBookBy(id: any): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/books/${id}`)
            .pipe(
                catchError(this.errorHandler)
            );
    }

    getBookList(): Observable<Book[]> {
        return this.http.get<Book[]>(`${this.apiUrl}/books`)
            .pipe(
                catchError(this.errorHandler)
            );
    }

    createBook(book: any): Observable<Book> {
        return this.http.post<Book>(`${this.apiUrl}/books/`, JSON.stringify(book), this.httpOptions)
            .pipe(
                catchError(this.errorHandler)
            );
    }

    deleteBook(id: any) {
        return this.http.delete(`${this.apiUrl}/books/${id}`, this.httpOptions)
            .pipe(
                catchError(this.errorHandler)
            );
    }

    updateBook(book: any, id: any) {
        return this.http.put(`${this.apiUrl}/books/${id}`, JSON.stringify(book), this.httpOptions)
            .pipe(
                catchError(this.errorHandler)
            );
    }

    errorHandler(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
}