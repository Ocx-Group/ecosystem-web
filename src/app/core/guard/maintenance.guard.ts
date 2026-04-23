import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { ConfigurationService } from '../service/configuration-service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {
  constructor(private router: Router, private configurationService: ConfigurationService) {}

  canActivate(): Observable<boolean> {
    return this.configurationService.checkMaintenance().pipe(
      map((isUnderMaintenance) => {
        if (isUnderMaintenance) {
          this.router.navigate(['/maintenance']);
          return false;
        }
        return true;
      }),
      catchError((error) => {
        console.error('Unable to resolve maintenance state.', error);
        return of(true);
      })
    );
  }
}
