import { Component, OnInit } from "@angular/core";
import { Workbook } from "exceljs";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Training_Needs } from "src/app/_helper/SM_CODE";
import { CommonService } from "src/app/_services/common.service";
import { ReportsService } from "../reports.service";
import * as fs from "file-saver";
import jsPDF from "jspdf";
@Component({
  selector: "app-training-needs",
  templateUrl: "./training-needs.component.html",
  styleUrls: ["./training-needs.component.css"],
})
export class TrainingNeedsComponent implements OnInit {
  public employeeList: any[] = [];
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
  public exportExcelColumns: any[];

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
      .checkRight(UM_CODE, Training_Needs, "checkRight")
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
        { field: "department_name", header: "Department" },
        { field: "TrainingProgramMaster_title", header: "Training Needs" },
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
    this.deptAll ? (this.deptId = 0) : (this.deptId = this.deptId);
    this.service
      .getTrainingNeedsAndCalender(
        this.emptype,
        this.deptId,
        this.deptAll,
        "getTRAININGNEEDS"
      )
      .subscribe((data) => {
        this.employeeList = data;
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
    var exportExcelColumns = ["SR NO", "DEPARTMENT", "TRAINING NEEDS"];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Training Needs");

    worksheet.mergeCells("B2:D2");
    worksheet.properties.defaultRowHeight = 55;
    // ... merged cells are linked
    worksheet.getCell("B2").value = "TRAINING NEEDS";

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
      for (let i = 2; i <= 4; i++) {
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
      { width: 30 },
      ,
    ];
    var i = 4;
    this.employeeList.map((data) => {
      const rowValues = [];
      rowValues[2] = data.id;

      rowValues[3] = data.TrainingProgramMaster_title;
      rowValues[4] = data.department_name;

      worksheet.addRow(rowValues, "n");
    });
    worksheet.getRows(4, this.employeeList.length).forEach((row) => {
      for (let i = 2; i <= 4; i++) {
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

  exportPdf() {
    if (this.employeeList.length == 0) {
      return this.messageService.add({
        key: "t1",
        severity: "error",
        summary: "Error",
        detail: "No Data Selected to export",
      });
    }
    var doc = new jsPDF({
      orientation: "landscape",
    });
    doc.setFontSize(18);
    // doc.text("My PDF Table", 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // img.src = "assets/images/logo.png";
    // doc.addImage("assets/images/logo.png", "PNG", 0, 0, 180, 180);

    (doc as any).autoTable({
      columns: this.exportColumns,
      body: this.employeeList,
      theme: "striped",
      styles: { fontSize: 8, minCellWidth: 0.8, overflow: "linebreak" },
      didDrawCell: (data) => {
        console.log(data.column.index);
      },
    });
    for (
      let pageNumber = 1;
      pageNumber <= doc.getNumberOfPages();
      pageNumber++
    ) {
      doc.setPage(pageNumber);
      doc.addImage("assets/images/logo.png", "PNG", 130, 0, 30, 15);
    }

    // Open PDF document in new tab
    // doc.output("dataurlnewwindow");

    // Download PDF document
    doc.save("TrainingNeeds" + "_export_" + new Date().getTime());
  }
}
