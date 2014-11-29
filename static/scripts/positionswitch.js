var PositionSwitch = function (config, c) {
    this.config = config;
    this.index = c;
}

PositionSwitch.prototype.Init = function () {

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


}

PositionSwitch.prototype.Draw = function () {
    var _this = this;

    _this.control.css({
        "position": "absolute",
        top: _this.config.position[0],
        left: _this.config.position[1]
    }).addClass("positionSwitchControl " + _this.config.cssClass);

    if (_this.config.direction == "vertical") {
        _this.control.css({ 'width': '150' });
    }

    var container = $('<div class="posPanel"></div>');
    container.attr('id', _this.selector + '_posSwitch');

    for (var i = 0; i < _this.config.switches.length; i++) {

        var swch = _this.config.switches[i];
        var id = _this.selector + ' _rd_' + i;
        var radio = $('<input type="radio" />');
        radio.attr('id',id);
        radio.attr('name', _this.selector + '_rd');
        radio.attr('value', swch.value);
        if (_this.config.selected == i) {
            radio.attr('checked', 'checked');
        }
        var label = $('<label>' + swch.name + '</label>');
        label.attr('for', id);
        if (this.config.direction == "vertical") {
            label.css({ 'display': 'block' })
        }
        container.append(radio);
        container.append(label);

    }


    $("input", container).change(function (e) {
        $(window).trigger("servoInputChange", { channel: _this.config.channel, value: $(this).val() });
    });

    if (this.config.direction == "vertical") {
        container.buttonsetv();
    }
    else {
        container.buttonset();
    }

    container.find("label").unbind("mouseup");

    _this.control.append(container);

    return { element: _this.control, container: _this.config.panel };

}