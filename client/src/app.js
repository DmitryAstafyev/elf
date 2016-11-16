"use strict";
var Environment     = require('./environment/environment.js'),
    events          = require('./environment/events.js'),
    eventcaller     = require('./environment/events.caller.js'),
    objects         = require('./environment/objects.js'),
    binding         = require('./environment/binding.js'),
    unique          = require('./environment/unique.js'),
    Templates       = require('./environment/template.js'),
    Dialogs         = require('./elements/dialog.js'),
    Progress        = require('./elements/progress.js'),
    TextFileReader  = require('./environment/fileloader.js'),
    JSONRender      = require('./components/json.render.js'),
    Processes       = require('./components/processes.render.js'),
    Ajax            = require('./environment/ajax.js');

events.add(window, 'load', () => {
    function getResource() {
        var fileloaderinput = 'fileloaderinput',
            dialog_id = null;
        dialog_id = Dialogs.show({
            title: 'Welcome',
            content: 'To start you should select a source-file or you can use default source.<input id="' + fileloaderinput + '" type="file"/>',
            buttons: [
                {
                    caption: 'Get from my harddrive', callback: () => {
                        _node('*[id="' + fileloaderinput + '"]').events().add('change', (event) => {
                            if (event.target !== void 0 && event.target.files !== void 0 && event.target.files.length === 1) {
                                if (event.target.files[0].name !== '') {
                                    let ext = event.target.files[0].name.match(/\w*$/i);
                                    ext = ext instanceof Array ? (ext.length === 1 ? ext[0].toLowerCase() : null) : null;
                                    if (ext === 'json') {
                                        let testFileLoader = new TextFileReader(event.target.files[0]),
                                            progress_id = Progress.show({ caption: 'load file...' });
                                        testFileLoader.load((result, error) => {
                                            Progress.close(progress_id);
                                            if (typeof result !== 'undefined') {
                                                progress_id = Progress.show({ caption: 'parsing file...' });
                                                try {
                                                    data = JSON.parse(result);
                                                } catch (e) {
                                                } finally {
                                                    Progress.close(progress_id);
                                                    renderWays();
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                            return event;
                        });
                        _node('*[id="' + fileloaderinput + '"]').events().emulate('click');
                    }
                },
                {
                    caption: 'Use default data-source', callback: () => {
                        var request = Ajax('./data/elf.json', 'GET', null, {
                            success: function (result) {
                                data = result.parsed;
                                renderWays();
                            }
                        });
                        request.send();
                    }
                },
            ]
        });
    };
    function renderWays() {
        Dialogs.show({
            title   : 'How to render',
            content : 'Cool! We have some data. How do you want render it?',
            buttons : [
                {
                    caption: 'Show me structure of memory', callback: () => {
                        window['__data'] = data;
                        let processes   = new Processes(data),
                            progress_id = Progress.show({ caption: 'rendering object...' });
                        processes.render({
                            callback: () => {
                                Progress.close(progress_id);
                            }
                        });
                    },
                    close: true
                },
                {
                    caption: 'Just show me JSON object', callback: () => {
                        let JSONrender  = new JSONRender(),
                            progress_id = Progress.show({ caption: 'rendering object...' });
                        JSONrender.render({
                            data    : data,
                            callback: () => {
                                Progress.close(progress_id);
                            }
                        });
                    }
                },
            ]
        });
    };
    var data = null;
    getResource();
});

