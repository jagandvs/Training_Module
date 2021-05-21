import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../components/shared-components/header/header.component";
import { FooterComponent } from "../components/shared-components/footer/footer.component";
import { ToggleData } from "../toggledata.pipe";

@NgModule({
  declarations: [HeaderComponent, FooterComponent, ToggleData],
  imports: [CommonModule],
  exports: [HeaderComponent, FooterComponent, ToggleData],
})
export class SharedModule {}
