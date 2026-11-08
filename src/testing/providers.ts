import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

/** Every spec runs the way the app does: zoneless, with a router available. */
export const TEST_PROVIDERS = [provideExperimentalZonelessChangeDetection(), provideRouter([])];
