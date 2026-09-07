import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTagsInput } from './tags-input';

@Component({
  imports: [BuiTagsInput],
  template: `<bui-tags-input [(tags)]="tags" />`,
})
class TestHost {
  readonly tags = signal<string[]>(['ng']);
}

@Component({
  imports: [BuiTagsInput],
  template: `<bui-tags-input
    [(tags)]="tags"
    [suggestions]="suggestions"
    [allowCreate]="allowCreate()"
    (created)="created.set($event)"
  />`,
})
class SuggestingHost {
  readonly tags = signal<string[]>([]);
  readonly suggestions = ['frontend', 'front-office', 'design'];
  readonly allowCreate = signal(true);
  readonly created = signal<string | null>(null);
}

function type(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

function options(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('[role="option"]')];
}

describe('BuiTagsInput', () => {
  it('adds a tag on Enter and removes via the chip button', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector<HTMLInputElement>('input')!;

    type(input, 'rxjs');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.tags()).toEqual(['ng', 'rxjs']);

    root.querySelector<HTMLButtonElement>('span button')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.tags()).toEqual(['rxjs']);
  });

  it('opens no suggestion panel when none are given', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;

    type(input, 'rx');
    fixture.detectChanges();
    expect(options()).toHaveLength(0);
    expect(input.getAttribute('role')).toBeNull();
  });

  it('filters the suggestions and picks the highlighted one without emitting created', () => {
    const fixture = TestBed.createComponent(SuggestingHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;

    type(input, 'fro');
    fixture.detectChanges();
    // Two matching suggestions, then the create row.
    expect(options().map((option) => option.textContent.trim())).toEqual([
      'frontend',
      'front-office',
      'Create “fro”',
    ]);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toBe(options()[0].id);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.tags()).toEqual(['front-office']);
    expect(fixture.componentInstance.created()).toBeNull();
  });

  it('creates an unknown tag and reports it on created', () => {
    const fixture = TestBed.createComponent(SuggestingHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;

    type(input, 'ssr');
    fixture.detectChanges();
    expect(options().map((option) => option.textContent.trim())).toEqual(['Create “ssr”']);

    options()[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.tags()).toEqual(['ssr']);
    expect(fixture.componentInstance.created()).toBe('ssr');
  });

  it('folds a differently-cased entry onto the existing suggestion', () => {
    const fixture = TestBed.createComponent(SuggestingHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;

    type(input, 'Frontend');
    fixture.detectChanges();
    // An exact (case-insensitive) suggestion match offers no create row.
    expect(options().map((option) => option.textContent.trim())).toEqual(['frontend']);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.tags()).toEqual(['frontend']);
    expect(fixture.componentInstance.created()).toBeNull();
  });

  it('refuses an unknown tag when allowCreate is false', () => {
    const fixture = TestBed.createComponent(SuggestingHost);
    fixture.componentInstance.allowCreate.set(false);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;

    type(input, 'ssr');
    fixture.detectChanges();
    expect(options()).toHaveLength(0);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.tags()).toEqual([]);
  });

  it('drops an already-picked tag from the suggestions', () => {
    const fixture = TestBed.createComponent(SuggestingHost);
    fixture.componentInstance.tags.set(['design']);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(options().map((option) => option.textContent.trim())).toEqual([
      'frontend',
      'front-office',
    ]);
  });
});
