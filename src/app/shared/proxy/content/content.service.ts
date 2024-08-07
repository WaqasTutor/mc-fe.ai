import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ContentInputInterface, ContentInterface, ContentUpdateInputInterface } from './content.interface';
import { MessageInterface } from '../common.interface';
import { userService } from '../user/user.service'
@Injectable({
  providedIn: 'root',
})
export class ContentService {
  auth;
  constructor(private http: HttpClient, private userService: userService) {
    this.userService.currentAuth.subscribe(auth => this.auth = auth)
  }
  list(input: any): Observable<ContentInterface[]> {
    return this.http.get<ContentInterface[]>(environment.apiUrls.content.list, {
      params: {
        "tools-uuid": input.toolId,
        "project-uuid": input.projectId
      }
    });
  }
  fullList(input: any): Observable<ContentInterface[]> {
    return this.http.get<ContentInterface[]>(environment.apiUrls.content.list, {
      params: input
    });
  }
  detail(uuid: string): Observable<ContentInterface> {
    return this.http.get<ContentInterface>(environment.apiUrls.content.details + uuid);
  }
  create(data: ContentInputInterface): Observable<ContentInterface[]> {
    return this.http.post<ContentInterface[]>(environment.apiUrls.content.create, data);
  }
  update(data: ContentUpdateInputInterface, uuid): Observable<MessageInterface> {
      return this.http.put<MessageInterface>(environment.apiUrls.content.update + uuid, data);
  }
  trash() : Observable<ContentInterface[]> {
    return this.http.get<ContentInterface[]>(environment.apiUrls.content.trash);
  }
  search(search_query: string) {
    return this.http.post<any>(environment.apiUrls.content.search, {search_query})
  }
}
