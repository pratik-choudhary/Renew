import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ApiService {
	headers: Headers;
	options: RequestOptions;
	headers2: Headers;
	options2: RequestOptions;
	baseUrl: string;
	public site_id_for_dashboard: any;
	constructor(private http: Http, private router: Router) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('device-id', 'web');
		let options = new RequestOptions({ headers: headers });

		//this.baseUrl = 'http://192.168.1.36:50305/api/';
		//this.baseUrl  = 'http://14.142.130.140:443/hoto_be/api/';  //uat-db
		//this.baseUrl   = '/hoto_be/api/'; //runtime url do not change 
		//this.baseUrl = 'http://ec2-13-126-59-42.ap-south-1.compute.amazonaws.com/hoto/api/';
		//this.baseUrl = 'http://localhost:50305/api/';
		this.baseUrl = 'http://fleetmanager.mindnerves.com:11001/api/'
		//this.baseUrl ='https://mob.suzlon.com/hoto_be/api/';
	}

	getUserToken() {
		let headers2 = new Headers();
		let token = JSON.parse(localStorage.getItem('UserToken')).token;
		headers2.append('Content-Type', 'application/json');
		headers2.append('device-id', 'web');
		headers2.append('Authorization', 'bearer ' + token);
		let options2 = new RequestOptions({ headers: headers2 });
		return options2;
	}


	getUsersAuth(email: string, password: string) {
		let body = new URLSearchParams();
		body.set('username', email);
		body.set('password', password);
		body.set('grant_type', 'password');
		//return this.http.post(this.baseUrl + 'v1/login', body, this.options).map((res: Response) => res.json());
		return this.http.post(this.baseUrl +'Login/login', body, this.options).map((res: Response) => res.json());
	}
	getUserInfoById(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'master/user/' + id + '/info', options).map((res: Response) => res.json());
	}

	getChecklistsForIssueRegister(site_id:any)
	{
		let options = this.getUserToken();
		return this.http.get(this.baseUrl+'v1/register/checklists/'+site_id,options).map((res: Response) => res.json());
	}
	downloadIssueRegister(site_id:any)
	{
		return Observable.create(observer => {

			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			xhr.open('GET', this.baseUrl + 'v1/register/excel/'+site_id, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

			xhr.responseType = 'blob';

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {

						var contentType = 'application/*';
						var blob = new Blob([xhr.response], { type: contentType });
						observer.next(blob);
						observer.complete();
					} else {
						observer.error(xhr.response);
					}
				}
			}
			xhr.send();
		});

	}

	getModelsBySiteId(site_id:any)
	{
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/models/' + site_id, options).map((res: Response) => res.json());
	}

	DeleteExistingImagesOfReports(checklist_ins_id:any)
	{
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/reportdata/delete/images/' + checklist_ins_id, options).map((res: Response) => res.json());
	}
	getUserInformation(token: string) {
		let request = new XMLHttpRequest();
		request.open('GET', this.baseUrl +'master/user/get/info', false);  // `false` makes the request synchronous
		request.setRequestHeader('Authorization', 'bearer ' + token);
		request.setRequestHeader('device-id', 'web');
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		request.send(null);
		console.log(request);
		if (request.status === 200) {
			return request.responseText;
		} else {
			localStorage.clear();
			//this.auth_service.setUserInfo(undefined);
			this.router.navigate(['/session/signin']);
		}
		//return '{"team":[],"user_id":10032,"name":"Admin","firstName":null,"lastName":null,"department":"PMO","department_id":13,"role":"ADMIN","employee_id":null,"employeeId":null,"employeeName":null,"codeValue":null,"employeeEmail":"admin@mnt.com","status":null,"password":null}';
	}


	createMilestoneImport(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'milestone/copy', payload, options).map((res: Response) => res.json());
	}

	deleteChecklistInstance(checklist_ins_id: any) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'delete/checklist/instance/' + checklist_ins_id, options).map((res: Response) => res.json());
	}

	getSampleString(): string {
		return 'I am in Service';
	}
	upload(files: any, checklistId: number, CreatedBy: Number) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'upload/excel/' + checklistId + '/' + CreatedBy, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}

	uploadWTGExcel(files: any, model_id:any,dept_id:any) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/wtg/read/wtg/'+model_id+"/"+dept_id, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}

	uploadHeaderImage(files: any, checklistId: number) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/header/' + checklistId, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}

	uploadHeaderImageBySiteId(files: any, site_id:any,model_id:any,dept_id:any) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/header/' + site_id+'/'+model_id+'/'+dept_id, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}


	uploadIMICHeaderImageBySiteId(files: any, site_id:any,model_id:any,dept_id:any) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/header/imic/' + site_id+'/'+model_id+'/'+dept_id, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}


	uploadFirstPageImage(files: any, checklistId: number) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/firstpage/' + checklistId, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}

	uploadFirstPageImageBySiteId(files: any, site_id:any,model_id:any,dept_id:any) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/firstpage/'  + site_id+'/'+model_id+'/'+dept_id, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}


	uploadIMICFirstPageImageBySiteId(files: any, site_id:any,model_id:any,dept_id:any) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/firstpage/imic/'  + site_id+'/'+model_id+'/'+dept_id, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}



	uploadFooterImage(files: any, checklistId: number) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/footer/' + checklistId, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}

	uploadFooterImageBySiteId(files: any, site_id:any,model_id:any,dept_id:any) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/footer/'  + site_id+'/'+model_id+'/'+dept_id, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}


	uploadIMICFooterImageBySiteId(files: any, site_id:any,model_id:any,dept_id:any) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/footer/imic/'  + site_id+'/'+model_id+'/'+dept_id, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}




	uploadCranepadImage(files: any, checklistId: number) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/cranepad/' + checklistId, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}

	uploadCranepadImageBySiteId(files: any, site_id:any,model_id:any,dept_id:any) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/cranepad/' +  site_id+'/'+model_id+'/'+dept_id, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}

	uploadGuidelineImage(files: any, checklistId: number) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/guideline/' + checklistId, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}

	uploadGuidelineImageBySiteId(files: any, site_id:any,model_id:any,dept_id:any) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/reportdata/guideline/' +  site_id+'/'+model_id+'/'+dept_id, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}








	downloadDocument(payload: any) {
		// let options = this.getUserToken();
		// let r = this.http.post(this.baseUrl+'v1/documents/download',payload,options);
		// console.log(r);
		// return r;
		return Observable.create(observer => {

			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			xhr.open('POST', this.baseUrl + 'v1/documents/download', true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

			xhr.responseType = 'blob';

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {

						var contentType = 'application/*';
						var blob = new Blob([xhr.response], { type: contentType });
						observer.next(blob);
						observer.complete();
					} else {
						observer.error(xhr.response);
					}
				}
			}
			xhr.send(JSON.stringify({ path: "" + payload.path }));
		});
	}
	refreshPath(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/documents/refresh/' + id, payload, options).map((res: Response) => res.json());
	}
	deleteDocument(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/documents/delete', payload, options).map((res: Response) => res.json());
	}

	getNewDashboard(site_id: any) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'new/dashboard/' + site_id, options).map((res: Response) => res.json());
	}
	generateDocumentStructure() {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/documents/generate', options).map((res: Response) => res.json());
	}

	generateFeederCertificate(feeder_id: number) {
		let options = this.getUserToken();
		console.log(options);
		var payload = {};
		return this.http.post(this.baseUrl + 'v1/mobile/generate/feeder/substation/' + feeder_id + '/' + 1, payload, options).map((res: Response) => res.json());
	}

	generateSubstationCertificate(substation_id: number) {
		let options = this.getUserToken();
		console.log(options);
		var payload = {};
		return this.http.post(this.baseUrl + 'v1/mobile/generate/feeder/substation/' + substation_id + '/' + 2, payload, options).map((res: Response) => res.json());
	}

	sendHotoObservations(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'location/observations', payload, options).map((res: Response) => res.json());
	}
	uploadDocument(files: any, path: any, user: any) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			for (var i = 0; i < files.length; i++) {
				formData.append("file", files[i], files[i].name);
			}
			formData.append("path", path);
			formData.append("user", user);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'v1/documents', true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}
	getAllCountries() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/countries', options).map((res: Response) => res.json());
	}
	getDocuments(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/documents/' + id, options).map((res: Response) => res.json());
	}
	getAllStates(id: any) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/states/' + id, options).map((res: Response) => res.json());
	}

	getMobileAppVersion() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'mobile/version', options).map((res: Response) => res.json());
	}

	createWTGChecklistInstances(location_id: any) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'wtg/instances/' + location_id, options).map((res: Response) => res.json());
	}

	deleteWTGChecklistInstances(location_id: any)
	{
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/wtg/delete/wtg/instances/' + location_id, options).map((res: Response) => res.json());
	}



	getAllStages() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'stages', options).map((res: Response) => res.json());
	}
	getChecklistForStage2() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'master/form/checklists', options).map((res: Response) => res.json());
	}
	getChecklistByModel(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'model/published/' + id + '/checklists', options).map((res: Response) => res.json());
	}
	getChecklistForNextStages(project_id: number, model_id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'model/published/project/' + project_id + '/model/' + model_id + '/checklists', options).map((res: Response) => res.json());
	}
	// updateChecklistStatusById(id: number, status: any) {
	// 	let options = this.getUserToken();
	// 	return this.http.post(this.baseUrl + 'checklist/' + id + '/status', status, options).map((res: Response) => res.json());
	// }
	generateChecklistReports(checklist_ins_id: number, location_id: number, stage_id: number) {
		let options = this.getUserToken();
		var payload = {};
		return this.http.post(this.baseUrl + 'v1/mobile/generate/reports/' + checklist_ins_id + '/' + location_id + '/' + stage_id, payload, options).map((res: Response) => res.json());
	}

	generateIMICReports(checklist_ins_id: number, location_id: number) {
		let options = this.getUserToken();
		var payload = {};
		return this.http.post(this.baseUrl + 'v1/mobile/generate/reports/' + checklist_ins_id + '/' + location_id, payload, options).map((res: Response) => res.json());
	}

	generatePrerequisiteChecklistReports(checklist_ins_id: number) {
		let options = this.getUserToken();
		var payload = {};
		return this.http.get(this.baseUrl + 'v1/mobile/generate/prequisite/report/' + checklist_ins_id, options).map((res: Response) => res.json());
	}

	generateMilestoneReports(milestone_ins_id: number, location_id: number, stage_id: number) {
		let options = this.getUserToken();
		var payload = {};
		return this.http.post(this.baseUrl + 'v1/mobile/generate/reports/individual/' + milestone_ins_id + '/' + location_id + '/' + stage_id, payload, options).map((res: Response) => res.json());
	}
	generateDQRReports(milestone_ins_id: number,location_id:any) {
		let options = this.getUserToken();
		var payload = {};
		return this.http.get(this.baseUrl + 'v1/mobile/generate/dqr/reports/' + milestone_ins_id +"/"+location_id, options).map((res: Response) => res.json());
	}
	getAllChecklist() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'checklist-details', options).map((res: Response) => res.json());
	}
	getChecklistNames() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'checklist-names', options).map((res: Response) => res.json());
	}
	getAllChecklistDetailsByDept(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'checklist-details/department/' + id, options).map((res: Response) => res.json());
	}
	// getSectionByChecklistId(id: number) {
	// 	let options = this.getUserToken();
	// 	return this.http.get(this.baseUrl + 'checklist/' + id + '/sections', options).map((res: Response) => res.json());
	// }
	getChecklistItemBySectionId(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'sections/' + id + '/items', options).map((res: Response) => res.json());
	}
	createChecklist(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'checklist', payload, options).map((res: Response) => res.json());
	}
	updateChecklist(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'checklist/' + id, payload, options).map((res: Response) => res.json());
	}
	deleteChecklistById(id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'checklist/' + id + '/delete', null, options).map((res: Response) => res.json());
	}
	deleteGroupQuestionById(id: number) {//activity
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'milestone/activity/' + id + '/delete', null, options).map((res: Response) => res.json());
	}
	deleteIndividualQuestionById(id: number) {//individual
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'activity/question/' + id + '/delete', null, options).map((res: Response) => res.json());
	}
	// createNewChecklistVersion(id: number, VERSION: any) {
	// 	let options = this.getUserToken();
	// 	return this.http.post(this.baseUrl + 'checklist/clone/' + id, payload, options).map((res: Response) => res.json());
	// }
	// createSection(payload: any) {
	// 	let options = this.getUserToken();
	// 	return this.http.post(this.baseUrl + 'checklist-section', payload, options).map((res: Response) => res.json());
	// }
	deleteMilestoneById(id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'checklist/milestone/' + id + '/delete', null, options).map((res: Response) => res.json());
	}

	updateSection(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'checklist/milestone/' + id, payload, options).map((res: Response) => res.json());
	}
	getStageEightDetails(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'stage/' + id + '/details', options).map((res: Response) => res.json());
	}

	addStageEightDetails(id: number, payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'stage/' + id + '/details', payload, options).map((res: Response) => res.json());
	}
	createItem(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'cheklist-item', payload, options).map((res: Response) => res.json());
	}
	// saveQuestion(payload: any, id: number) {
	// 	let options = this.getUserToken();
	// 	return this.http.post(this.baseUrl + 'section/' + id + '/question', payload, options).map((res: Response) => res.json());
	// }
	saveQuestions(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'section/' + id + '/questions', payload, options).map((res: Response) => res.json());
	}
	saveActivityQuestions(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'questions/' + id, payload, options).map((res: Response) => res.json());
	}
	// updateQuestion(id: number, payload: any) {
	// 	let options = this.getUserToken();
	// 	return this.http.post(this.baseUrl + 'question/' + id, payload, options).map((res: Response) => res.json());
	// }
	// getQuestions(id: number) {
	// 	let options = this.getUserToken();
	// 	return this.http.get(this.baseUrl + 'section/' + id + '/questions', options).map((res: Response) => res.json());
	// }
	//master apis
	getAllDepartments() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetAllDepartments', options).map((res: Response) => res.json());
	}
	//area
	deleteAreaById(id: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + "v1/area/" + id + "/delete", null, options).map((res: Response) => res.json());
	}
	getAreaList() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + "v1/area", options).map((res: Response) => res.json());
	}
	getStateSpecificAreas(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + "v1/state/" + id + "/area", options).map((res: Response) => res.json());
	}
	saveArea(data) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + "v1/area", data, options).map((res: Response) => res.json());
	}
	updateArea(id, data) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + "v1/area/" + id, data, options).map((res: Response) => res.json());
	}
	deleteArea(id) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/area/' + id + '/delete', null, options).map((res: Response) => res.json());
	}

	//site
	deleteSiteById(id: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/site/' + id + '/delete', null, options).map((res: Response) => res.json());
	}
	getSites() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/site', options).map((res: Response) => res.json());
	}
	getUserSpecificSites(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'user/' + id + '/sites', options).map((res: Response) => res.json());
	}

	createSite(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/site', payload, options).map((res: Response) => res.json());
	}
	updateSite(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/site/' + id, payload, options).map((res: Response) => res.json());
	}

	//stage
	getStages() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/stage', options).map((res: Response) => res.json());
	}
	addStage(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/stage', payload, options).map((res: Response) => res.json());
	}
	updateStage(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/stage/' + id, payload, options).map((res: Response) => res.json());
	}

	//feeder
	deleteFeederById(id: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/feeder/' + id + '/delete', null, options).map((res: Response) => res.json());
	}
	getFeederById(id: any) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/site/' + id + '/feeder', options).map((res: Response) => res.json());
	}
	getFeeders() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/feeder', options).map((res: Response) => res.json());
	}
	getFeedersforStageFourByLocationId(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/feeder/location/' + id, options).map((res: Response) => res.json());
	}
	addFeeder(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/feeder', payload, options).map((res: Response) => res.json());
	}
	updateFeeder(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/feeder/' + id, payload, options).map((res: Response) => res.json());
	}
	//location
	deleteLocationById(id: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/location/' + id + '/delete', null, options).map((res: Response) => res.json());
	}
	getLocationById(id: any) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/site/' + id + '/location', options).map((res: Response) => res.json());
	}
	getLocations() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/location', options).map((res: Response) => res.json());
	}
	addLocation(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/create/location', payload, options).map((res: Response) => res.json());
	}
	updateLocation(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/location/' + id, payload, options).map((res: Response) => res.json());
	}
	//customer
	deleteCustomerById(id: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/customer/' + id + '/delete', null, options).map((res: Response) => res.json());
	}
	getCustomers() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/customer', options).map((res: Response) => res.json());
	}
	addCustomer(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/customer', payload, options).map((res: Response) => res.json());
	}
	updateCustomer(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/customer/' + id, payload, options).map((res: Response) => res.json());
	}

	//substations
	deleteSubstationById(id: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/substation/' + id + '/delete', null, options).map((res: Response) => res.json());
	}
	getSubstations() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/substation', options).map((res: Response) => res.json());
	}
	getSubstationsForStageFour(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/substation/location/' + id, options).map((res: Response) => res.json());
	}
	addSubstation(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/substation', payload, options).map((res: Response) => res.json());
	}
	updateSubstation(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/substation/' + id, payload, options).map((res: Response) => res.json());
	}
	//modules
	getProjectSpecificModules(id: any) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/project/' + id + '/modelmst', options).map((res: Response) => res.json());
	}
	deleteModulesById(id: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/modelmst/' + id + '/delete', null, options).map((res: Response) => res.json());
	}
	getModules() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/modelmst', options).map((res: Response) => res.json());
	}
	addModules(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/modelmst', payload, options).map((res: Response) => res.json());
	}
	updateModules(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/modelmst/' + id, payload, options).map((res: Response) => res.json());
	}
	//users
	deleteUserById(id: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'master/user/' + id + '/delete', null, options).map((res: Response) => res.json());
	}
	// getUsers() {
	// 	let options = this.getUserToken();
	// 	return this.http.get(this.baseUrl + 'master/user', options).map((res: Response) => res.json());
	// }
	addUser(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'User/AddUser', payload, options).map((res: Response) => res.json());
	}
	getHODByDept(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'master/user/hod/department/' + id, options).map((res: Response) => res.json());
	}
	getUsersByDept(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'master/user/department/' + id, options).map((res: Response) => res.json());
	}
	//
	getProjectList(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/site/' + id + '/project-list', options).map((res: Response) => res.json());
	}
	getAllProjects(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/site/' + id + '/projects', options).map((res: Response) => res.json());
	}
	addProject(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/project', payload, options).map((res: Response) => res.json());
	}
	addProjectModel(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/project/' + id + '/model', payload, options).map((res: Response) => res.json());
	}
	updateProject(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/project/' + id, payload, options).map((res: Response) => res.json());
	}
	getTeam(site_id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/site/' + site_id + '/team', options).map((res: Response) => res.json());
	}
	updateSiteHod(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/site/team', payload, options).map((res: Response) => res.json());
	}
	updateSiteTeam(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/site/team', payload, options).map((res: Response) => res.json());
	}
	getProjectsBySiteId(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/site/' + id + '/project', options).map((res: Response) => res.json());
	}
	getLocationsByProjectId(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/project/' + id + '/locations', options).map((res: Response) => res.json());
	}
	getChecklistInstanceByLocationId(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'location/' + id + '/checklist-instance', options).map((res: Response) => res.json());
	}
	updateChecklistInstance(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'instance/stage/checklist/' + id, payload, options).map((res: Response) => res.json());
	}
	updateStageInstance(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'instance/project/stage/' + id, payload, options).map((res: Response) => res.json());
	}
	getProjectSpecificModels(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/project/' + id + '/model', options).map((res: Response) => res.json());
	}
	getChecklistsForDashboard(location_id: number, stage_id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'location/' + location_id + '/stage/' + stage_id, options).map((res: Response) => res.json());
	}
	getChecklistsStatusForDashboard(location_id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'dashboard/checklist-status/location/' + location_id, options).map((res: Response) => res.json());
	}
	getConfigurationQuestions(stage_instance_id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'configuration/' + stage_instance_id + '/questions', options).map((res: Response) => res.json());
	}
	updateConfigurationQuestions(stage_instance_id: number, payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'configuration/' + stage_instance_id + '/question', payload, options).map((res: Response) => res.json());
	}
	getChecklistHistory(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'checklist/instance/' + id + '/history', options).map((res: Response) => res.json());
	}
	getWTGQuestionInstance(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'instance/wtg/milestone/' + id + '/question', options).map((res: Response) => res.json());
	}
	getQuestionInstance(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'instance/milestone/' + id + '/question', options).map((res: Response) => res.json());
	}
	assignMilestone(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'checklist/milestone/' + id + '/re-assign', payload, options).map((res: Response) => res.json());
	}
	getQuestionHistory(id: number) {
		let headers2 = new Headers();
		headers2.append('Content-Type', 'application/x-www-form-urlencoded');
		headers2.append('device-id', 'web');
		headers2.append('Authorization', 'bearer ' + JSON.parse(localStorage.getItem('UserToken')).token);
		let options2 = new RequestOptions({ headers: headers2 });
		return this.http.get(this.baseUrl + 'v1/mobile/question/instance/history?id=' + id, options2).map((res: Response) => res.json(), (error) => this.handleError(error));
	}
	getAllocatedTeam(site_id: number, dept_id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'master/user/site/' + site_id + '/department/' + dept_id, options).map((res: Response) => res.json());
	}
	getDeptByStageId(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/stage/' + id + '/departments', options).map((res: Response) => res.json());
	}
	makeChecklistInstanceInprogress(location_id: number, stage_ins_id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'location/' + location_id + '/stage-ins/' + stage_ins_id + '/checklist/inprogress', options).map((res: Response) => res.json());
	}
	getSiteDashboardRecords(site_id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'site/' + site_id + '/site-dashboard', options).map((res: Response) => res.json());
	}
	deleteProject(id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/project/' + id + '/delete', null, options).map((res: Response) => res.json());
	}
	startSubstation(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'substation/start', payload, options).map((res: Response) => res.json());
	}
	startFeeder(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'feeder/start', payload, options).map((res: Response) => res.json());
	}
	getChecklistsOfStage(site_id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'site/stage/' + site_id + '/checklist-count', options).map((res: Response) => res.json());
	}
	getUsersByLDAP(query: string) {
		let headers2 = new Headers();
		headers2.append('Content-Type', 'application/x-www-form-urlencoded');
		headers2.append('device-id', 'web');
		headers2.append('Authorization', 'bearer ' + JSON.parse(localStorage.getItem('UserToken')).token);
		let options2 = new RequestOptions({ headers: headers2 });

		return this.http.get(this.baseUrl + 'v1/mobile/user/search/' + query, options2).map((res: Response) => res.json(), (error) => this.handleError(error));
	}
	approveChecklist(id: number) {
		let headers2 = new Headers();
		headers2.append('Content-Type', 'application/x-www-form-urlencoded');
		headers2.append('device-id', 'web');
		headers2.append('Authorization', 'bearer ' + JSON.parse(localStorage.getItem('UserToken')).token);
		let options2 = new RequestOptions({ headers: headers2 });
		return this.http.post(this.baseUrl + 'v1/mobile/checklist/approved/' + id + '/update', null, options2).map((res: Response) => res.json(), (error) => this.handleError(error));
	}
	getStagesInsByLocation(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'location/' + id + '/stages', options).map((res: Response) => res.json());
	}
	getNotificationByLocation(id: number) {
		let headers2 = new Headers();
		headers2.append('Content-Type', 'application/x-www-form-urlencoded');
		headers2.append('device-id', 'web');
		headers2.append('Authorization', 'bearer ' + JSON.parse(localStorage.getItem('UserToken')).token);
		let options2 = new RequestOptions({ headers: headers2 });
		return this.http.get(this.baseUrl + 'v1/mobile/location/' + id + '/notifications', options2).map((res: Response) => res.json(), (error) => this.handleError(error));
	}
	getSTPTCertificateByLocationId(id: number) {
		let headers2 = new Headers();
		headers2.append('Content-Type', 'application/x-www-form-urlencoded');
		headers2.append('device-id', 'web');
		headers2.append('Authorization', 'bearer ' + JSON.parse(localStorage.getItem('UserToken')).token);
		let options2 = new RequestOptions({ headers: headers2 });
		return this.http.get(this.baseUrl + 'cod/certificate/location/' + id, options2).map((res: Response) => res.json(), (error) => this.handleError(error));
	}
	getCertificateByLocationId(id: number) {
		let headers2 = new Headers();
		headers2.append('Content-Type', 'application/x-www-form-urlencoded');
		headers2.append('device-id', 'web');
		headers2.append('Authorization', 'bearer ' + JSON.parse(localStorage.getItem('UserToken')).token);
		let options2 = new RequestOptions({ headers: headers2 });
		return this.http.post(this.baseUrl + 'v1/mobile/genrate/certificate/' + id + '/2', null, options2).map((res: Response) => res.json(), (error) => this.handleError(error));
	}
	getInternalCertificateByLocationId(id: number) {
		let headers2 = new Headers();
		headers2.append('Content-Type', 'application/x-www-form-urlencoded');
		headers2.append('device-id', 'web');
		headers2.append('Authorization', 'bearer ' + JSON.parse(localStorage.getItem('UserToken')).token);
		let options2 = new RequestOptions({ headers: headers2 });
		return this.http.post(this.baseUrl + 'v1/mobile/genrate/certificate/' + id + '/1', null, options2).map((res: Response) => res.json(), (error) => this.handleError(error));
	}
	approveStage(loc_id: number, id: number, payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'location/' + loc_id + '/stage/' + id + '/approve', payload, options).map((res: Response) => res.json());
	}
	approveStageFour(loc_id: number, id: number, payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'location/' + loc_id + '/stage/' + id + '/approve', payload, options).map((res: Response) => res.json());
	}
	getModelConfig(type: string) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/model/config/' + type + '/get', options).map((res: Response) => res.json());
	}
	// updateUser(obj: any, id: number) {
	// 	let options = this.getUserToken();
	// 	return this.http.post(this.baseUrl + 'master/user/' + id, obj, options).map((res: Response) => res.json());
	// }
	getAllSubstation() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'substation/checklists', options).map((res: Response) => res.json());
	}

	getChecklistForUpdate(location_id: any) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'new/checklists/' + location_id, options).map((res: Response) => res.json());
	}

	updateExistingChecklist(checklist_id: number, location_id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'existing/checklist/' + checklist_id + '/' + location_id, options).map((res: Response) => res.json());
	}

	getAllFeeder() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'feeder/checklists', options).map((res: Response) => res.json());
	}

	getAllSitesInIndia() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'india/summary', options).map((res: Response) => res.json());
	}
	getAllContractors() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/contractors/management/get/all/contractors', options).map((res: Response) => res.json());
	}
	addContractor(contractor: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/contractors/management/add', contractor, options).map((res: Response) => res.json());
	}
	editContractor(contractor: any, id: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/contractors/management/update/' + id, contractor, options).map((res: Response) => res.json());
	}
	updateWTGStatus(payload: any,model_id:any,dept_id:any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/wtg/update/wtg/status/' + model_id+'/'+dept_id, payload, options).map((res: Response) => res.json());
	}
	getDPRDashboard() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/dpr/get/dpr/data', options).map((res: Response) => res.json());
	}
	getDPRDashboardExcel() {
		return Observable.create(observer => {
            const xhr = new XMLHttpRequest();
            const token = JSON.parse(localStorage.getItem('UserToken')).token;
            xhr.open('POST', this.baseUrl + 'v1/dpr/excel', true);
            xhr.setRequestHeader('Authorization', 'bearer ' + token);
            xhr.setRequestHeader('device-id', 'web');
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.responseType = 'blob';
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const contentType = 'application/*';
                        const blob = new Blob([xhr.response], { type: contentType });
                        observer.next(blob);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.send(JSON.stringify(null));
        });
	}
	getDPRLocationDashboardExcel(payload:any) {
		return Observable.create(observer => {
            const xhr = new XMLHttpRequest();
            const token = JSON.parse(localStorage.getItem('UserToken')).token;
            xhr.open('POST', this.baseUrl + 'v1/dpr/location/excel',true);
            xhr.setRequestHeader('Authorization', 'bearer ' + token);
            xhr.setRequestHeader('device-id', 'web');
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.responseType = 'blob';
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const contentType = 'application/*';
                        const blob = new Blob([xhr.response], { type: contentType });
                        observer.next(blob);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.send(JSON.stringify(payload));
        });
	}
	generateDPRDashboard() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/dpr/generate', options).map((res: Response) => res.json());
	}
	updateDPRDashboard() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/dpr/update', options).map((res: Response) => res.json());
	}
	getLocationDPRDashboard(site_list:any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/dpr/location/get',site_list, options).map((res: Response) => res.json());
	}
	generateLocationDPRDashboard() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'v1/dpr/location/generate', options).map((res: Response) => res.json());
	}
	updateLocationDPRDashboard(payload: any,id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'v1/dpr/location/update/' + id, payload, options).map((res: Response) => res.json());
	}
	generateHOTODashboard()
	{
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'generate/dashboard', options).map((res: Response) => res.json());
	}
	private extractData(res: Response) {
		let body = res.json();
		return body || {};
	}

	private handleError(error: any): Promise<any> {
		if (error.status == 401) {
			this.router.navigate(['/session/signin']);
		}
		console.error('An error occurred', error);
		return Promise.reject(error.message || error);
	}

	checkStatus(error) {
		if (error.status === 401) {
			//redirect to login
			localStorage.clear();
			this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
		}
	}


	getAllTurbineType(){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetAllTurbineType', options).map((res: Response) => res.json());

	}
	getAllOEMTypes(){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetAllOEM', options).map((res: Response) => res.json());
	}
	getAllModels(){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetAllModels', options).map((res: Response) => res.json());
	}
	getAllMaintenanceTypes(){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetPMType', options).map((res: Response) => res.json());
	}
	getAllCategory1s(){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetCategory1', options).map((res: Response) => res.json());
	}
	getAllCategory2s(category1){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetCategory2?category1='+ category1, options).map((res: Response) => res.json());
	}
	getAllCategory3s(category1,category2){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetCategory3?category1='+ category1+'&category2='+category2, options).map((res: Response) => res.json());
	}
	createCheckList(obj){
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'Checklist/CreateChecklist',obj, options).map((res: Response) => res.json());
	}
	getAllChecklistByModelIdAndPMType(modelId,pmType){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Checklist/GetChecklist?ModelName='+modelId+'&MaintenanceType='+pmType, options).map((res: Response) => res.json());	
	}

	getSectionByChecklistId(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Milestone/GettMilestoneByChecklistId?ChecklistId='+id, options).map((res: Response) => res.json());
	}

	getQuestions(id: number) {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Question/GetQuestionByMilestoneId?MilestoneId='+id, options).map((res: Response) => res.json());
	}
	getAllSpecifications(){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetAllCheckpointType', options).map((res: Response) => res.json());
	}
	saveQuestion(payload: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'Question/CreateQuestion?MilestoneId='+id, payload, options).map((res: Response) => res.json());
	}
	updateQuestion(id: number, payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'Question/UpdateQuestion?QuestionId='+ id, payload, options).map((res: Response) => res.json());
	}
	uploadChecklist(files: any, Id: number, CreatedBy: Number) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			let token = JSON.parse(localStorage.getItem('UserToken')).token;
			formData.append("file", files[0], files[0].name);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.baseUrl + 'Common/UploadExcel?Type='+Id, true);
			xhr.setRequestHeader('Authorization', 'bearer ' + token);
			xhr.setRequestHeader('device-id', 'web');
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(formData);
		});
	}
	getAssetBySite(selectdSite){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetAssetMasterbySite?site='+selectdSite, options).map((res: Response) => res.json());
	}
	getAllSite(){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetAllSite', options).map((res: Response) => res.json());
	}
	getPmScheduleBySiteOrModelOrPMType(site,model,pmtype){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetMaintenanceScheduleforall?site='+site+'&modelName='+model+'&maintenanceTypeId='+pmtype, options).map((res: Response) => res.json());
	}
	getPmScheduleBySiteOrModelOrPMTypedemo(site,model,pmtype){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetMaintenanceScheduleforall?site=&modelName=&maintenanceTypeId='+pmtype, options).map((res: Response) => res.json());
	}
	getUsers() {
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'User/GetAllUser', options).map((res: Response) => res.json());
	}
	updateUser(obj: any, id: number) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'User/UpdateUser/' + id, obj, options).map((res: Response) => res.json());
	}
	createNewChecklistVersion(id: number, version: any) {
		
		  // Get the authorization headers
		  let options = this.getUserToken();

		  // Construct the URL with query parameters
		  let url = this.baseUrl + 'Checklist/checklist/clone?ChecklistId=' + id + '&Version=' + version;
	  
		  // Send an HTTP POST request
		  return this.http.post(url, null, options).map((res: Response) => res.json());
	}
	createMilestone(payload: any) {
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'Milestone/CreateMilestone', payload, options).map((res: Response) => res.json());
	}
	getPMScheduleApproval(){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetPmScheduleByRoleforApproval', options).map((res: Response) => res.json());
	}
	pmScheduleApprove(jobId){
		let options = this.getUserToken();
        return this.http.post(this.baseUrl + 'Common/PmScheduleByApproval?JobId='+jobId,null, options).map((res: Response) => res.json());
	}
	getLocationBySiteId(siteId){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetLocationBySite?siteId='+siteId, options).map((res: Response) => res.json());
	}
	getGetExecutionChecklistBySiteIdAndLocationAndPMType(site,location,pmtype){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Checklist/GetExecutionChecklist?siteId='+site+'&functionalLocation='+location+'&pmtypeId='+pmtype, options).map((res: Response) => res.json());
	}
	SendForCorrection(obj){
		let options = this.getUserToken();
        return this.http.post(this.baseUrl + 'Checklist/Excecution/SendforCorrectionQuestionInstances', obj, options).map((res: Response) => res.json());
	}
	UpdateQuestionInstance(obj){
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'Checklist/Excecution/UpdateQuestionInstance',obj, options).map((res: Response) => res.json());
	}
	getQADashboardChecklists(){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Checklist/GetQADashboardChecklists', options).map((res: Response) => res.json());

	}
	QuestionInsListByChecklistInsIdAndSiteAndLocationAndPMType(checklistInsId,site,location,pmType){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Checklist/QuestionInsListByChecklistInsId?checklistInsId='+checklistInsId+'&siteName='+site+'&functionalLocationName='+location+'&maintenance_type='+pmType, options).map((res: Response) => res.json());
	}
	SendForCorrectionQA(obj){
		let options = this.getUserToken();
		return this.http.post(this.baseUrl + 'Checklist/FinalApprovalFromQAQuestionwise',obj, options).map((res: Response) => res.json());
	}
	getQuestionHistoryByQuestionInsIdAndSiteAndLocationAndPMType(questioninsId,site,location,pmType){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Checklist/GetHistoryByChecklistInsId?checklistInsId='+questioninsId+'&siteName='+site+'&functionalLocationName='+location+'&maintenance_type='+pmType, options).map((res: Response) => res.json());

	}
	downloadTemplate(sheetName){
		let options = this.getUserToken();
		options.responseType = ResponseContentType.Blob;
		return this.http.get(this.baseUrl + 'Checklist', options);
	}
	GetPmScheduleByJobId(jobId){
		let options = this.getUserToken();
		return this.http.get(this.baseUrl + 'Common/GetPmScheduleByJobId?JobId='+jobId, options).map((res: Response) => res.json());

	}
}


