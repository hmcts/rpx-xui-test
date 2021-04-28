import { Component, Input } from '@angular/core';

@Component({
    selector: 'cut-footer-bar',
    template: `
      <footer class="group js-footer" id="footer" role="footer">
        <div [class.full-screen]="!isSolicitor" class="footer-wrapper">

          <!-- Condition: Solicitor -->
          <div *ngIf="isSolicitor" class="footer-meta">
            <div class="footer-meta-inner">
              <ng-content select="[footerSolsNavLinks]"></ng-content>
              <div class="open-government-licence">
                <p class="logo"><a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" rel="license">Open Government Licence</a></p>
                <p>All content is available under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" rel="license">Open Government Licence v3.0</a>, except where otherwise stated</p>
              </div>
            </div>

            <div class="copyright">
              <a href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/copyright-and-re-use/crown-copyright/">© Crown copyright</a>
            </div>
          </div>

          <!-- Condition: Case Worker -->
          <div *ngIf="!isSolicitor" class="footer-meta">
            <div class="title">
              <span class="footer-text">Help</span>
            </div>
            <div class="email">
              <span class="footer-text">Email: <a href="mailto:{{email}}">{{email}}</a></span>
            </div>
            <div class="phone">
              <span class="footer-text">Phone: {{phone}}</span>
            </div>
            <div class="work-hours">
              <span class="footer-text">{{workhours}}</span>
            </div>
            <ng-content select="[footerCaseWorkerNavLinks]"></ng-content>
          </div>

        </div>
      </footer>
    `,
    styles: [`
      .footer-text{color:#231F20;margin-top:5px;font-size:16px;font-weight:normal;font-style:normal;font-stretch:normal;letter-spacing:normal}#footer .full-screen{max-width:100%;padding-left:20px}
    `]
})
export class FooterComponent {

  @Input()
  public email: string;

  @Input()
  public isSolicitor: boolean;

  @Input()
  public phone: string;

  @Input()
  public workhours: string;

}
