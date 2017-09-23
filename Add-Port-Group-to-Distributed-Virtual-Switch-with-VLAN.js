// Copyright 2016, VMware, Inc. All Rights Reserved

//
// VMware vRealize Orchestrator action sample
// Creates a distributed virtual portgroup on a vlan with static binding and auto expand enabled.
//

//Action Inputs:
// dvSwitch        - VC:VmwareDistributedVirtualSwitch
// dvPortGroupName - string
// vlan            - number
//
//Return type: VC:DistributedVirtualPortgroup

var DVPortgroupConfigSpec = new VcDVPortgroupConfigSpec()
DVPortgroupConfigSpec.name = dvPortGroupName;
DVPortgroupConfigSpec.numPorts = 128;
DVPortgroupConfigSpec.autoExpand = true;
DVPortgroupConfigSpec.defaultPortConfig = new VcVMwareDVSPortSetting();
DVPortgroupConfigSpec.defaultPortConfig.vlan = new VcVmwareDistributedVirtualSwitchVlanIdSpec();
DVPortgroupConfigSpec.defaultPortConfig.vlan.inherited = false;
DVPortgroupConfigSpec.defaultPortConfig.vlan.vlanId = vlan;
DVPortgroupConfigSpec.type = 'earlyBinding'; // possible values: earlyBinding, lateBinding, ephemeral

// The task requires an array
var specArray = new Array();
specArray.push(DVPortgroupConfigSpec);
var dvPortgroupCreationTask = dvSwitch.addDVPortgroup_Task(specArray);

//Wait until the task completes
var result = actionResult = System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(dvPortgroupCreationTask,true,3);

//find the newly created distributed virtual port group and return it.
var toReturn;
for each (portG in dvSwitch.portgroup) {
    if ( portG.config.name === dvPortGroupName ) {
        toReturn = portG;
        break;
    }
}

return toReturn;