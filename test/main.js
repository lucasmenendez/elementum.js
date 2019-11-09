import { Component } from '../dist/component.js';

Component.load('./test-component.html')
    .then(component => {
        console.log(component);
    });