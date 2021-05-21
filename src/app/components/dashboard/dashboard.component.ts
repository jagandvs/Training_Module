import { Component, OnInit } from "@angular/core";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
import { CalendarOptions } from "@fullcalendar/angular";
import { CommonService } from "src/app/_services/common.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  public user: string;
  public welcomeMessage: string;

  public calendarOptions: CalendarOptions;
  constructor(private service: CommonService) {}

  ngOnInit(): void {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.user = currentUser.user.UM_USERNAME;
    let empid = 0;
    if (!currentUser.user.UM_IS_ADMIN) {
      empid = currentUser.user.EMP_CODE;
    }
    this.service.trainingcalender(empid).subscribe((data) => {
      let events = [];
      console.log(data);
      data.map((value) => {
        events.push({
          title: value.TrainingProgramMaster_title,
          start: value.fromdatetime,
          end: value.toatetime,
        });
        this.calendarOptions = {
          initialView: "dayGridMonth",
          dateClick: this.handleDateClick.bind(this), // bind is important!

          headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          },
          events: events,
        };
      });
    });
    var time = new Date().getHours();

    if (time > 5 && time < 12) {
      this.welcomeMessage = "Good Morning, Let's Do Some Great Stuff";
    } else if (time > 12 && time < 3) {
      this.welcomeMessage = "Good Afternoon";
    } else {
      this.welcomeMessage = "Good Evening";
    }

    console.log(time);
  }

  handleDateClick(arg) {
    alert("date click! " + arg.dateStr);
  }
}
