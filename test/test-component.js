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
        cheers() {
            console.log("Hello!!");
        }
    },
    before(self) {
        self.actions.cheers();
        console.log(self.host);
    }
});