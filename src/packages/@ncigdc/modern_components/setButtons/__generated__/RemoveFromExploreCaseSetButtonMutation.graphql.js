/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule RemoveFromExploreCaseSetButtonMutation.graphql
 * @generated SignedSource<<7f5d0434787e7f94bee0595a26934bb2>>
 * @relayHash 5284f4736537d043b3aea73073071416
 * @flow
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type RelayIsDumb = {
  relay_is_dumb?: ?any;
};

export type RemoveFromExploreCaseSetButtonMutationResponse = {
  remove?: ?RemoveFromExploreCaseSetButtonMutationResponse_remove;
};

export type RemoveFromExploreCaseSetButtonMutationResponse_remove_explore_case = {
  set_id?: ?string;
};

export type RemoveFromExploreCaseSetButtonMutationResponse_remove_explore = {
  case?: ?RemoveFromExploreCaseSetButtonMutationResponse_remove_explore_case;
};

export type RemoveFromExploreCaseSetButtonMutationResponse_remove = {
  explore?: ?RemoveFromExploreCaseSetButtonMutationResponse_remove_explore;
};
*/


/*
mutation RemoveFromExploreCaseSetButtonMutation(
  $input: RemoveSetInput
  $never_used: RelayIsDumb
) {
  sets(input: $never_used) {
    remove {
      explore {
        case(input: $input) {
          set_id
        }
      }
    }
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "RemoveSetInput",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "never_used",
        "type": "RelayIsDumb",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveFromExploreCaseSetButtonMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "never_used",
            "type": "RelayIsDumb"
          }
        ],
        "concreteType": "Sets",
        "name": "sets",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "RemoveSet",
            "name": "remove",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "RemoveExploreSet",
                "name": "explore",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "input",
                        "variableName": "input",
                        "type": "RemoveSetInput"
                      }
                    ],
                    "concreteType": "RemoveCaseSet",
                    "name": "case",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "set_id",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "RemoveFromExploreCaseSetButtonMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "RemoveSetInput",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "never_used",
        "type": "RelayIsDumb",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "RemoveFromExploreCaseSetButtonMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "never_used",
            "type": "RelayIsDumb"
          }
        ],
        "concreteType": "Sets",
        "name": "sets",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "RemoveSet",
            "name": "remove",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "RemoveExploreSet",
                "name": "explore",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "input",
                        "variableName": "input",
                        "type": "RemoveSetInput"
                      }
                    ],
                    "concreteType": "RemoveCaseSet",
                    "name": "case",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "set_id",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation RemoveFromExploreCaseSetButtonMutation(\n  $input: RemoveSetInput\n  $never_used: RelayIsDumb\n) {\n  sets(input: $never_used) {\n    remove {\n      explore {\n        case(input: $input) {\n          set_id\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
