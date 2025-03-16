const chai = require('chai');
const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const babel = require('@babel/core');

const { expect } = chai;
const { JSDOM } = jsdom;

// Load HTML
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8');

// Transform JS using Babel
const jsFilePath = path.resolve(__dirname, '..', 'src/index.js');
const { code: transformedScript } = babel.transformFileSync(jsFilePath, {
  presets: ['@babel/preset-env'],
});

// Set up JSDOM
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  resources: 'usable',
});

// Append the script to the DOM
const scriptEl = dom.window.document.createElement('script');
scriptEl.textContent = transformedScript;
dom.window.document.body.appendChild(scriptEl);

// Expose global variables
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
global.Text = dom.window.Text;
global.XMLHttpRequest = dom.window.XMLHttpRequest;
global.expect = expect;

// Wait for DOM content to load before running tests
describe('Handling form submission', () => {
  let form;
  let input;
  let taskList;

  before((done) => {
    form = document.querySelector('#create-task-form');
    input = document.querySelector('#new-task-description');
    taskList = document.querySelector('#tasks');

    // Wait a tick for scripts to run
    setTimeout(() => done(), 50);
  });

  it('adds task to the DOM when the form is submitted', () => {
    input.value = 'Wash the dishes';
    const submitEvent = new dom.window.Event('submit', {
      bubbles: true,
      cancelable: true,
    });
    form.dispatchEvent(submitEvent);

    expect(taskList.textContent).to.include('Wash the dishes');
  });
});
