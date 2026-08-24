import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-home',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
    providers: [ToastrService],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LandingPageComponent implements OnInit {

    ngOnInit() {

    }

    onSubmit() {

    }
}

