/**
 * Mesh Operation Types
 * 
 * Type definitions for mesh operations like createNode.
 * 
 * See: task.2025-11-28_refine-createnode
 */

import type { RdfSource } from "../rdf/types.js";

/**
 * Options for createNode operation
 * 
 * createNode no longer writes snapshots or metadata RDF.
 * It only scaffolds directory structure and writes _working shots.
 */
export interface CreateNodeOptions {
  /** Payload dataset as RdfSource (optional) */
  payloadDataset?: RdfSource;

  /** Reference dataset as RdfSource (optional) */
  referenceDataset?: RdfSource;

  /** Operational config as RdfSource (optional) */
  operationalConfig?: RdfSource;

  /** Inheritable config as RdfSource (optional) */
  inheritableConfig?: RdfSource;

  /** Inline README content (markdown) */
  readme?: string;

  /** Path to README file (markdown) */
  readmePath?: string;

  /** Allow initialization in non-empty directory (default: false) */
  allowNonEmpty?: boolean;
}

/**
 * Result of node creation operation
 */
export interface CreateNodeResult {
  /** Path to the created node */
  nodePath: string;

  /** Node slug derived from directory name */
  nodeSlug: string;

  /** Paths to created _working distributions */
  createdWorkingFlows: {
    reference?: string;
    payload?: string;
    configOp?: string;
    configInh?: string;
  };

  /** Path to node README if created */
  readmePath?: string;

  /** Paths to generated index.html files */
  indexPages: {
    node: string;
    meta: string;
    flows: string[];
    workingShots: string[];
  };
}
