import { Component, OnInit } from '@angular/core';

export interface NavItem{
  label: string;
  routerLink?: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  
  public navItems: NavItem[] = [
    {label: "Upload Data", routerLink: '/upload'},
    {label: "Browse Data", routerLink: '/browse'}
  ]
  
  constructor() { }

  ngOnInit(): void {
  }

}
