import { ItemManagerModule, ModuleConfig } from '../abstract/Module';
import { AddOptions, ObjectAny } from '../common';
import EditorModel from '../editor/model/Editor';
import { get, stringToPath } from '../utils/mixins';
import DataRecord from './model/DataRecord';
import DataSource from './model/DataSource';
import DataSources from './model/DataSources';
import { DataSourceProps, DataSourcesEvents } from './types';

export default class DataSourceManager extends ItemManagerModule<ModuleConfig, DataSources> {
  storageKey = '';
  events = DataSourcesEvents;
  destroy(): void {}

  constructor(em: EditorModel) {
    super(em, 'DataSources', new DataSources([], em), DataSourcesEvents);
  }

  getValue(key: string | string[], defValue: any) {
    return get(this.getContext(), key, defValue);
  }

  add(props: DataSourceProps, opts: AddOptions = {}) {
    const { all } = this;
    props.id = props.id || this._createId();
    return all.add(props, opts);
  }

  get(id: string) {
    return this.all.get(id);
  }

  getContext() {
    return this.all.reduce((acc, ds) => {
      acc[ds.id] = ds.records.reduce((accR, dr, i) => {
        accR[i] = dr.attributes;
        accR[dr.id || i] = dr.attributes;
        return accR;
      }, {} as ObjectAny);
      return acc;
    }, {} as ObjectAny);
  }

  fromPath(path: string) {
    const result: [DataSource?, DataRecord?] = [];
    const [dsId, drId] = stringToPath(path || '');
    const dataSource = this.get(dsId);
    const dataRecord = dataSource?.records.get(drId);
    dataSource && result.push(dataSource);
    dataRecord && result.push(dataRecord);
    return result;
  }
}
