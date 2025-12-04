/**
 * Mesh Operation Types
 * 
 * Type definitions for mesh operations like createKnop.
 * 
 * See: task.2025-11-28_refine-createknop
 */

import type { RdfSource } from "../rdf/types.js";

/**
 * Options for createKnop operation
 * 
 * createKnop no longer writes slices or metadata RDF.
 * It only scaffolds directory structure and writes _working shots.
 */
export interface CreateKnopOptions {
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
 * Result of knop creation operation
 */
export interface CreateKnopResult {
  /** Path to the created knop */
  knopPath: string;

  /** Knop slug derived from directory name */
  knopSlug: string;

  /** Paths to created _working distributions */
  createdWorkingFlows: {
    reference?: string;
    payload?: string;
    configOp?: string;
    configInh?: string;
  };

  /** Path to knop README if created */
  readmePath?: string;

  /** Paths to generated index.html files */
  indexPages: {
    knop: string;
    meta: string;
    flows: string[];
    workingShots: string[];
  };
}
