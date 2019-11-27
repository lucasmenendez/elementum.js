import Component from '../dist/component.esm.js';

Component.create({
    tag: "test-component",
    template: `
        <style>
            h1 {
                color: red;
                font-size: 40;
            }
        </style>
        <h1>Hey</h1>
    `,
    actions: {
        cheers(self) {
            console.log(self.host);
        }
    },
    rendered(self) {
        self.actions.cheers(self);
    }
});