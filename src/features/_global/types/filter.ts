import { BaseDataTableFilterValueItem } from "../components";

export interface BaseTableFilter {
  schoolOptions?: BaseDataTableFilterValueItem[];
  classroomOptions?: BaseDataTableFilterValueItem[];
  statusOptions?: BaseDataTableFilterValueItem[];
  courseOptions?: BaseDataTableFilterValueItem[];
}
