import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ccd-markdown',
  template: `
    <div><markdown class="markdown" [innerHTML]="content"></markdown></div>
  `
})
export class MarkdownComponent implements OnInit {

  @Input()
  content: string;

  ngOnInit(): void {
    this.content = this.content.replace(/  \n/g, '<br>');
  }
}
