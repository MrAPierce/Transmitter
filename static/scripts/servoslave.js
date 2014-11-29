var Slave = function (config, index) {
    JoyStick.call(this, config, index);

    this.outLabels = new Array(this.config.mixOutputs.length);
};

Slave.prototype = Object.create(JoyStick.prototype);
Slave.prototype.constructor = Slave;

Slave.prototype.Draw = function () {
    var _this = this;


    _this.OutputLabels = new Array(_this.config.mixOutputs.length);
    _this.OutputLastMoveData = new Array(_this.config.mixOutputs.length);

    _this.control.css({
        "position": "absolute",
        top: _this.config.position[0],
        left: _this.config.position[1]
    }).addClass('servoSlave ' + _this.config.cssClass);

    _this.control.on('channelchange', function (e, data) {
        document.getElementById(_this.selector + '_chan' + data.axisName).innerHTML = data.value;
    });

    var panel = $('<div class="slavePanel ui-widget ui-widget-content ui-corner-all"><div class="inputs"></div><div class="ui-state-highlight divider" style="width: 2px; height: 100%; display: inline-block; margin-right:3px;">&nbsp;</div><div class="outputs"></div></div>');
    _this.control.append(panel);



    for (var i = 0; i < _this.config.mix.length; i++) {

        var mix = _this.config.mix[i];
        var axis = _this.config.axis[mix.axis];

        var parentEventName = "control_" + mix.parent + "_move_" + mix.parentAxis;
        var parentControl = $('#control_' + mix.parent);

        parentControl[0].addEventListener(parentEventName, (function (axis, mix) {
            return function (e) {
                _this.TriggerMixMove(axis, mix, e.detail);
            };
        })(axis, mix));
    }



    for (var i = 0; i < _this.config.mixOutputs.length; i++) {

        var mixOutPut = _this.config.mixOutputs[i];

        _this.control[0].addEventListener(_this.selector + "_axismove", (function (output, i) {
            return function (e) {

                var data = e.detail;

                var values = [];
                for (var b = 0; b < output.axis.length; b++) {
                    var data = _this.lastMoveData[b];
                    if (data != null) {
                        values.push(_this.lastMoveData[b].raw);
                    }
                }

                if (values.length > 0) {
                    var value = parseInt(window[output.type].call(_this, output, values));

                    _this.OutputLastMoveData[i] = value;

                    var event = new CustomEvent("servoInputChange", {
                        bubbles: false,
                        cancelable: false,
                        detail: { channel: output.channel, value: value }
                    });

                    window.dispatchEvent(event);
                }


            };
        })(mixOutPut, i));
    }

    _this.BindMixing();


    
    _this.Labels();
    _this.Outputs();
    _this.AddNewUI();

    return { element: _this.control, container: _this.config.panel };
}


Slave.prototype.Update = function () {
    var _this = this;

    for (var i = 0; i < _this.config.axis.length; i++) {

        var lastmovedata = _this.lastMoveData[i];

        if (_this.labels[i] == null) {
            _this.labels[i] = document.getElementById(_this.selector + '_val' + i);
        }


        if (lastmovedata != null) {
            _this.labels[i].innerHTML = parseInt(lastmovedata.value);
        }
    }

    for (var i = 0; i < _this.config.mixOutputs.length; i++) {
        var outputdata = _this.OutputLastMoveData[i];

        if (_this.outLabels[i] == null) {
            _this.outLabels[i] = document.getElementById(_this.selector + '_outputval' + i);
        }

        if (outputdata != null) {
            _this.outLabels[i].innerHTML = parseInt(outputdata);
        }
    }

}

Slave.prototype.TriggerMixMove = function (axis, mix, parentMove) {
    var _this = this;



    var mapped = parentMove;
    if (axis != null) {
        mapped = _this.MapMixMove(mix, parentMove);
    }

    var data = {
        configId: _this.id,//_this.index,
        parentAxis: mix.parentAxis,
        axisId: mix.axis,
        channel: parseInt(axis.channel),
        value: mapped.value,
        raw: mapped.raw,
        parent: mix.parent
    };

    var event = new CustomEvent(_this.selector + "_move_" + mix.axis, {
        bubbles: false,
        cancelable: false,
        detail: data
    });


    _this.control[0].dispatchEvent(event);

    _this.control[0].dispatchEvent(new CustomEvent(_this.selector + "_axismove"));


    mapped = null;
    data = null;
    _this = null;

}

Slave.prototype.MapMixMove = function (mix, parentMove) {
    var _this = this;


    var limits = _this.config.axis[mix.axis].limits;

    var parentLimits = controls[parseInt(mix.parent)].axis[mix.parentAxis].limits;


    var value;
    if (parentMove.raw > parentLimits.center) {
        value = map(parentMove.raw, parentLimits.center, parentLimits.max, limits[mix.above[0]], limits[mix.above[1]]);
    }
    else {
        value = map(parentMove.raw, parentLimits.min, parentLimits.center, limits[mix.below[0]], limits[mix.below[1]]);
    }

    return { raw: value, value: _this.MapExpo(mix.axis, value).value };

}

Slave.prototype.Outputs = function () {
    var _this = this;
    if (_this.config.mixOutputs != null) {
        var panel = _this.control.find(".outputs");


        for (var i = 0; i < _this.config.mixOutputs.length; i++) {
            var mixOutput = _this.config.mixOutputs[i];
            if (mixOutput != null) {
                var chanSelector = _this.selector + '_outputchan' + i;
                var valSelector = _this.selector + '_outputval' + i;

                // Repeated
                var temp = Array(mixOutput.axis.length);
                for (var b = 0; b < mixOutput.axis.length; b++) {
                    temp[b] = _this.config.axis[mixOutput.axis[b]].limits.center;
                }

                var value = window[mixOutput.type].call(_this, mixOutput, temp);


                var output = $('<div class="slaveLabel output"><div class="channel ui-widget-content ui-corner-top" id="' + chanSelector + '">' + (parseInt(mixOutput.channel) + 1) + '</div><p  id="' + valSelector + '">' + value + '</p></div>');

                panel.append(output);

                
            }

        }
    }

}

Slave.prototype.Labels = function () {
    var _this = this;

    for (var i = 0; i < _this.config.axis.length; i++) {
        _this.AddLabel(i, _this.config.axis[i]);
    }

}

Slave.prototype.AddLabel = function (axis, config) {

    var _this = this;

    var panel = $('.inputs', _this.control)
    var chanSelector = _this.selector + '_chan' + axis;
    var valSelector = _this.selector + '_val' + axis;

    var axisElement = $('<div class="slaveLabel"><p  id="' + valSelector + '">' + config.limits.center + '</p></div>');

    //if (config.enabled) {

    var chanLabel = $('<div class="channel ui-widget-content ui-corner-top" id="' + chanSelector + '">' + (parseInt(config.channel) + 1) + '</div>');
    chanLabel.css('display', config.enabled ? 'block' : 'none');

        

        axisElement.append(chanLabel);

    //}

    panel.append(axisElement);

}

Slave.prototype.AddNewUI = function () {
    var _this = this;
    var tools = $('.joyTools', _this.control);

    var addNew = $('<a href="#" class="addNew">Add</a>');


    addNew.bind('click', function (e) {
        e.preventDefault();

        var $dialog = $("#servoSlaveAdd").tmpl(DefaultServoSettings);

        $dialog.dialog({
            buttons: {
                "Add": function () {

                    var axisConfig = DefaultServoSettings;
                    axisConfig.name = $('.name', $dialog).val();
                    axisConfig.axis = (NewAxis[Object.keys(_this.config.axis).length]).toUpperCase();
                    axisConfig.channel = $('.channel', $dialog).val();

                    _this.config.axis.push(axisConfig);

                    var controlDefs = JSON.parse(localStorage.controls);
                    controlDefs[_this.index] = _this.config;
                    localStorage.controls = JSON.stringify(controlDefs);

                    _this.AddLabel(_this.config.axis.length, axisConfig);

                    $(this).dialog("close");

                },
                "Close": function () {
                    $(this).dialog("close");
                }
            }
        });

    });

    tools.append(addNew);

}