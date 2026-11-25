import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PRIMARY_OUTLET, RouterStateSnapshot, TitleStrategy } from '@angular/router';

const siteUrl = 'https://ngxsmk.github.io/ngxsmk-datepicker/';

@Injectable()
export class DemoTitleStrategy extends TitleStrategy {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const route = snapshot.root.children.find((child) => child.outlet === PRIMARY_OUTLET);
    const title = this.buildTitle(snapshot);
    const description = route?.data['description'];
    if (!route || !title || typeof description !== 'string') return;

    const path = route.routeConfig?.path;
    const canonicalUrl = path ? new URL(`${path}/`, siteUrl).href : siteUrl;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const previousSchema = this.document.getElementById('demo-project-schema');
    previousSchema?.parentNode?.removeChild(previousSchema);
    if (!path) {
      const schema = this.document.createElement('script');
      schema.id = 'demo-project-schema';
      schema.type = 'application/ld+json';
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'ngxsmk-datepicker',
        url: siteUrl,
        description,
        codeRepository: 'https://github.com/NGXSMK/ngxsmk-datepicker',
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'Angular',
        license: 'https://opensource.org/licenses/MIT',
      });
      this.document.head.appendChild(schema);
    }
  }
}
