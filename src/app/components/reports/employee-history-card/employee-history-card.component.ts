import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Employee_History_Card } from "src/app/_helper/SM_CODE";
import { CommonService } from "src/app/_services/common.service";
import { ReportsService } from "../reports.service";
import jspdf from "jspdf";
import "jspdf-autotable";
import { Workbook } from "exceljs";
import * as fs from "file-saver";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-employee-history-card",
  templateUrl: "./employee-history-card.component.html",
  styleUrls: ["./employee-history-card.component.css"],
})
export class EmployeeHistoryCardComponent implements OnInit {
  public employeeList: any[] = [];
  public menuAccess: boolean = true;
  public addAccess: boolean = true;
  public viewAccess: boolean = true;
  public updateAccess: boolean = true;
  public deleteAccess: boolean = true;
  public printAccess: boolean = true;
  public backDateAccess: boolean = true;
  public cols: any[];

  public exportColumns: any[];
  public exportExcelColumns: any[] = [];
  public pipe = new DatePipe("en-US");

  public fromDate: Date;
  public toDate: Date;
  public allCheckbox: boolean = true;
  public totalRecords = 0;
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: ReportsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    var UM_CODE = currentUser?.user.UM_CODE;
    this.commonService
      .checkRight(UM_CODE, Employee_History_Card, "checkRight")
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
      this.getEmployees();
      this.cols = [
        { field: "process_name", header: "Process Name" },
        { field: "TrainingProgramMaster_title", header: "Program Title" },

        { field: "CategoryToSkillLevelMaster_title", header: "Present Skill" },

        {
          field: "CategoryToSkillLevelMaster_titleNextLevel",
          header: "Next Skill",
        },
        { field: "EMP_MASTER_NAME", header: "Employee Name" },
        { field: "EMP_MASTER_NUMBER", header: "Employee Number" },
        { field: "TRAININGPROGRAM_ID_FROM_DATE", header: "From Date" },

        { field: "TRAININGPROGRAM_ID_TO_DATE", header: "To Date" },

        { field: "TrainingProgramMaster_duration", header: "Duration" },

        { field: "TrainingProgramMaster_location", header: "Location" },

        {
          field: "TrainingProgramMaster_modeOfTraining",
          header: "Mode Of Training",
        },

        { field: "evaldate", header: "Evaluation Date" },
        { field: "evalmarks", header: "Evaluation Marks" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      this.cols.map((col) => this.exportExcelColumns.push(col.header));
      console.log(this.exportExcelColumns);
    }
  }

  getEmployees() {
    console.log(this.allCheckbox);
    this.employeeList = [];

    if (this.allCheckbox) {
      this.fromDate = new Date("01-01-2021");
      this.toDate = new Date("31-12-2021");

      this.service.getEmployeeHistory(null, null).subscribe((data) => {
        console.log(data);
        this.employeeList = data;
        this.totalRecords = this.employeeList.length;
      });
    } else {
      if (!!this.fromDate || !!this.toDate) {
        return this.messageService.add({
          key: "t1",
          severity: "info",
          summary: "Info",
          detail: "Please Select From Date and To Date",
        });
      }
      this.service
        .getEmployeeHistory(this.fromDate, this.toDate)
        .subscribe((data) => {
          console.log(data);
          this.employeeList = data;
          this.totalRecords = this.employeeList.length;
        });
    }
  }

  // exportPdf() {

  //       var doc = new jsPDF();
  //       doc.autoTable(this.exportColumns, this.employeeList);
  //       doc.save("products.pdf");
  //     });
  //   });
  // }

  exportPdf() {
    if (this.employeeList.length == 0) {
      return this.messageService.add({
        key: "t1",
        severity: "error",
        summary: "Error",
        detail: "No Data Selected to export",
      });
    }
    var doc = new jspdf({
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
    doc.save("EmployeeHistoryCard" + "_export_" + new Date().getTime());
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
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("EmployeeHistoryCard");

    worksheet.mergeCells("B3:N5");
    worksheet.properties.defaultRowHeight = 35;
    // ... merged cells are linked
    worksheet.getCell("N5").value = "EMPLOYEE HISTORY CARD";

    worksheet.getCell("N5").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.getCell("N5").border = {
      top: { style: "thick" },
      left: { style: "thick" },
      bottom: { style: "thick" },
      right: { style: "thick" },
    };

    worksheet.getCell("N5").font = {
      size: 20,
      underline: true,
      bold: true,
    };
    // worksheet.columns = this.exportExcelColumns;

    worksheet.getRows(6, 1).forEach((row) => {
      for (let i = 2; i <= 14; i++) {
        row.getCell(i).value = this.exportExcelColumns[i - 2];
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
      { width: 30 },
      { width: 30 },
      { width: 20 },
      { width: 20 },
      { width: 30 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 10 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
    ];
    this.employeeList.map((data) => {
      const rowValues = [];
      rowValues[2] = data.process_name;

      rowValues[3] = data.TrainingProgramMaster_title;
      rowValues[4] = data.CategoryToSkillLevelMaster_title;
      rowValues[5] = data.CategoryToSkillLevelMaster_titleNextLevel;
      rowValues[6] = data.EMP_MASTER_NAME;
      rowValues[7] = data.EMP_MASTER_NUMBER;
      rowValues[8] = this.pipe.transform(
        data.TRAININGPROGRAM_ID_FROM_DATE,
        "mediumDate"
      );
      rowValues[9] = this.pipe.transform(
        data.TRAININGPROGRAM_ID_TO_DATE,
        "mediumDate"
      );

      rowValues[10] = data.TrainingProgramMaster_duration;
      rowValues[11] = data.TrainingProgramMaster_location;
      rowValues[12] = data.TrainingProgramMaster_modeOfTraining;
      rowValues[13] = this.pipe.transform(data.evaldate, "mediumDate");
      rowValues[14] = data.evalmarks;

      worksheet.addRow(rowValues, "n");
    });
    worksheet.getRows(7, this.employeeList.length).forEach((row) => {
      for (let i = 2; i <= 14; i++) {
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

    // worksheet.addRows(this.employeeList, "n");

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fs.saveAs(
        blob,
        "EmployeeHistoryCard" + "_export_" + new Date().getTime()
      );
    });
  }
}
