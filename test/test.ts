import {afterEach, beforeEach} from './helpers';

import test, {ExecutionContext, TitleOrCbMacro, TitleOrMacro} from 'ava';

import { Script } from '..';

test.beforeEach(beforeEach);
test.afterEach(afterEach);

test('returns itself', (t: ExecutionContext<any>) => {
  t.true(t.context.script instanceof Script);
});

test('sets a config object', (t: ExecutionContext<any>) => {
  const script = new Script(false);
  t.true(script instanceof Script);
});

test('renders name', (t: ExecutionContext<any>) => {
  const { script } = t.context;
  t.is(script.renderName(), 'script');
});

test('sets a default name', (t: ExecutionContext<any>) => {
  const { script } = t.context;
  t.is(script._name, 'script');
});
