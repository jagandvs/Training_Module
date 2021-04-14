import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Training_Need } from "src/app/_helper/SM_CODE";
import { CommonService } from "src/app/_services/common.service";
import { ReportsService } from "../reports.service";
import jspdf from "jspdf";
import "jspdf-autotable";
import { Workbook } from "exceljs";
import * as fs from "file-saver";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-history-card",
  templateUrl: "./history-card.component.html",
  styleUrls: ["./history-card.component.css"],
})
export class HistoryCardComponent implements OnInit {
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
  public empname;
  public employeeDropdown: SelectItem[] = [];
  public exportColumns: any[];
  public exportExcelColumns: any[];

  public employeeTypeDropdown: SelectItem[] = [];

  public fromDate: Date;
  public toDate: Date;
  public allCheckbox: boolean = true;
  public pipe = new DatePipe("en-US");
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
          value: 2,
        },
      ];

      this.cols = [
        { field: "FinanancialYear", header: "Year" },
        { field: "process_name", header: "Process" },

        { field: "CategoryToSkillLevelMaster_title", header: "Skill Level" },

        {
          field: "TrainingProgramMaster_title",
          header: "Program Title",
        },
        { field: "TRAININGPROGRAM_ID_FROM_DATE", header: "Start Date" },
        { field: "TRAININGPROGRAM_ID_TO_DATE", header: "End Date" },
        { field: "evalmarks", header: "Evaluation Performance" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      this.exportExcelColumns = this.cols.map((col) => ({
        header: col.header,
        key: col.field,
        width: 32,
      }));
    }
  }

  getEmployee() {
    console.log(this.emptype, this.empname);
    if (!!this.emptype && !!this.empname) {
      this.service
        .getEmployeeHistoryCardofEmployee(this.empname)
        .subscribe((data) => {
          this.employeeList = data;
          console.log(this.employeeList);
        });
    } else {
      return this.messageService.add({
        key: "t1",
        severity: "error",
        summary: "Error",
        detail: "No Data Selected to export",
      });
    }
  }

  onChangeEmpType() {
    var type;
    this.emptype == 1 ? (type = 1) : (type = 0);
    var EMPLOYEE_QUERY = {
      TableNames: "employeemaster",
      fieldNames: "*",
      condition: `EMP_MASTER_EMP_TYPE=${type}`,
    };
    this.commonService.FillCombo(EMPLOYEE_QUERY).subscribe((data) => {
      this.employeeDropdown = [];

      for (let item of data) {
        this.employeeDropdown.push({
          label: item.EMP_MASTER_NAME,
          value: item.EMP_MASTER_ID,
        });
      }
    });
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
    doc.setTextColor(120);

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
  // exportExcel() {
  //   let workbook = new Workbook();

  //   let worksheet = workbook.addWorksheet("HistoryCard");

  //   rowValues[1] = 4;
  //   rowValues[5] = "Kyle";
  //   rowValues[9] = new Date();
  //   worksheet.addRow(rowValues);

  //   workbook.xlsx.writeBuffer().then((data) => {
  //     let blob = new Blob([data], {
  //       type:
  //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });
  //     fs.saveAs(
  //       blob,
  //       "EmployeeHistoryCard" + "_export_" + new Date().getTime()
  //     );
  //   });
  // }
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
    let worksheet = workbook.addWorksheet("HistoryCard");

    worksheet.mergeCells("B2:C2");
    worksheet.getCell("B2").value = "EMPLOYEE NUMBER";

    worksheet.getCell("D2").value = this.employeeList[0].EMP_MASTER_NUMBER;
    worksheet.getCell("E2").value = "EMPLOYEE NAME";
    worksheet.getCell("F2").value = this.employeeList[0].EMP_MASTER_NAME;
    worksheet.mergeCells("G2:N2");

    worksheet.getRows(2, 1).forEach((row) => {
      for (let i = 2; i <= 6; i++) {
        row.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        row.font = {
          size: 10,
          bold: true,
        };

        row.getCell(i).border = {
          top: { style: "thick" },
          left: { style: "thick" },
          bottom: { style: "thick" },

          right: { style: "thick" },
        };
      }
    });
    worksheet.getCell("G2").border = {
      left: { style: "thick" },
      top: { style: "thick" },

      right: { style: "thick" },
    };

    worksheet.mergeCells("B3:N6");
    worksheet.properties.defaultRowHeight = 35;
    // ... merged cells are linked
    worksheet.getCell("N6").value = "EMPLOYEE SKILL UPGRADATION HISTORY CARD";

    worksheet.getCell("N6").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.getCell("N6").border = {
      left: { style: "thick" },
      bottom: { style: "thick" },

      right: { style: "thick" },
    };

    worksheet.getCell("N6").font = {
      size: 20,
      underline: true,
      bold: true,
    };

    worksheet.mergeCells("B7:B8");
    worksheet.getCell("B7").value = "SR NO";

    worksheet.mergeCells("C7:C8");
    worksheet.getCell("C7").value = "YEAR";

    worksheet.mergeCells("D7:D8");
    worksheet.getCell("D7").value = "PROCESS";

    worksheet.mergeCells("E7:E8");
    worksheet.getCell("E7").value = "SKILL LEVEL";

    worksheet.mergeCells("F7:H7");
    worksheet.getCell("F7").value = "TRAINING GIVEN";

    worksheet.getCell("F8").value = "PROGRAM TITLE";

    worksheet.getCell("G8").value = "START DATE";

    worksheet.getCell("H8").value = "END DATE";

    worksheet.mergeCells("I7:I8");
    worksheet.getCell("I7").value = "EVALUATION PERFORMANCE";

    worksheet.mergeCells("J7:J8");
    worksheet.getCell("J7").value = "AVG PERFORMANCE";

    worksheet.mergeCells("K7:K8");
    worksheet.getCell("K7").value = "REMARK FROM HOD & HR";

    worksheet.mergeCells("L7:L8");
    worksheet.getCell("L7").value = "SKILL UPGRADATION STATUS ";

    worksheet.mergeCells("M7:M8");
    worksheet.getCell("M7").value = "ELIGIBLE FOR MULTI SKILLING ";

    worksheet.mergeCells("N7:N8");
    worksheet.getCell("N7").value = "MULTI SKILL DESCRIPTION";

    worksheet.getRows(7, 2).forEach((row) => {
      for (let i = 2; i <= 14; i++) {
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
      { width: 20 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
    ];

    this.employeeList.map((data) => {
      const rowValues = [];
      rowValues[2] = data.id;
      rowValues[3] = data.FinanancialYear;
      rowValues[4] = data.process_name;
      rowValues[5] = data.CategoryToSkillLevelMaster_title;
      rowValues[6] = data.TrainingProgramMaster_title;
      rowValues[7] = this.pipe.transform(
        data.TRAININGPROGRAM_ID_FROM_DATE,
        "mediumDate"
      );
      rowValues[8] = this.pipe.transform(
        data.TRAININGPROGRAM_ID_TO_DATE,
        "mediumDate"
      );
      rowValues[9] = data.evalmarks;
      rowValues[12] = data.CategoryToSkillLevelMaster_titleNextLevel;

      worksheet.addRow(rowValues, "n");
    });
    worksheet.getRows(9, this.employeeList.length).forEach((row) => {
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
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fs.saveAs(blob, "HistoryCard" + "_export_" + new Date().getTime());
    });
  }
}
