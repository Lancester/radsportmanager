import test from 'node:test';import assert from 'node:assert/strict';import {localGroupReference} from '../src/engine/race/local-group-reference.ts';
const base={stablePack:true,ownSpeedMps:17.8,frontSpeedMps:18.8,frontAccelerationMps2:-.04,groupSpeedMps:18.9,groupAccelerationMps2:-.27,distanceFromGroupFrontM:140};
test('R24: leicht bremsendes, davoneilendes Vorderrad vor stark bremsender Fernspitze',()=>{const x=localGroupReference(base);assert.equal(x.accelerationMps2,-.04)});
test('R24: auch alte Gegenrichtung und echte lokale Mehrverzögerung bleiben',()=>{assert.equal(localGroupReference({...base,frontAccelerationMps2:.02}).accelerationMps2,.02);const y=localGroupReference({...base,frontAccelerationMps2:-.31});assert.ok(y.accelerationMps2<-.27)});
test('R24: nur bei real öffnendem Abstand und stable-pack',()=>{assert.ok(localGroupReference({...base,frontSpeedMps:17.7}).accelerationMps2<-.04);assert.equal(localGroupReference({...base,stablePack:false}).accelerationMps2,-.27)});
