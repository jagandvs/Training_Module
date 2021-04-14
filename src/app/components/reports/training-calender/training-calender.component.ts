import { Component, OnInit } from "@angular/core";
import { Workbook } from "exceljs";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Training_Need } from "src/app/_helper/SM_CODE";
import { CommonService } from "src/app/_services/common.service";
import { ReportsService } from "../reports.service";
import * as fs from "file-saver";
import jsPDF from "jspdf";
@Component({
  selector: "app-training-calender",
  templateUrl: "./training-calender.component.html",
  styleUrls: ["./training-calender.component.css"],
})
export class TrainingCalenderComponent implements OnInit {
  public employeeList: any[] = [];
  public employeeTable: any[] = [];

  public menuAccess: boolean = true;
  public addAccess: boolean = true;
  public viewAccess: boolean = true;
  public updateAccess: boolean = true;
  public deleteAccess: boolean = true;
  public printAccess: boolean = true;
  public backDateAccess: boolean = true;
  public cols: any[];
  public emptype;
  public deptAll: boolean = false;
  public deptId;
  public deptDropdown: SelectItem[] = [];
  public exportColumns: any[];
  public columns: any[];
  public Q1: any[] = [];

  public employeeTypeDropdown: SelectItem[] = [];
  constructor(
    private commonService: CommonService,

    private service: ReportsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    var UM_CODE = currentUser?.user.UM_CODE;
    this.commonService
      .checkRight(UM_CODE, Training_Need, "checkRight")
      .subscribe((data) => {
        for (let access of data) {
          this.menuAccess = access.MENU;
          this.addAccess = access.ADD;
          this.deleteAccess = access.DELETE;
          this.viewAccess = access.VIEW;
          this.printAccess = access.PRINT;
          this.backDateAccess = access.BACK_DATE;
          this.updateAccess = access.UPDATE;
        }
      });
    if (this.menuAccess) {
      this.employeeTypeDropdown = [
        {
          label: "Staff",
          value: 1,
        },
        {
          label: "Workers",
          value: 0,
        },
      ];

      this.cols = [
        { field: "ProcessName", header: "Process Name" },
        { field: "TrainingPlanned", header: "Training Planned" },
        { field: "QTR1P", header: " QTR1P" },
        { field: "QTR2P", header: "QTR2P " },
        { field: "QTR3P", header: "QTR3P" },
        { field: "QTR4P", header: "QTR4P" },
        { field: "QTR1A", header: "QTR1A" },
        { field: "QTR2A", header: "QTR2A" },
        { field: "QTR3A", header: "QTR3A" },
        { field: "QTR4A", header: "QTR4A" },
      ];
      this.exportColumns = [
        { dataKey: "id", title: "SR NO" },

        { dataKey: "department_name", title: "Department" },
        { dataKey: "TrainingProgramMaster_title", title: "Training Needs" },
      ];
    }
  }

  onChangeEmpType() {
    var EMPLOYEE_QUERY = {
      TableNames: "EmployeeMaster,department_master",
      fieldNames: "department_id,department_name",
      condition: `EMP_MASTER_DEPARTMENT_ID=department_id and EmployeeMaster.es_delete=0 and EMP_MASTER_EMP_TYPE=${this.emptype}`,
    };

    this.commonService.FillCombo(EMPLOYEE_QUERY).subscribe((data) => {
      this.deptDropdown = [];
      for (let item of data) {
        this.deptDropdown.push({
          label: item.department_name,
          value: item.department_id,
        });
      }
    });
  }

  getList() {
    this.employeeList = [];
    this.employeeTable = [];

    this.deptAll ? (this.deptId = 0) : (this.deptId = this.deptId);
    this.service
      .getTrainingNeedsAndCalender(
        this.emptype,
        this.deptId,
        this.deptAll,
        "getTRAININGCALENDER"
      )
      .subscribe((data) => {
        // console.log(data);
        this.employeeList = data;
        data.forEach((value) => {
          this.employeeTable.push({
            ProcessName: value.ProcessName,
            TrainingPlanned: value.TrainingPlanned,
            QTR1P: value.QTR1P ? "Yes" : "No",
            QTR2P: value.QTR2P ? "Yes" : "No",
            QTR3P: value.QTR3P ? "Yes" : "No",
            QTR4P: value.QTR4P ? "Yes" : "No",
            QTR1A: value.QTR1A ? "Yes" : "No",
            QTR2A: value.QTR2A ? "Yes" : "No",
            QTR3A: value.QTR3A ? "Yes" : "No",
            QTR4A: value.QTR4A ? "Yes" : "No",
          });
        });
        this.employeeList.map((value) => {
          this.Q1.push([value.QTR1P, value.QTR2P, value.QTR3P, value.QTR4P]);
          this.Q1.push([value.QTR1A, value.QTR2A, value.QTR3A, value.QTR4A]);
        });
        // console.log(this.Q1);
      });
  }

  exportExcel() {
    if (this.employeeList.length == 0) {
      return this.messageService.add({
        key: "t1",
        severity: "error",
        summary: "Error",
        detail: "No Data Selected to export",
      });
    }
    var exportExcelColumns = [
      "SR NO",
      "PROCESS",
      "TRAINING PLANNED",
      "",
      "QTR1",
      "QTR2",
      "QTR3",
      "QTR4",
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Training Calender");

    worksheet.mergeCells("B2:I2");
    worksheet.properties.defaultRowHeight = 55;
    // ... merged cells are linked
    worksheet.getCell("B2").value = "TRAINING CALENDER";

    worksheet.getCell("B2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.getCell("B2").font = {
      size: 20,
      underline: true,
      bold: true,
    };
    worksheet.getCell("B2").border = {
      top: { style: "thick" },
      left: { style: "thick" },
      bottom: { style: "thick" },
      right: { style: "thick" },
    };

    worksheet.getRows(3, 1).forEach((row) => {
      for (let i = 2; i <= 9; i++) {
        row.getCell(i).value = exportExcelColumns[i - 2];
        row.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        row.font = {
          size: 10,
          bold: true,
        };
        row.getCell(i).fill = {
          type: "pattern",
          pattern: "lightGray",
        };
        row.getCell(i).border = {
          top: { style: "thick" },
          left: { style: "thick" },
          bottom: { style: "thick" },
          right: { style: "thick" },
        };
      }
    });

    worksheet.columns = [
      { width: 10 },
      { width: 10 },
      { width: 30 },
      { width: 50 },
      { width: 5 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
    ];
    // for (let i = 2; i <= this.employeeList.length + 1; i++) {
    //   console.log(i);
    // }
    // this.employeeList.map((data) => {
    //   const rowValues = [];
    //   rowValues[2] = data.id;

    //   rowValues[3] = data.ProcessName;
    //   rowValues[4] = data.TrainingPlanned;

    //   worksheet.addRow(rowValues, "n");
    // });

    for (let i = 2; i <= this.employeeList.length + 1; i++) {
      worksheet.getCell(`E${2 * i}`).value = "P";
      worksheet.getCell(`E${2 * i + 1}`).value = "A";
    }

    let index = 0;
    worksheet.getRows(4, this.employeeList.length * 2).forEach((row) => {
      let j = 0;
      for (let i = 6; i <= 9; i++, j++) {
        // console.log(this.Q1[index][j]);
        if (this.Q1[index][j]) {
          row.getCell(i).fill = {
            type: "pattern",
            pattern: "darkVertical",
            fgColor: { argb: "00ff00" },
          };
        } else {
          row.getCell(i).fill = {
            type: "pattern",
            pattern: "darkTrellis",
            fgColor: { argb: "7FFF0000" },
            bgColor: { argb: "7FFF0000" },
          };
        }
      }
      index++;
    });
    this.employeeList.forEach((data, i) => {
      worksheet.mergeCells(`B${2 * i + 4}:B${2 * i + 5}`);
      worksheet.mergeCells(`C${2 * i + 4}:C${2 * i + 5}`);
      worksheet.mergeCells(`D${2 * i + 4}:D${2 * i + 5}`);
      worksheet.getCell(`B${2 * i + 4}`).value = data.id;
      worksheet.getCell(`C${2 * i + 4}`).value = data.ProcessName;
      worksheet.getCell(`D${2 * i + 4}`).value = data.TrainingPlanned;
    });

    worksheet.getRows(4, this.employeeList.length * 2).forEach((row) => {
      for (let i = 2; i <= 9; i++) {
        row.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        row.font = {
          size: 10,
          bold: false,
        };
        row.getCell(i).border = {
          top: { style: "thick" },
          left: { style: "thick" },
          bottom: { style: "thick" },
          right: { style: "thick" },
        };
      }
      row.height = 55;
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fs.saveAs(blob, "TrainingNeeds" + "_export_" + new Date().getTime());
    });
  }
}
