import {Model} from "./model"

export interface AgentParams {
  model: Model;
  rerun?: boolean;
}

export interface BaseAgentRequest {
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
  isRanAgent: boolean;
}

export interface CreateAgentRequest extends BaseAgentRequest{}

export interface SendAgentRequest extends BaseAgentRequest{
  id: number;
}

