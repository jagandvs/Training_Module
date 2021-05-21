import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "toggledata" })
export class ToggleData implements PipeTransform {
  transform(data: boolean, extension: string): string {
    if (extension == "boolean") {
      return data ? "Yes" : "No";
    } else if (extension == "approve") {
      return data ? "Approved" : "Not Approved";
    } else if (extension == "required") {
      return data ? "Required" : "Not Required";
    } else if (extension == "attendance") {
      return data ? "Present" : "Absent";
    }
  }
}
