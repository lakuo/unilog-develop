import { Dispatch, SetStateAction } from 'react';
import { ErrorOption } from 'react-hook-form';

export type FormSetError = (
  name: 'new' | 'confirm' | 'current',
  error: ErrorOption
) => void;

export type FormReset<T> = (
  values?: T | undefined,
  omitResetState?:
    | Partial<{
        errors: boolean;
        isDirty: boolean;
        isSubmitted: boolean;
        touched: boolean;
        isValid: boolean;
        submitCount: boolean;
        dirtyFields: boolean;
      }>
    | undefined
) => void;

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type FlexGrow =
  | boolean
  | 2
  | 1
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | null
  | undefined;

export type PageState = 'none' | 'add' | 'edit' | 'delete';
