import { Component, OnInit } from "@angular/core";
import { Workbook } from "exceljs";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Present_Skills } from "src/app/_helper/SM_CODE";
import { CommonService } from "src/app/_services/common.service";
import { ReportsService } from "../reports.service";
import * as fs from "file-saver";
import jsPDF from "jspdf";
@Component({
  selector: "app-present-skills",
  templateUrl: "./present-skills.component.html",
  styleUrls: ["./present-skills.component.css"],
})
export class PresentSkillsComponent implements OnInit {
  public employeeList: any[] = [];
  public menuAccess: boolean = true;
  public addAccess: boolean = true;
  public viewAccess: boolean = true;
  public updateAccess: boolean = true;
  public deleteAccess: boolean = true;
  public printAccess: boolean = true;
  public backDateAccess: boolean = true;
  public cols: any[];
  public exportExcelColumns: any[] = [];
  public emptype;

  public exportColumns: any[] = [];

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
      .checkRight(UM_CODE, Present_Skills, "checkRight")
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
        { field: "empno", header: "Unique Id" },
        { field: "EmpName", header: "Employee Name" },

        { field: "DepartmentName", header: "Department Name" },

        {
          field: "PresentSkill",
          header: "Present Skill",
        },
        { field: "QualifiedForMulti", header: "Qualified For Multi" },
      ];

      this.exportColumns = [
        { dataKey: "id", title: "SR NO" },

        { dataKey: "empno", title: "Unique Id" },
        { dataKey: "EmpName", title: "Employee Name" },

        { dataKey: "DepartmentName", title: "Department Name" },

        {
          dataKey: "PresentSkill",
          title: "Present Skill",
        },
        { dataKey: "QualifiedForMulti", title: "Qualified For Multi" },
      ];

      this.exportExcelColumns = [
        "SR NO",
        "Unique Id",
        "Employee Name",
        "Department Name",
        "Present Skill",
        "Qualified For Multi Skilling",
      ];
    }
  }

  onChangeEmpType() {
    if (this.emptype == 0 || this.emptype == 1) {
      this.employeeList = [];

      this.service.getpresentskills(this.emptype).subscribe((data) => {
        this.employeeList = data;
      });
    } else {
      this.employeeList = [];
    }
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
    doc.save("PresentSkills" + "_export_" + new Date().getTime());
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
    let worksheet = workbook.addWorksheet("Present Skill");

    worksheet.mergeCells("B2:G2");
    worksheet.properties.defaultRowHeight = 55;
    // ... merged cells are linked
    worksheet.getCell("B2").value = "PRESENT SKILLS";

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
      for (let i = 2; i <= 7; i++) {
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
      { width: 10 },
      { width: 20 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
    ];
    var i = 4;
    this.employeeList.map((data) => {
      const rowValues = [];
      rowValues[2] = data.id;

      rowValues[3] = data.empno;
      rowValues[4] = data.EmpName;
      rowValues[5] = data.DepartmentName;
      rowValues[6] = data.PresentSkill;
      rowValues[7] = data.QualifiedForMulti;

      worksheet.addRow(rowValues, "n");
    });
    worksheet.getRows(4, this.employeeList.length).forEach((row) => {
      for (let i = 2; i <= 7; i++) {
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
      fs.saveAs(blob, "PresentSkills" + "_export_" + new Date().getTime());
    });
  }
}
