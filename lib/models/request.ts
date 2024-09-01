import {Model} from "./model"

export interface AgentParams {
  model: Model;
  rerun?: boolean;
}

export interface AgentRequest {
  thread_id: string;
  document: AgentParams;
  planner: AgentParams;
  migrate: AgentParams;
  dir_struct: AgentParams;
  entry_path: string;
  output_path: string;
  legacy_language: string;
  legacy_framework: string;
  new_language: string;
  new_framework: string;
}