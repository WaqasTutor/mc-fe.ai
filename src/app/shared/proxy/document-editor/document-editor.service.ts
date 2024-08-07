import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../services/authentication.service';
import { DocumentInterface, WriteForMe } from './document-editor.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentEditorService {
  selected: string;

  writeForMe(data: WriteForMe): Observable<any> {
    return this.http.post<any>(environment.apiUrls.content.writeForMe, data);
  }

  createDocument(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrls.document.create, data);
  }

  getDocument(uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrls.document.list}${uuid}`);
  }

  getDocuments(uuid: string): Observable<any> {
    let requestOptions = {                                                                                                                                                                                 
      params: {'project-uuid': uuid}
    };
    return this.http.get<any>(
      `${environment.apiUrls.document.list}`,
      requestOptions
    );
  }

  trash(): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrls.document.trash);
  }

  updateDocument(data): Observable<any> {
    return this.http.put<any>(
      `${environment.apiUrls.document.update}${data.uuid}`,
      data
    );
  }

  permanentDeleteDocument(data): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrls.document.update}${data.uuid}`,
      data
    );
  }

  deleteDocument(data: DocumentInterface): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrls.document.update}${data.uuid}`
    );
  }

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}
}
