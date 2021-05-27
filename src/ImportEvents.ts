import {REGION_TRANSFORMER_NAME,RegionEventTransformer} from './libs/event/RegionEvent'
import {DampnessBasisEvents} from './libs/device/event/DampnessEvent'
import {StateBasisEvents} from './libs/device/event/DeviceStateEvent'
import {ElectricityBasisEvents} from './libs/device/event/ElectricityMeterEvent'
import {FanLosedPresetBasisEvents} from './libs/device/event/FanLosedPresetSettedEvent'
import {GasMeterBasisEvents} from './libs/device/event/GasMeterEvent'
import {SwitchBasisEvents} from './libs/device/event/SwitchEvent'
import {TemperatureBasisEvents} from './libs/device/event/TemperatureEvent'
import {WaterBasisEvents} from './libs/device/event/WaterMetersEvent'
import {FanCoilBasisEvent} from './libs/device/event/FanCoilEvent'

import {DeviceBasisEvents} from './libs/event/DeviceEvent'
//import {DEVICE_LIFECYCLE_TRANSFORMER_NAME,DeviceLifecycleEventTransformer} from './libs/event/DeviceEvent'
import {WorkerContext} from './WorkerContext'

/**
 * 加载事件转换器和事件工厂
 */
export const ImportEvent = (workerContext: WorkerContext) => {
     workerContext.transformers.addEventTransformer(REGION_TRANSFORMER_NAME, new RegionEventTransformer());
    workerContext.transformers.addEventTransformer(DampnessBasisEvents.DEVICE_DAMPNESS_TRANSFORMER_NAME, new DampnessBasisEvents.DampnessToArrayEventTransformer());
    workerContext.transformers.addEventTransformer(StateBasisEvents.DEVICE_STATE_TRANSFORMER_NAME, new StateBasisEvents.StateEventTransformer());
    workerContext.transformers.addEventTransformer(ElectricityBasisEvents.DEVICE_ELECTRICITY_TRANSFORMER_NAME, new ElectricityBasisEvents.ElectricityEventTransformer());
    workerContext.transformers.addEventTransformer(FanLosedPresetBasisEvents.DEVICE_FANLOSEDPRESET_TRANSFORMER_NAME, new FanLosedPresetBasisEvents.FanLosedPresetSettedToArrayEventTransformer());
    workerContext.transformers.addEventTransformer(GasMeterBasisEvents.DEVICE_GAS_TRANSFORMER_NAME, new GasMeterBasisEvents.GasMeterEventformer());
    workerContext.transformers.addEventTransformer(SwitchBasisEvents.DEVICE_SWITCH_TRANSFORMER_NAME, new SwitchBasisEvents.SwitchEventTransformer());
    workerContext.transformers.addEventTransformer(TemperatureBasisEvents.DEVICE_TEMPERATURE_TRANSFORMER_NAME, new TemperatureBasisEvents.TemperatureToArrayEventTransformer());
    workerContext.transformers.addEventTransformer(WaterBasisEvents.DEVICE_WATER_TRANSFORMER_NAME, new WaterBasisEvents.WaterEventTransformer());
    workerContext.transformers.addEventTransformer(FanCoilBasisEvent.DEVICE_FanCoil_TRANSFORMER_NAME, new FanCoilBasisEvent.FanCoilEventTransformer());
    //设备安装、卸载、维保-----------------
    workerContext.transformers.addEventTransformer(DeviceBasisEvents.DEVICE_LIFECYCLE_TRANSFORMER_NAME, new DeviceBasisEvents.DeviceLifecycleEventTransformer());

}