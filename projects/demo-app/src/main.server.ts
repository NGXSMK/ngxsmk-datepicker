import '@angular/compiler';
import { mergeApplicationConfig } from '@angular/core';
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { RenderMode, provideServerRendering, withRoutes } from '@angular/ssr';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const serverConfig = mergeApplicationConfig(appConfig, {
  providers: [provideServerRendering(withRoutes([{ path: '**', renderMode: RenderMode.Prerender }]))],
});

export default (context: BootstrapContext) => bootstrapApplication(AppComponent, serverConfig, context);
