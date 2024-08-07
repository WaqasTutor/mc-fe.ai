
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectInterface, ProjectInput, ProjectMessage } from './project.interface';
import { MessageInterface } from './../common.interface';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  public showModalSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showModalObservable: Observable<boolean> = this.showModalSubject.asObservable();
  public showEditModalSubject: BehaviorSubject<ProjectInterface> = new BehaviorSubject<ProjectInterface>(null);
  public showEditModalObservable: Observable<ProjectInterface> =this.showEditModalSubject.asObservable();
  public showDrawerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showDrawerObservable: Observable<boolean> =this.showDrawerSubject.asObservable();
  private projectsSubject: BehaviorSubject<ProjectInterface[]>;
  public projectsObservable: Observable<ProjectInterface[]>;
  public projectSelectedSubject: BehaviorSubject<ProjectInterface> = new BehaviorSubject<ProjectInterface>(null);
  public projectSelectedObservable: Observable<ProjectInterface> = this.projectSelectedSubject.asObservable();
  constructor(private http: HttpClient) {
    this.projectsSubject = new BehaviorSubject<ProjectInterface[]>([]);
    this.projectsObservable = this.projectsSubject.asObservable();
  }

  list(): Observable<ProjectInterface[]> {
    return this.http.get<ProjectInterface[]>(environment.apiUrls.project.list).pipe(tap((res) => {
      if (localStorage.getItem('selectedProject')) {
        let selected = JSON.parse(localStorage.getItem('selectedProject'));
        for (let project of res) {
          if (project.uuid == selected.project) {
            project.selected = true;
            this.projectSelectedSubject.next(project);
          }
          else {
            project.selected = false;
          }
        }
        this.projectsSubject.next(res.sort(function (a, b) {
          var c = new Date(a.last_updated);
          var d = new Date(b.last_updated);
          return Number(d) - Number(c);
        }));
      }
      else {
        localStorage.setItem('selectedProject', JSON.stringify({ project: res[0].uuid }));
        this.projectsSubject.next(res);
        this.projectSelectedSubject.next(res[0]);
      }

    }))
  }
  details(uuid): Observable<ProjectInterface> {
    return this.http.get<ProjectInterface>(`${environment.apiUrls.project.list}${uuid}`).pipe(tap((res) => this.projectsSubject.next(this.projectsSubject.value.map(ele => ele.uuid == uuid ? res : ele))))
  }
  create(projectInput: ProjectInput): Observable<ProjectMessage> {
    return this.http.post<ProjectMessage>(`${environment.apiUrls.project.list}`, projectInput).pipe(tap(ele => {
      if (ele.data) {
        let temp = this.projectsSubject.value;
        temp.push(ele.data);
        this.projectsSubject.next(temp);
      }
    }))
  }
  update(projectInput: ProjectInput): Observable<MessageInterface> {
    return this.http.put<MessageInterface>(`${environment.apiUrls.project.list}${projectInput.uuid}`, projectInput).pipe(
      tap((res) => {
        this.projectsSubject.next(this.projectsSubject.value.map(ele => {
          if (ele.uuid == projectInput.uuid) {
            if (ele.selected) {
              this.projectSelectedSubject.next({ ...ele, ...projectInput });
            }
            return { ...ele, ...projectInput }
          }
          else {
            return ele;
          }
        }
        ))
      }
      ))
  }
  delete(uuid: string) {
    if (this.projectSelectedSubject.value.uuid === uuid) {
      this.selectDefaultProject()
    }
    return this.http.delete<MessageInterface>(`${environment.apiUrls.project.list}${uuid}`).pipe(tap(
      (res) => {
        this.projectsSubject.next(this.projectsSubject.value.filter(ele => ele.uuid !== uuid));
      }
    ))
  }
  selectProject(uuid) {
    this.projectsSubject.next(this.projectsSubject.value.map(ele => {
      if (ele.uuid == uuid) {
        ele.selected = true;
        localStorage.setItem('selectedProject', JSON.stringify({ project: uuid }));
        this.projectSelectedSubject.next(ele);
      }
      else {
        ele.selected = false;
      }
      return ele;
    }
    ));
  }
  selectDefaultProject() {
    this.projectsSubject.next(this.projectsSubject.value.map(ele => {
      if (ele.default == '1') {
        ele.selected = true;
        localStorage.setItem('selectedProject', JSON.stringify({ project: ele.uuid }));
        this.projectSelectedSubject.next(ele);
      }
      else {
        ele.selected = false;
      }
      return ele;
    }
    ));
  }
  showModal () {
    this.showModalSubject.next(true);
  }
  hideModal () {
    this.showModalSubject.next(false);
  }
  showDrawer () {
    this.showDrawerSubject.next(true);
  }
  hideDrawer () {
    this.showDrawerSubject.next(false);
  }
  showEditModal (project: ProjectInterface) {
    this.showEditModalSubject.next(project);
  }
  hideEditModal (project: ProjectInterface) {
    this.showEditModalSubject.next(project);
  }
  get selectedProject () {
    return this.projectSelectedSubject.value
  }
}
