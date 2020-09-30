/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { InternalQueryHandler } from './QueryHandler.js';
import { ElementHandle, JSHandle } from './JSHandle.js';
import { Protocol } from 'devtools-protocol';
import { CDPSession } from './Connection.js';

async function queryAXTree(
  client: CDPSession,
  element: ElementHandle,
  accessibleName?: string,
  role?: string
): Promise<Protocol.Accessibility.AXNode[]> {
  const { nodes } = await client.send('Accessibility.queryAXTree', {
    objectId: element._remoteObject.objectId,
    accessibleName,
    role,
  });
  const filteredNodes: Protocol.Accessibility.AXNode[] = nodes.filter(
    (node: Protocol.Accessibility.AXNode) => node.role.value !== 'text'
  );
  return filteredNodes;
}

/*
 * The aria selectors are on the form '<computed name>&<computed role>'.
 * The following examples showcase how the syntax works wrt. querying:
 * - 'title&heading' queries for elements with computed name 'title' and role 'heading'.
 * - '&img' queries for elements with role 'img' and any name.
 * - 'label' queries for elements with name 'label' and any role.
 */
function parseAriaSelector(selector: string): { name?: string; role?: string } {
  const s = selector.split('&');
  const name = s[0] || undefined;
  const role = s.length > 1 ? s[1] : undefined;
  return { name, role };
}

const queryOne = async (
  element: ElementHandle,
  selector: string
): Promise<ElementHandle | null> => {
  const exeCtx = element.executionContext();
  const { name, role } = parseAriaSelector(selector);
  const res = await queryAXTree(exeCtx._client, element, name, role);
  if (res.length < 1) {
    return null;
  }
  return exeCtx._adoptBackendNodeId(res[0].backendDOMNodeId);
};

const waitFor = () => {
  throw new Error('waitForSelector is not supported for aria selectors');
};

const queryAll = async (
  element: ElementHandle,
  selector: string
): Promise<ElementHandle[]> => {
  const exeCtx = element.executionContext();
  const { name, role } = parseAriaSelector(selector);
  const res = await queryAXTree(exeCtx._client, element, name, role);
  return Promise.all(
    res.map((axNode) => exeCtx._adoptBackendNodeId(axNode.backendDOMNodeId))
  );
};

const queryAllArray = async (
  element: ElementHandle,
  selector: string
): Promise<JSHandle> => {
  const elementHandles = await queryAll(element, selector);
  const exeCtx = element.executionContext();
  const jsHandle = exeCtx.evaluateHandle(
    (...elements) => Array.from(elements),
    ...elementHandles
  );
  return jsHandle;
};

/**
 * @internal
 */
export const ariaHandler: InternalQueryHandler = {
  queryOne,
  waitFor,
  queryAll,
  queryAllArray,
};
