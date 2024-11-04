import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor'; // Asegúrate de ajustar la ruta

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importa esto
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared.module';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterLink,

    HttpClientModule, // yo
    BrowserAnimationsModule, // yo
    SharedModule // yo
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Permite múltiples interceptores
    },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
