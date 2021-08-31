const express = require('express')

const Lookup = require('node-yeelight-wifi').Lookup;
const Yeelight = require('node-yeelight-wifi').Yeelight;

const app = express()
const port = 80

app.use(express.static('static'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

let look = new Lookup();

look.on('detected', (light) => {
    light.on("failed", (error) => { console.log(error); });

    console.log('new yeelight detected: id=' + light.id + ' name=' + light.name);
    //console.log(light)
    app.post('/light/:requestInfo', function (req, res) {
        let mode = (req.params.requestInfo).split(';')[0]
        let params = (req.params.requestInfo).split(';')[1]
        console.log(mode + ' ' + params)

        switch (mode) {
            case 'refresh':
                light.updateState().then(() => {
                    console.log("success");
                    let rgb=light.rgb
                    rgb.r=Math.round(rgb.r)
                    rgb.g=Math.round(rgb.g)
                    rgb.b=Math.round(rgb.b)
                    let hsb=light.hsb
                    hsb.h=Math.round(hsb.h)
                    hsb.s=Math.round(hsb.s)
                    hsb.b=Math.round(hsb.b)
                    let state = { 'power': light.power, 'type': light.type, 'bright': light.bright, 'rgb': rgb, 'hsb': hsb }
                    res.send(state)
                })
                break;
            case 'onoff':
                light.setPower(!light.power).then(() => {
                    console.log('success');
                })

                break;
            case 'color':
                params = params.split(',').map(str => str = parseInt(str))
                console.log(params)
                light.setRGB(params).then(() => {
                    console.log("success");
                })
                break;
            case 'bright':
                light.setBright(parseInt(params)).then(() => {
                    console.log("success");
                })
                break;
            case 'ct':
                light.setCT(parseInt(params)).then(() => {
                    console.log("success");
                })
                break;
            case 'hsb':
                params = params.split(',').map(str => str = parseInt(str))
                console.log(params)
                light.setHSV(params).then(() => {
                    console.log("success");
                })
                break;
            case 'preset':
                let presetData = getPresetData(params)
                if (presetData.rgb == undefined) {
                    light.setBright(presetData.bright).then(() => {
                        light.setHSV(presetData.hsb).then(() => {
                            light.setCT(presetData.ct).then(() => {
                                console.log("success");
                            })
                        })
                    })
                }

                break;
            default:
                console.log("wrong POST request: " + mode)
                break;
        }


    })

});

function getPresetData(preset) {
    switch (preset) {
        case 'Default':
            return { 'bright': 80, 'hsb': [26, 22, 79], 'ct': 4778 }
        case 'Night':
            return { 'bright': 80, 'hsb': [27, 51, 83], 'ct': 3205 }
        case 'Ruchanie':
            return
        default:
            return null;
    }
}
