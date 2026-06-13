import { describe, it, expect } from 'vitest';
import { calcBrewProgress } from './brew';

describe('calcBrewProgress', () => {
  it('should return 0 for an empty idea', () => {
    const idea = {};
    expect(calcBrewProgress(idea)).toBe(0);
  });

  it('should add 10 points for a main thought', () => {
    const idea = { thought: 'This is a main thought' };
    expect(calcBrewProgress(idea)).toBe(10);
  });

  it('should add points for thoughts (6 per thought, max 30)', () => {
    const idea = { 
      thoughts: [
        { text: 'T1' },
        { text: 'T2' },
        { text: 'T3' },
        { text: 'T4' },
        { text: 'T5' },
        { text: 'T6' }
      ] 
    };
    expect(calcBrewProgress(idea)).toBe(30); // 6 * 5 = 30 (max)
  });

  it('should add 10 points for tags', () => {
    const idea = { tags: ['tag1'] };
    expect(calcBrewProgress(idea)).toBe(10);
  });

  it('should add 10 points for links', () => {
    const idea = { links: [{ url: 'https://example.com' }] };
    expect(calcBrewProgress(idea)).toBe(10);
  });

  it('should add points for scripts (10 for having, +10 for filled content)', () => {
    const idea = { 
      scripts: [
        { title: 'S1', content: 'C1' },
        { title: 'S2', content: '' }
      ] 
    };
    // 10 (has scripts) + Math.round((1/2) * 10) = 10 + 5 = 15
    expect(calcBrewProgress(idea)).toBe(15);
  });

  it('should add points for custom fields (5 per filled field, max 15)', () => {
    const idea = { 
      fields: [
        { type: 'text', value: 'V1' },
        { type: 'checkbox', value: true },
        { type: 'number', value: 42 },
        { type: 'text', value: '' }
      ] 
    };
    // 3 filled * 5 = 15
    expect(calcBrewProgress(idea)).toBe(15);
  });

  it('should add points for tasks (10 for having, up to 15 for completion)', () => {
    const idea = { 
      tasks: [
        { text: 'Task 1', done: true },
        { text: 'Task 2', done: false }
      ] 
    };
    // 10 (has tasks) + Math.round((1/2) * 15) = 10 + 8 = 18
    expect(calcBrewProgress(idea)).toBe(18);
  });

  it('should cap the score at 100', () => {
    const idea = {
      thought: 'Yes',
      thoughts: Array(5).fill({ text: 'T' }), // 30
      tags: ['T'], // 10
      links: [{}], // 10
      scripts: [{ title: 'S', content: 'C' }], // 10 + 10 = 20
      fields: Array(3).fill({ type: 'text', value: 'V' }), // 15
      tasks: [{ text: 'Task', done: true }] // 10 + 15 = 25
    };
    // 10 + 30 + 10 + 10 + 20 + 15 + 25 = 120 -> capped at 100
    expect(calcBrewProgress(idea)).toBe(100);
  });
});
