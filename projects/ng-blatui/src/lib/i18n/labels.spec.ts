import { computed, inject, Injectable, signal, type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { buiLabel, provideBuiLabels } from './labels';

/** Stands in for a translation library's service — ng-blatui knows nothing about its shape. */
@Injectable({ providedIn: 'root' })
class FakeTranslationService {
  readonly lang: WritableSignal<'en' | 'fr'> = signal('fr');
  translate(key: string): string {
    return this.lang() === 'fr' ? `${key}.fr` : `${key}.en`;
  }
}

/** Resolve a label the way a component's field initializer does. */
function resolve(override?: string) {
  return TestBed.runInInjectionContext(() => buiLabel('fileUploadRemove', signal(override)));
}

describe('buiLabel', () => {
  it('falls back to the built-in English label', () => {
    expect(resolve()()).toBe('Remove file');
  });

  it('takes a plain map, as it always has', () => {
    TestBed.configureTestingModule({
      providers: [provideBuiLabels({ fileUploadRemove: 'Supprimer le fichier' })],
    });
    expect(resolve()()).toBe('Supprimer le fichier');
    // A key left unset keeps its default.
    expect(
      TestBed.runInInjectionContext(() => buiLabel('bannerDismiss', signal(undefined)))(),
    ).toBe('Dismiss');
  });

  it("lets a component's own input win over the app's", () => {
    TestBed.configureTestingModule({
      providers: [provideBuiLabels({ fileUploadRemove: 'Supprimer le fichier' })],
    });
    expect(resolve('Retirer')()).toBe('Retirer');
  });

  it('follows a signal, so a language switched at runtime reaches every label', () => {
    const labels = signal({ fileUploadRemove: 'Supprimer le fichier' });
    TestBed.configureTestingModule({ providers: [provideBuiLabels(labels)] });
    const label = resolve();

    expect(label()).toBe('Supprimer le fichier');
    labels.set({ fileUploadRemove: 'Remove file' });
    expect(label()).toBe('Remove file');
  });

  it('runs a factory in an injection context, so any library can be reached', () => {
    TestBed.configureTestingModule({
      providers: [
        provideBuiLabels(() => {
          const translations = inject(FakeTranslationService);
          return computed(() => ({ fileUploadRemove: translations.translate('remove') }));
        }),
      ],
    });
    const label = resolve();
    expect(label()).toBe('remove.fr');

    TestBed.inject(FakeTranslationService).lang.set('en');
    expect(label()).toBe('remove.en');
  });
});
