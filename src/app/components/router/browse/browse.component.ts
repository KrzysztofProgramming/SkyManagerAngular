import { HttpService } from './../../../services/http.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
