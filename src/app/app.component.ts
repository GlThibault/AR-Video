import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
declare var AFRAME: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  promptEvent: any;

  constructor(private readonly swUpdate: SwUpdate,
              private readonly snackBar: MatSnackBar) {

    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'center';

    // If needed, ask to reload the app to update
    this.swUpdate.available.subscribe(() => {
      const snackUdpate = this.snackBar.open('Application update available', 'Reload', config);
      snackUdpate.onAction().subscribe(() => window.location.reload());
    });

    // If possible, ask to install de PWA
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      this.promptEvent = event;
      config.duration = 10000;
      const snackInstall = this.snackBar.open('Do you want to install the application to your device ?', 'Install', config);
      snackInstall.onAction().subscribe(() => this.addToHS());
    });

    // Component to play / pause the video on visible state
    AFRAME.registerComponent('vidhandler', {
      init() {
        this.toggle = false;
        const video = this.video = document.querySelector(this.el.attributes.src.value) as HTMLVideoElement;
        video.setAttribute('autoplay', 'autoplay');
        video.setAttribute('playsinline', 'playsinline');
        video.setAttribute('muted', 'true');

        if (/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())) {
          this.el.addEventListener('click', () => {
            const videos = document.querySelectorAll('.videos');
            videos.forEach((vid) => {
              const v = vid as HTMLVideoElement;
              v.play();
              v.pause();
            });
          });
        }

      },
      tick() {
        if (this.el.parentEl.object3D.visible === true) {
          if (!this.toggle) {
            this.toggle = true;
            this.video.play();
          }
        } else {
          if (this.toggle) {
            this.toggle = false;
            this.video.pause();
          }
        }
      }
    });

    // Component to open link to new tab
    AFRAME.registerComponent('mylink', {
      events: {
        click() {
          window.open(this.data.href, '_blank');
        }
      },
    });
  }

  // Add to Home Screen
  addToHS() {
    this.promptEvent.prompt();
    this.promptEvent.userChoice.then((choiceResult: { outcome: string; }) => {
      this.snackBar.open('PWA install ' + choiceResult.outcome, 'Ok', { duration: 3000 });
    });
  }
}
