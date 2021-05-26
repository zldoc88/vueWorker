import {REGION_TRANSFORMER_NAME,RegionEventTransformer} from './libs/event/RegionEvent'
import {DEVICE_DAMPNESS_TRANSFORMER_NAME,DampnessToArrayEventTransformer} from './libs/device/event/DampnessEvent'
import {DEVICE_STATE_TRANSFORMER_NAME,StateEventTransformer} from './libs/device/event/DeviceStateEvent'
import {DEVICE_ELECTRICITY_TRANSFORMER_NAME,ElectricityEventTransformer} from './libs/device/event/ElectricityMeterEvent'
import {DEVICE_FANLOSEDPRESET_TRANSFORMER_NAME,FanLosedPresetSettedToArrayEventTransformer} from './libs/device/event/FanLosedPresetSettedEvent'
import {DEVICE_GAS_TRANSFORMER_NAME,GasMeterEventformer} from './libs/device/event/GasMeterEvent'
import {DEVICE_SWITCH_TRANSFORMER_NAME,SwitchEventTransformer} from './libs/device/event/SwitchEvent'
import {DEVICE_TEMPERATURE_TRANSFORMER_NAME,TemperatureToArrayEventTransformer} from './libs/device/event/TemperatureEvent'
import {DEVICE_WATER_TRANSFORMER_NAME,WaterEventTransformer} from './libs/device/event/WaterMetersEvent'

import {DEVICE_LIFECYCLE_TRANSFORMER_NAME,DeviceLifecycleEventTransformer} from './libs/event/DeviceEvent'
import {WorkerContext} from './WorkerContext'

/**
 * 加载事件转换器和事件工厂
 */
export const ImportEvent = (workerContext: WorkerContext) => {
    workerContext.transformers.addEventTransformer(REGION_TRANSFORMER_NAME, new RegionEventTransformer());
    workerContext.transformers.addEventTransformer(DEVICE_DAMPNESS_TRANSFORMER_NAME, new DampnessToArrayEventTransformer());
    workerContext.transformers.addEventTransformer(DEVICE_STATE_TRANSFORMER_NAME, new StateEventTransformer());
    workerContext.transformers.addEventTransformer(DEVICE_ELECTRICITY_TRANSFORMER_NAME, new ElectricityEventTransformer());
    workerContext.transformers.addEventTransformer(DEVICE_FANLOSEDPRESET_TRANSFORMER_NAME, new FanLosedPresetSettedToArrayEventTransformer());
    workerContext.transformers.addEventTransformer(DEVICE_GAS_TRANSFORMER_NAME, new GasMeterEventformer());
    workerContext.transformers.addEventTransformer(DEVICE_SWITCH_TRANSFORMER_NAME, new SwitchEventTransformer());
    workerContext.transformers.addEventTransformer(DEVICE_TEMPERATURE_TRANSFORMER_NAME, new TemperatureToArrayEventTransformer());
    workerContext.transformers.addEventTransformer(DEVICE_WATER_TRANSFORMER_NAME, new WaterEventTransformer());
    //设备安装、卸载、维保-----------------
    workerContext.transformers.addEventTransformer(DEVICE_LIFECYCLE_TRANSFORMER_NAME, new DeviceLifecycleEventTransformer());

}