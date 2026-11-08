import { ERAS } from '../data/profile';
import { highlight } from './highlight';

describe('highlight', () => {
  const kinds = (code: string) => highlight(code).filter(t => t.kind !== 'txt').map(t => `${t.kind}:${t.text}`);

  it('never loses or reorders characters', () => {
    for (const era of ERAS) {
      expect(highlight(era.code).map(t => t.text).join('')).withContext(era.id).toBe(era.code);
    }
  });

  it('recognises keywords, strings, comments, decorators and calls', () => {
    expect(kinds(`@Component({ selector: 'x' }) // done`)).toEqual([
      'dec:@Component', 'str:\'x\'', 'com:// done',
    ]);
    expect(kinds('const n = signal(0);')).toEqual(['kw:const', 'fn:signal', 'num:0']);
  });

  it('treats generics as code, not HTML tags', () => {
    expect(kinds('new Subject<void>()')).toEqual(['kw:new', 'kw:void']);
  });

  it('marks JSX elements as tags', () => {
    expect(kinds('return (<button>x</button>);')).toContain('tag:<button');
  });
});
