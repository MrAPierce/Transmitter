var AnalogReader = function (config, c) {
    if (arguments.length == 0) return;
    this.config = config;
    
    this.index = c

}

AnalogReader.prototype.Init = function () {

    var _this = this;

    _this.data = [[0]];

    _this.selector = "control_" + _this.index;
    _this.uiSelector = "ui_" + _this.index;
    var control = $('<div class="control"></div>');
    control.attr("id", _this.selector);
    control.data("index", _this.index);
    _this.control = control;

}

AnalogReader.prototype.Draw = function () {
    var _this = this;

    _this.control.css({
        "width": _this.config.size[0],
        "height": _this.config.size[1],
        "position": "absolute",
        top: _this.config.position[0],
        left: _this.config.position[1]
    }).addClass('analogReader ' + _this.config.cssClass);

    var ui = $('<div class="ui"></div>');
    ui.attr('id', _this.uiSelector)
    ui.css({
        "width": _this.config.size[0],
        "height": _this.config.size[1],
        "font-size": "10px",
        "margin": "0",
        "border": "none"
    });



    var panel = $('<div class="readerPanel ui-widget ui-widget-content ui-corner-all"></div>');
    panel.css({
        "width": "100%",
        "height": "100%"
    });
    panel.append(ui);
    _this.control.append(panel);

    var editcontrol = $('<a href="#" class="editcontrol">Edit</a>');
    var tools = $('<div class="ui-widget joyTools ui-widget-content ui-corner-bottom"></div>');
    tools.append(editcontrol);
    _this.control.append(tools);

    _this.BindEdit();

    return { element: _this.control, container: _this.config.panel, drawComplete: _this.DrawComplete  };
}


AnalogReader.prototype.BindEdit = function () {
    
    var _this = this;

    var editcontrol = $('.editcontrol', _this.control);
    

    editcontrol.bind('click', function (e) {
        e.preventDefault();



        var $dialog = $("#controlConfig").tmpl(_this.config);

        $dialog.tabbedDialog(null, {
            width: 550,
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
                        $("#" + _this.selector).fadeOut(500, "linear", function () {

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

AnalogReader.prototype.DrawComplete = function() {
    var _this = this;


    //todo dynamic display types? gauge, chart, map?

    switch (_this.config.display) {
        case "gauge":

            var opts = _this.config.options;
            var reader = _this.config.reader;

            var typeprefix = reader.type;

            _this.ui = $.jqplot(_this.uiSelector, _this.data, {
                gridPadding: { top: 0, right: 0, bottom: 0, left: 0 },
                seriesDefaults: {
                    renderer: $.jqplot.MeterGaugeRenderer,
                    rendererOptions: {
                        min: opts.min,
                        label: opts.label,
                        labelHeightAdjust: opts.labelOffset,
                        max: opts.max,
                        intervals: opts.intervals,
                        intervalColors: opts.colours,
                        background: "transparent",
                        padding: 0,
                        ringWidth: "0",
                        hubRadius: "2"
                    }
                },
                grid: {
                    drawGridLines: false,
                    background: 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 0
                }
            });

            try {
                window.sendServerRequest({ type: typeprefix + 'Start', data: { ch: reader.channel, int: reader.interval } });
            }
            catch (e) { }

            $(window).on(typeprefix + "_" + reader.channel + "_data", function (evt, data) {
                _this.data = data;

                var val = eval(_this.config.reader.formula.replace('X', data));
                var range = _this.config.reader.range;
                var mappedtoRange = map(val, range.min, range.max, _this.config.options.min, _this.config.options.max);


                _this.ui.replot({ data: [[mappedtoRange]] });


            });

            var test = setInterval(function () {
                var testValue = 0 + (1024 - 0) * Math.random();

                $(window).trigger(typeprefix + "_" + reader.channel + "_data", [testValue]);
            }, reader.interval)

            break;
        default:
            alert('Render type not found');
            break;

    }




}

