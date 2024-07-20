import {Model} from "./model"

export interface AgentParams {
  model: Model;
  rerun?: boolean;
}

export interface AgentRequest {
  document: AgentParams;
  planner: AgentParams;
  migrate: AgentParams;
  entry_path: string;
  output_path: string;
  legacy_language: string;
  legacy_framework: string;
  new_language: string;
  new_framework: string;
}