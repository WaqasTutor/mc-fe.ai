import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToolInterface, ToolUpdateInterface } from './tool.interface';
import { MessageInterface } from '../common.interface';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  public ToolsSubject: BehaviorSubject<ToolInterface[]> = new BehaviorSubject<ToolInterface[]>(null);
  public ToolsObservable: Observable<ToolInterface[]> =this.ToolsSubject.asObservable();
  constructor(private http: HttpClient) { }
  list(): Observable<ToolInterface[]> {
    return this.http.get<ToolInterface[]>(environment.apiUrls.tool.list).pipe(
      tap(
      (res) => {
        this.ToolsSubject.next(res);
      }
    ));
  }
  detail(uuid: string): Observable<ToolInterface> {
    return this.http.get<ToolInterface>(environment.apiUrls.tool.details + uuid);
  }
  update(data: ToolUpdateInterface, uuid: string): Observable<MessageInterface> {
    return this.http.post<MessageInterface>(environment.apiUrls.tool.details + uuid + '/favourite', data)
  }
  requestTool(data: {request: string;}) {
    return this.http.post<MessageInterface>(environment.apiUrls.tool.request, data);
  }
  updateObservable(tools: ToolInterface[]) {
    this.ToolsSubject.next(tools)
  }
}
