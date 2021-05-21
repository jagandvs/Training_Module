import { Component, OnInit } from "@angular/core";
import { CalendarOptions } from "@fullcalendar/angular";

@Component({
  selector: "app-calenderview",
  templateUrl: "./calenderview.component.html",
  styleUrls: ["./calenderview.component.css"],
})
export class CalenderviewComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: "timeGridWeek",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    dateClick: this.handleDateClick.bind(this),
    events: [
      {
        title: "All Day Event",
        start: "2021-05-01",
      },
      {
        title: "Long Event",
        start: "2021-05-07",
        end: "2021-05-10",
      },
      {
        title: "Repeating Event",
        start: "2021-05-09T16:00:00",
      },
    ],
  };
  constructor() {}

  ngOnInit(): void {}

  handleDateClick(arg) {
    console.log(arg);
    alert("date click! " + arg.dateStr);
  }
}
