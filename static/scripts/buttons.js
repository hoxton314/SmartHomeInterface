
$(document).ready(function () {
    function reqData() {
        $.post("/light/refresh", function (data) {
            for (objectData in data) {
                $('#' + objectData).html(objectData + ': ' + JSON.stringify(data[objectData]))
                console.log('#' + objectData + ' ' + JSON.stringify(data[objectData]))
            }


            console.log(data)
            if (data.power) {
                $('#buttonOnOff').css('background-color', 'lightgray')
            } else {
                $('#buttonOnOff').css('background-color', '#161616')
            }

            $('#colorpicker').val(rgbToHex(data.rgb.r, data.rgb.g, data.rgb.b))
            $('#brightpicker').val(data.bright)
            //$('#CTpicker').val()
            $('#Hpicker').val(data.hsb.h)
            $('#Spicker').val(data.hsb.s)
            $('#Bpicker').val(data.hsb.b)

            refreshRange()
        });


    }
    reqData()
    function refreshRange() {

        for (i = 0; i < $('input[type=range]').length; i++) {
            let element = $('input[type=range]')[i]
            $('#' + element.id + 'Value').html($(element).val())
            console.log('#' + element.id + 'Value')
            $(element).attr("title", $(element).val());
            console.log(element)
        }
    }
    refreshRange()
    $('#buttonRefresh').on('click', () => {
        reqData()
    })

    $('#buttonOnOff').on('click', () => {
        $.post("/light/onoff");
    })

    $('#buttonColor').on('click', () => {
        let color = hexToRgb($('#colorpicker').val())
        console.log(color)
        $.post("/light/color;" + color);
    })
    $('#buttonBright').on('click', () => {
        let brightness = $('#brightpicker').val()
        console.log(brightness)
        $.post("/light/bright;" + brightness);
    })
    $('#buttonCT').on('click', () => {
        let ct = $('#CTpicker').val()
        console.log(ct)
        $.post("/light/ct;" + ct);
    })
    $('#buttonHSB').on('click', () => {
        let hsb = [$('#Hpicker').val(), $('#Spicker').val(), $('#Bpicker').val()]
        console.log(hsb)
        $.post("/light/hsb;" + hsb);
    })

    $('input[type=range]').change(function () {
        $('#' + this.id + 'Value').html($(this).val())
        console.log('#' + this.id + 'Value')
        $(this).attr("title", $(this).val());
    });

    $('#buttonPreset').on('click', () => {
        let preset = $('#presetpicker option:selected').text()
        $.post("/light/preset;" + preset);
    })


});


function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? (parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16)) : null;
}



function rgbToHex(r, g, b) {
    r = Math.round(r)
    g = Math.round(g)
    b = Math.round(b)
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}