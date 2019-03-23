import {Script} from "../../index";

export function beforeEach(t) {
  const script = new Script({});
  Object.assign(t.context, { script });
}

export function afterEach() {}

