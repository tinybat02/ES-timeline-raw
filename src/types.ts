import { DataFrame, Field, Vector } from '@grafana/data';

export interface PanelOptions {
  timezone: string;
}

export const defaults: PanelOptions = {
  timezone: 'Europe/Berlin',
};

export interface Buffer extends Vector {
  buffer: Array<{ hash_id: string; vendor: string; timestamp: number }>;
}

export interface FieldBuffer extends Field<any, Vector> {
  values: Buffer;
}

export interface Frame extends DataFrame {
  fields: FieldBuffer[];
}
