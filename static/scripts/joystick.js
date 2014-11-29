
var JoyStickNamedRanges = [{ text: "Min", value: "min" }, { text: "Cen", value: "center" }, { text: "Max", value: "max" }];
var JoyStickNamedAxis = [{ text: "X Axis", value: "X" }, { text: "Y Axis", value: "Y" }];
var DefaultServoSettings = { name: "ServoA", channel: 0, enabled: true, reverse: false, limits: { max: 560, min: 150, center: 327, rate: 100, expo: { above: 1.5, below: 1.5 } } };
var NewAxis = ("abcdefghijklmnopqrstuvwxyz").split("");
var DefaultMix = { name: "Mix", parent: null, axis: null, parentAxis: null, below: ["max", "center"], above: ["center", "max"] };
var Channels = new Array(18)
var DefaultTension = [{ name: "None", value: 0 }, { name: "Hard", value: 150 }, { name: "Medium", value: 300 }, { name: "Soft", value: 600 }];





var JoyStick = function (config, c) {
    if (arguments.length == 0) return;
    this.config = config;

    if (this.config.joySize) {

        this.max = new Array(2);
        this.mid = new Array(2);

        this.max[0] = (this.config.size[0] - this.config.joySize[0]);
        this.mid[0] = (this.max[0] / 2);

        this.max[1] = (this.config.size[1] - this.config.joySize[1]);
        this.mid[1] = (this.max[1] / 2);
    }

    
    this.index = c

    this.labels = new Array(this.config.axis.length);
    this.lastMove = new Array(this.config.axis.length);
    this.lastMoveData = new Array(this.config.axis.length);
    this.JoyPosition = new Array(this.config.axis.length);

    this.MappedValues = {};
    this.pointerUp = false;
}

JoyStick.prototype.Draw = function () {

    var _this = this;

    _this.control.css({
        "width": _this.config.size[0],
        "height": _this.config.size[1],
        "position": "absolute",
        top: _this.config.position[0],
        left: _this.config.position[1]
    }).addClass("joyStickControl " + _this.config.cssClass);

    var outer = $('<div></div>');
    outer.css({
        "width": "100%",
        "height": "100%",
    }).addClass("joyContainer ui-widget ui-widget-content ui-corner-all");

    _this.Outer = outer[0];

    var outerOverlay = $('<div></div>');
    outerOverlay.css({
        "width": "100%",
        "height": "100%",
        "position": "absolute",
        "top": 0,
        "left": 0
    }).addClass("joyOverlay");


    var top = (_this.config.size[1] - _this.config.joySize[1]) / 2;
    var left = (_this.config.size[0] - _this.config.joySize[0]) / 2;

    var joy = $('<div></div>');
    joy.css({
        "width": _this.config.joySize[0],
        "height": _this.config.joySize[1],
        "position": "absolute",
        "z-index": 100,
        top: top,
        left: left
    }).addClass("joystick ui-corner-all");

    _this.Joy = joy[0];

    _this.JoyPosition[0] = left;
    _this.JoyPosition[1] = top;


    var labels = $('<div class="joyLabels ui-widget-content ui-corner-top"></div>')

    for (var i = 0; i < _this.config.axis.length; i++) {
        if (_this.config.axis[i].enabled) {
            var valueSelector = _this.selector + '_val' + i;
            var channel = $('<span class="chan ui-corner-all" id="' + _this.selector + '_chan' + i + '">' + (_this.config.axis[i].channel + 1) + '</span>');
            var value = $('<span class="info ui-corner-all" id="' + valueSelector + '">' + _this.lastMove[i] + '</span>');

            labels.append(channel);
            labels.append(value);

            
        }
    }



    outer.append(joy);
    _this.control.append(labels);
    _this.control.append(outer);
    _this.control.append(outerOverlay);
    _this.BindUI();

    return { element: _this.control, container: _this.config.panel };

}

JoyStick.prototype.Update = function() {
    var _this = this;

    if (_this.Joy != null && !_this.pointerUp) {
        _this.Joy.style.left = _this.JoyPosition[0] + 'px';
        _this.Joy.style.top = _this.JoyPosition[1] + 'px';
    }

    for (var i = 0; i < _this.config.axis.length; i++) {
        
        var lastmovedata = _this.lastMoveData[i];

        if (_this.labels[i] == null) {
            _this.labels[i] = document.getElementById(_this.selector + '_val' + i);
        }

        if(lastmovedata != null)
        {
             _this.labels[i].innerHTML = parseInt(lastmovedata.value);
        }
    }

}


JoyStick.prototype.BindUI = function() {

    var _this = this;
    var joy = $('.joystick', _this.control);

    joy[0].addEventListener('pointerdown', function (evt) {
        
        joy.addClass("move");
        _this.pointerUp = false;
        if (evt.target.setPointerCapture) {
            evt.target.setPointerCapture(evt.pointerId);
        }

        var left = parseInt((evt.clientX - _this.config.position[1]) - (_this.config.joySize[1] / 2));
        var top = parseInt((evt.clientY - _this.config.position[0]) - (_this.config.joySize[0] / 2));

        

        
        evt = null;
    });

    joy[0].addEventListener('pointermove', function (evt) {

        

        _this.pointerUp = false;
        joy.clearQueue();
        joy.stop();

        var el = this;
        
        var left = parseInt((evt.clientX - _this.config.position[1]) - (_this.config.joySize[1] / 2));
        var top = parseInt((evt.clientY - _this.config.position[0]) - (_this.config.joySize[0] / 2));


        var limitX = left <= 0 || left + _this.config.joySize[0] >= _this.config.size[0];
        var limitY = top <= 0 || top + _this.config.joySize[1] >= _this.config.size[1];

        if (_this.config.axis[0].enabled && !limitX) {

            _this.JoyPosition[0] = left;

            var last = _this.MapValue(0, left);

            var event = new CustomEvent(_this.selector + "_move_0", {
                bubbles: false,
                cancelable: false,
                detail: {
                    configId: _this.index,
                    axisId: 0,
                    channel: _this.config.axis[0].channel,
                    value: last.value,
                    raw: last.raw
                }
            });


            _this.control[0].dispatchEvent(event);

            event = null;

            last = null;

        }


        if (_this.config.axis[1].enabled && !limitY) {

            _this.JoyPosition[1] = top;

            var last = _this.MapValue(1, top);

            var event = new CustomEvent(_this.selector + "_move_1", {
                bubbles: false,
                cancelable: false,
                detail: {
                    configId: _this.index,
                    axisId: 1,
                    channel: _this.config.axis[1].channel,
                    value: last.value,
                    raw: last.raw
                }
            });

            _this.control[0].dispatchEvent(event);

            event = null;
            last = null;
        }

        top = null;
        limitY = null;

        left = null;
        limitX = null;

        el = null;
        evt = null;

    });

    joy[0].addEventListener('pointerup', function (evt) {
        joy.removeClass("move");
        

        if (_this.config.axis[0].springTension == 0 && _this.config.axis[1].springTension == 0) {
            _this.pointerUp = true;
        }


        if (_this.config.axis[0].springTension != 0) {

                joy.animate({
                    left: _this.mid[0]
                }, {
                    duration: parseInt(_this.config.axis[0].springTension),
                    queue: false,
                    step: function (val, propChanged) {


                        if (_this.config.axis[0].enabled) {
                                var mapped = _this.MapValue(0, val);
                                _this.lastMoveData[0] = mapped;

                                var event = new CustomEvent(_this.selector + "_move_" + 0, {
                                    bubbles: false,
                                    cancelable: false,
                                    detail: {
                                        configId: _this.index,
                                        axisId: 0,
                                        channel: _this.config.axis[0].channel,
                                        value: mapped.value,
                                        raw: mapped.raw
                                    }
                                });

                                _this.control[0].dispatchEvent(event);
                                event = null;

                                mapped = null;
                        }
                    },
                    complete: function () { _this.pointerUp = true; }
                });
        }

        if (_this.config.axis[1].springTension != 0) {


            joy.animate({
                top: _this.mid[1]
            }, {
                duration: parseInt(_this.config.axis[1].springTension),
                queue: false,
                step: function (val, propChanged) {


                    if (_this.config.axis[1].enabled) {
                        var mapped = _this.MapValue(1, val);
                        _this.lastMoveData[1] = mapped;

                        var event = new CustomEvent(_this.selector + "_move_" + 1, {
                            bubbles: false,
                            cancelable: false,
                            detail: {
                                configId: _this.index,
                                axisId: 1,
                                channel: _this.config.axis[1].channel,
                                value: mapped.value,
                                raw: mapped.raw
                            }
                        });

                        _this.control[0].dispatchEvent(event);
                        event = null;

                        mapped = null;
                    }
                },
                complete: function () { _this.pointerUp = true; }
            });

        }


    });


    // Disables visual
    joy[0].addEventListener("MSHoldVisual", function (e) { e.preventDefault(); });
    // Disables menu
    joy[0].addEventListener("contextmenu", function (e) { e.preventDefault(); });


}

JoyStick.prototype.BindEdit = function () {
    var _this = this;

    var editcontrol = $('.editcontrol', _this.control);
    

    editcontrol.bind('click', function (e) {
        e.preventDefault();

        

        var $dialog = $("#controlConfig").tmpl(_this.config);

        $dialog.find('.parentMix').each(function (i, el) {
            var element = $(el);
            element.bind('change',function() {
                
                var mixIndex = element.data("index");
                var locationIndex = element.data("id");
                var location = element.data("location");
                _this.config.mix[mixIndex][location][locationIndex] = $(this).val();

            });

        });

        $dialog.find('.mixprop').each(function (i, el) {
            var element = $(el);
            element.bind('change', function () {

                var mixIndex = element.data("index");
                var prop = element.data("type");
                _this.config.mix[mixIndex][prop] = $(this).val();

            });
        });

        $dialog.find('.minmax').each(function (i, el) {
            var element = $(el);
            var axisId = String($(el).data('axis')).toUpperCase();

            element.slider({
                range: true,
                min: 100,
                max: 600,
                values: [element.data('min'), element.data('max')],
                slide: function (event, ui) {

                    var max = ui.values[1], min = ui.values[0]

                    _this.config.axis[axisId].limits.min = min;
                    _this.config.axis[axisId].limits.max = max;

                    var nonBlocking = setTimeout(function () {
                        $('#min' + axisId, $dialog).html(min);
                        $('#max' + axisId, $dialog).html(max);
                    }, 0);

                    _this.DrawExpo($('.expoChart' + axisId, $dialog), axisId);

                }
            });

        });

        $dialog.find('.spinner').each(function (i, el) {
            var element = $(el);
            element.spinner({
                min: 0,
                spin: function (event, ui) {

                    if (element.data("type") == "position") {
                        if (element.data("index") == "0") {
                            _this.control.css({ "top": ui.value });
                            _this.config.position[0] = ui.value
                        }
                        else {
                            _this.control.css({ "left": ui.value });
                            _this.config.position[1] = ui.value
                        }
                    }

                    if (element.data("type") == "size") {
                        if (element.data("index") == "0") {
                            //_this.control.css({ "top": ui.value });
                            _this.config.size[0] = ui.value
                        }
                        else {
                            //_this.control.css({ "left": ui.value });
                            _this.config.size[1] = ui.value
                        }
                    }
                }
            });
        });


        $dialog.find('.controlprop').each(function (i, el) {
            var element = $(el);
            element.bind('change', function () {
                var propType = element.data("type");
                _this.config[propType] = $(this).val();
            });

        });

        $('.newMix', $dialog).button({
            icons: {
                primary: "ui-icon-plus"
            }
        });

        $('.newMix', $dialog).bind('click', function (e) {
            e.preventDefault();

            var mix = {};
            $.extend(mix,DefaultMix);

            mix.parent = 0;
            mix.parentAxis = 0;
            mix.axis = 0;
            if (_this.config.mix == null) {

                _this.config.mix = [];
            }
            
            _this.config.mix.push(mix);

            var mixRows = $("#mixTemplate").tmpl(_this.config);
            $('.mixing', $dialog).empty();
            $('.mixing', $dialog).append(mixRows);

            _this.BindMixUI($dialog);


        });

        

        $dialog.find('.center').each(function (i, el) {
            var element = $(el);
            var axisId = String($(el).data('axis')).toUpperCase();
            var minmax = $("#minmax" + axisId, $dialog).slider("option", "values");
            element.slider({
                min: minmax[0],
                max: minmax[1],
                value: $(el).data('value'),
                slide: function (event, ui) {
                    var axis = _this.config.axis[axisId];
                    axis.limits.center = ui.value;


                    var nonBlocking = setTimeout(function () {
                        $("#currentCenter" + axisId ).html(ui.value);
                    }, 0);

                    _this.control.trigger("centermove", axisId);
                }
            });
        });

        $dialog.find('.expo').each(function (i, el) {
            var element = $(el);
            var axisId = String($(el).data('axis')).toUpperCase();
            var location = String($(el).data('location'));
            element.slider({
                min: 0,
                max: 10,
                step: .05,
                value: $(el).data('value'),
                slide: function (event, ui) {
                    var axis = _this.config.axis[axisId];

                    axis.limits.expo[location] = ui.value;

                    var nonBlocking = setTimeout(function () {
                        $(".expoValue" + axisId + location).html(ui.value);
                    }, 0);

                    _this.control.trigger("expomove", axisId);
                }
            });

        });

        $dialog.find('.axisId').each(function (i, el) {
            var element = $(el);
            var axisId = String($(el).data('axis')).toUpperCase();
            element.bind('change', function () {
                _this.config.axis[axisId].name = $(this).val();
            });

        });

        $dialog.find('.channel').each(function (i, el) {
            var element = $(el);
            var axisId = String($(el).data('axis')).toUpperCase();

            element.bind('change', function () {
                var val = $(this).val();
                _this.control.trigger("channelchange", { axisId: axisId, value: val });
                _this.config.axis[axisId].channel = parseInt(val);
            });
        });

        $dialog.find('.springTension').each(function (i, el) {
            var element = $(el);
            var axisId = String($(el).data('axis')).toUpperCase();

            element.bind('change', function () {
                var val = $(this).val();
                _this.config.axis[axisId].springTension = parseInt(val);
            });
        });


        $dialog.find('.reverse').each(function (i, el) {
            var element = $(el);
            var axisId = String($(el).data('axis')).toUpperCase();
            element.bind('change', function () {
                _this.config.axis[axisId].reverse = $(this).is(':checked');
            });
        });

        $dialog.find('.active').each(function (i, el) {
            var element = $(el);
            var axisId = String($(el).data('axis')).toUpperCase();
            element.bind('change', function () {
                var enabled = $(this).is(':checked');
                _this.config.axis[axisId].enabled = enabled;
                $('#' + _this.selector + '_chan' + axisId).css('display', enabled ? 'block' : 'none');
            });
        });

        _this.control.on("centermove expomove", function (e, axis) {
            var e = setTimeout(function () {
                _this.DrawExpo($('.expoChart' + axis, $dialog), axis);
            }, 0);
        });


        _this.BindMixUI($dialog);

        $dialog.tabbedDialog({
            activate: function (e, ui) {
                var axisId = $(ui.newTab).data("axis");
                if (axisId != null) {
                    _this.DrawExpo($('.expoChart' + axisId, $(this)), axisId);
                }

            }
        }, {
            width: 600,
            height: 500,
            dialogClass: 'controlConfig',
            buttons: {
                "Save Config": function () {
                    var controlDefs = JSON.parse(localStorage.controls);
                    controlDefs[_this.index] = _this.config;
                    localStorage.controls = JSON.stringify(controlDefs);
                    window.location.reload();
                },
                "Close": function () {
                    $(this).dialog("close");
                    //$(this).remove();
                },
                "Delete": function () {

                    var sure = confirm("Delete?");

                    if (sure) {
                        var _dialog = $(this);
                        var controlDefs = JSON.parse(localStorage.controls);
                        $("#"+_this.selector).fadeOut(500, "linear", function () {
                            
                            delete controlDefs[_this.index];
                            localStorage.controls = JSON.stringify(controlDefs);
                            _dialog.dialog("close");
                            //_dialog.remove();
                        }).remove();
                    }

                }
            }
        });

    });


}

JoyStick.prototype.Init = function () {
    var _this = this;

    _this.selector = "control_" + _this.index;
    var control = $('<div class="control"></div>');
    control.attr("id", _this.selector);
    control.data("index", _this.index);
    _this.control = control;

    var editcontrol = $('<a href="#" class="editcontrol">Edit</a>');
    var tools = $('<div class="ui-widget joyTools ui-widget-content ui-corner-bottom"></div>');
    tools.append(editcontrol);
    _this.control.append(tools);


    for (var i = 0; i < _this.config.axis.length; i++) {
        var axis = _this.config.axis[i];
        _this.lastMove[i] = axis.limits.center;
    }


    _this.labels = new Array(this.config.axis.length);

    _this.BindEdit();
    _this.BindMixing();

    _this.control.on('channelchange', function (e, data) {
        document.getElementById(_this.selector + '_chan' + data.axisId).innerHTML = data.value;
    });


}

JoyStick.prototype.BindMixUI = function (d) {
    var _this = this;

    var remove = d.find('.removeMix');
    var props = d.find('.mixprop');
    var parentMix = d.find('.parentMix');

    remove.each(function (i, el) {
        var element = $(el);
        element.button({
            icons: {
                primary: "ui-icon-close"
            },
            text: false
        });

    });

    remove.unbind('click');

    remove.bind('click', function (e) {

        var element = $(this);
        var index = element.data("index");
        var sure = confirm("Delete?")
        if (sure) {

            element.parent().parent().remove();
            _this.config.mix.splice(index, 1);
        }
    });

    props.each(function (i, el) {
        var element = $(el);
        element.unbind('change');
        element.bind('change', function (e) {
            var el = $(this);
            var type = el.data("type");
            var index = el.data("index");

            if (type == "parent") {

                $('.parentAxis' + index, d).empty();
                var newParent = controls[el.val()];
                var newParentAxis = controls[el.val()].axis;

                $(newParentAxis).each(function (i, obj) {
                    $('.parentAxis' + index, d).append('<option value="' + i + '">' + (obj.channel + 1) + ' - ' + obj.name + '</option>');
                });
                _this.config.mix[index].parentAxis = 0;
                //_this.config.mix[index].parent
            }

            _this.config.mix[index][el.data("type")] = el.val();

            console.dir(_this.config.mix[index]);

        });
    });

    parentMix.each(function (i, el) {
        var element = $(el);
        element.unbind('change');
        element.bind('change', function (e) {
            var el = $(this);
            //var mixConfig = 0
            _this.config.mix[parseInt(el.data("index"))][el.data("location")][parseInt(el.data("id"))] = el.val();
            console.dir(_this.config.mix[parseInt(el.data("index"))]);
            //_this.BindMixing();
        });
    });

}

JoyStick.prototype.BindMixing = function () {
    var _this = this;

    var i = 0;
    while (_this.config.axis[i]) {


        _this.control[0].addEventListener(_this.selector + "_move_" + i, function (e) {

            var data = e.detail;

            var axis = _this.config.axis[data.axisId];

            if (axis.enabled) {

                var event = new CustomEvent("servoInputChange", {
                    bubbles: false,
                    cancelable: false,
                    detail: { channel: data.channel, value: data.value }
                });


                window.dispatchEvent(event);

            }

            _this.lastMoveData[data.axisId] = data;

        });

        i++;
    }



}

JoyStick.prototype.DrawExpo = function (el, axisId) {

    var _this = this;
    el.empty();
    var chart = $('<div></div>');
    el.append(chart);
    chart.jqplot(_this.ExpoRange(axisId), {
        title: axisId + ' Throttle Curve',
        width: 520,
        height: 200,
        axesDefaults: 
        { 
            tickOptions: { 
                formatString: '%d' 
            } 
        },
        axes: {
            xaxis: {
                min: _this.config.axis[axisId].limits.min,
                max: _this.config.axis[axisId].limits.max,
            },
            yaxis: {
                min: _this.config.axis[axisId].limits.min,
                max: _this.config.axis[axisId].limits.max
            }
        },
        seriesDefaults: {
            linePattern: 'solid',
            showMarker: false,
            lineWidth: 1.5,
            shadow: false,
            width: 500
        },
        grid: { drawBorder: false, shadow: false },

        canvasOverlay: {
            show: true,
            objects: [
                {
                    horizontalLine: {
                        name: 'mid',
                        linePattern: 'dotted',
                        y: _this.config.axis[axisId].limits.center,
                        lineWidth: 1.5,
                        color: 'rgb(100, 55, 124)',
                        shadow: false
                    }
                },
            ]
        }

    });

    chart = null;
}

JoyStick.prototype.MapValue = function (axisId, value) {

    var _this = this;

    var axisLims = _this.config.axis[axisId].limits;
    var val = value;

    

    // Is axis reversed

    if (_this.config.axis[axisId].reverse) {
        val = ((value + _this.config.joySize[axisId]) - _this.config.size[axisId]) * -1;
    }

    //Map joystick position to servo end points
    if (val < _this.mid[axisId]) {
        val = map(val, 0, _this.mid[axisId], axisLims.min, axisLims.center);
    }
    else {
        val = map(val, _this.mid[axisId], _this.max[axisId], axisLims.center, axisLims.max);
    }


    

    return _this.MapExpo(axisId, val);

}

JoyStick.prototype.MapExpo = function (axisId, mapped) {
    var _this = this;
    var axisLims = _this.config.axis[axisId].limits;


    var mappedValue = null;
    if (_this.MappedValues[axisId] == null) {
        _this.MappedValues[axisId] = [];
    }

    for (var i = 0; i < _this.MappedValues[axisId].length; i++) {
        if (_this.MappedValues[axisId][i].raw == mapped) {
            mappedValue = _this.MappedValues[axisId][i];
        }
    }


    if (mappedValue == null) {

        if (mapped > axisLims.center) {
            var expoValue = axisLims.center + Math.pow((mapped - axisLims.center) / (axisLims.max - axisLims.center), axisLims.expo.above) * (axisLims.max - axisLims.center);
            mappedValue = { raw: mapped, value: expoValue };
            _this.MappedValues[axisId].push(mappedValue);

        }
        else {
            var expoValue = axisLims.center - Math.pow((axisLims.center - mapped) / (axisLims.center - axisLims.min), axisLims.expo.below) * (axisLims.center - axisLims.min);
            mappedValue = { raw: mapped, value: expoValue };
            _this.MappedValues[axisId].push(mappedValue);

        }
    }




    return mappedValue;

}

JoyStick.prototype.ExpoRange = function(axisId)
{
    var _this = this;

    var data = [[]];
    for (var i = _this.config.axis[axisId].limits.min; i <= _this.config.axis[axisId].limits.max; i++) {
        data[0].push([i, _this.MapExpo(axisId,i)]);
    }

    return data;
}
