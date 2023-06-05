import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faList, faPlus, faTrashCan, faClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import { EmployeeService } from '../shared/services/employee/employee.service';
import { Employee } from '../shared/model/employee';
import frenchTranslation from '../../assets/i18n/french.json';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  @ViewChild('closeButton', { static: false }) closeButton!: ElementRef;
  employees: Employee[] = [];
  employee: Employee = new Employee();
  minAge!: Date;
  faList = faList;
  faPlus = faPlus;
  faTrashCan = faTrashCan;
  faClose = faClose;
  displayTable: boolean = false;
  frenchLanguage!: any;
  dtOptions: DataTables.Settings = {};


  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.reloadData();
    // on suppose que l'âge minimum est de 18 ans
    let today = new Date();
    let minAge = 18;
    this.minAge = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

    // changer la langue de la table de données en français
    this.frenchLanguage = {
      ...frenchTranslation
    };
    this.dtOptions = {
      language: this.frenchLanguage
    };
  }

  calculateAge(dob: Date): number {
    const today = new Date();
    const dayOfBirth = new Date(dob);

    let age = today.getFullYear() - dayOfBirth.getFullYear();
    let monthDiff = today.getMonth() - dayOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dayOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  addEmployee() {
    this.closeButton.nativeElement.click();
    this.employee.age = this.calculateAge(this.employee.dob);
    this.employees.unshift(this.employee);
    this.employee = new Employee();
  }

  deleteEmployee(obj: any) {
    const index = this.employees.indexOf(obj);
    if (index !== -1) {
      this.employees.splice(index, 1);
    }
  }

  reloadData() {
    this.employeeService.getEmployeeList().subscribe(
      (data: any) => {
        this.employees = data;
        this.displayTable = true;
      },
      (err) => {}
    );
  }
}
