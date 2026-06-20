import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiChat } from './chat';
import { BuiChatMessage } from './chat-message';

@Component({
  imports: [BuiChat, BuiChatMessage],
  template: `
    <div buiChat>
      <bui-chat-message role="assistant" name="Bot">Hello!</bui-chat-message>
      <bui-chat-message role="user" name="Ada Lovelace">Hi there</bui-chat-message>
    </div>
  `,
})
class TestHost {}

describe('BuiChat', () => {
  it('renders a log of messages with initials and bubbles', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[data-slot="chat"]')?.getAttribute('role')).toBe('log');
    const messages = root.querySelectorAll('[data-slot="chat-message"]');
    expect(messages).toHaveLength(2);
    expect(messages[0].textContent).toContain('Hello!');
    expect(messages[1].textContent).toContain('AL'); // initials from "Ada Lovelace"
  });
});
